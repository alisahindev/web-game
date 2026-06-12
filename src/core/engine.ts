import type { Grid, Kind, Pos, Special } from './types';
import { mulberry32 } from './rng';
import type { RNG } from './rng';
import {
  applyGravity,
  createBoard,
  findValidMoves,
  kindsFor,
  makeTile,
  refillBoard,
  shuffleBoard,
  swapCells,
} from './board';
import { findMatches, key } from './match';
import type { Spawn } from './match';
import { comboClear, expandWithSpecials } from './specials';
import type { BlastCtx } from './specials';

export interface ObjectiveDef {
  type: 'score' | 'clearAny' | 'collect' | 'special';
  target: number;
  kind?: Kind;
  specials?: Special[];
  label?: string;
}

export interface Objective extends ObjectiveDef {
  progress: number;
}

export interface LevelDef {
  id: number;
  name: string;
  moves: number;
  kinds: number;
  baseScore: number;
  objectives: ObjectiveDef[];
}

export type Step =
  | { type: 'swap'; a: Pos; b: Pos }
  | { type: 'revert'; a: Pos; b: Pos }
  | { type: 'clear'; cells: { pos: Pos; id: number }[]; wave: number }
  | { type: 'spawn'; pos: Pos; id: number; kind: Kind | null; special: Special }
  | { type: 'fall'; moves: { id: number; from: Pos; to: Pos }[] }
  | { type: 'refill'; tiles: { id: number; pos: Pos; kind: Kind; dropFrom: number }[] }
  | { type: 'shuffle'; moves: { id: number; to: Pos }[] }
  | { type: 'finale'; bonus: number };

const ROWS = 8;
const COLS = 8;
const CASCADE_SOFT_CAP = 12;
const CASCADE_HARD_CAP = 40;
const TILE_SCORE = 20;
const FINALE_BONUS_PER_MOVE = 60;

export class Engine {
  readonly level: LevelDef;
  grid: Grid;
  movesLeft: number;
  score = 0;
  status: 'playing' | 'won' | 'lost' = 'playing';
  objectives: Objective[];
  private rng: RNG;
  private kinds: Kind[];

  constructor(level: LevelDef, seed = Date.now()) {
    this.level = level;
    this.rng = mulberry32(seed >>> 0);
    this.kinds = kindsFor(level.kinds);
    this.grid = createBoard(ROWS, COLS, this.kinds, this.rng);
    this.movesLeft = level.moves;
    this.objectives = level.objectives.map((o) => ({ ...o, progress: 0 }));
  }

  get rows(): number {
    return ROWS;
  }

  get cols(): number {
    return COLS;
  }

  objectivesDone(): boolean {
    return this.objectives.every((o) => o.progress >= o.target);
  }

  /**
   * Attempt a player move. Returns the animation steps; an empty array means
   * the move was rejected outright. An invalid match swap returns swap+revert
   * and costs no move.
   */
  trySwap(from: Pos, to: Pos): Step[] {
    if (this.status !== 'playing') return [];
    if (Math.abs(from.r - to.r) + Math.abs(from.c - to.c) !== 1) return [];
    const ta = this.grid[from.r]?.[from.c];
    const tb = this.grid[to.r]?.[to.c];
    if (!ta || !tb) return [];

    const steps: Step[] = [];
    const ctx = this.blastCtx();

    const combo = comboClear(this.grid, from, to, ctx);
    if (combo) {
      this.movesLeft--;
      steps.push({ type: 'swap', a: from, b: to });
      swapCells(this.grid, from, to);
      const cleared = expandWithSpecials(this.grid, combo, ctx, [
        key(from.r, from.c),
        key(to.r, to.c),
      ]);
      this.cascade(cleared, [], steps, ctx);
      this.finish(steps);
      return steps;
    }

    swapCells(this.grid, from, to);
    const m = findMatches(this.grid, [to, from]);
    if (!m) {
      swapCells(this.grid, from, to);
      return [
        { type: 'swap', a: from, b: to },
        { type: 'revert', a: from, b: to },
      ];
    }
    this.movesLeft--;
    steps.push({ type: 'swap', a: from, b: to });
    const cleared = expandWithSpecials(this.grid, m.cleared, ctx);
    this.cascade(cleared, m.spawns, steps, ctx);
    this.finish(steps);
    return steps;
  }

  private blastCtx(): BlastCtx {
    const priorityKinds = this.objectives
      .filter((o) => o.type === 'collect' && o.progress < o.target && o.kind)
      .map((o) => o.kind!);
    return { rng: this.rng, priorityKinds };
  }

  private cascade(initialCleared: Set<string>, initialSpawns: Spawn[], steps: Step[], ctx: BlastCtx): void {
    let wave = 1;
    let cleared: Set<string> | null = initialCleared;
    let spawns = initialSpawns;
    while (wave <= CASCADE_HARD_CAP) {
      if (!cleared) {
        const m = findMatches(this.grid);
        if (!m) break;
        cleared = expandWithSpecials(this.grid, m.cleared, ctx);
        spawns = m.spawns;
      }
      this.applyClear(cleared, spawns, steps, wave);
      const falls = applyGravity(this.grid);
      if (falls.length) steps.push({ type: 'fall', moves: falls });
      const refills = refillBoard(this.grid, this.kinds, this.rng, wave >= CASCADE_SOFT_CAP);
      if (refills.length) steps.push({ type: 'refill', tiles: refills });
      wave++;
      cleared = null;
      spawns = [];
    }
  }

  private applyClear(cleared: Set<string>, spawns: Spawn[], steps: Step[], wave: number): void {
    const mult = Math.min(5, 1 + 0.5 * (wave - 1));
    const spawnKeys = new Set(spawns.map((s) => key(s.pos.r, s.pos.c)));
    const cells: { pos: Pos; id: number }[] = [];
    let tally = 0;
    for (const k of cleared) {
      const [r, c] = k.split(',').map(Number);
      const t = this.grid[r][c];
      if (!t) continue;
      tally++;
      cells.push({ pos: { r, c }, id: t.id });
      if (!spawnKeys.has(k)) this.bumpClearObjectives(t.kind);
      this.grid[r][c] = null;
    }
    this.score = Math.round(this.score + tally * TILE_SCORE * mult);
    this.bumpScoreObjectives();
    if (cells.length) steps.push({ type: 'clear', cells, wave });
    for (const s of spawns) {
      const t = makeTile(s.kind, s.special);
      this.grid[s.pos.r][s.pos.c] = t;
      steps.push({ type: 'spawn', pos: s.pos, id: t.id, kind: t.kind, special: s.special });
      for (const o of this.objectives) {
        if (o.type === 'special' && o.specials?.includes(s.special) && o.progress < o.target) {
          o.progress++;
        }
      }
    }
  }

  private bumpClearObjectives(kind: Kind | null): void {
    for (const o of this.objectives) {
      if (o.progress >= o.target) continue;
      if (o.type === 'clearAny') o.progress++;
      else if (o.type === 'collect' && kind && o.kind === kind) o.progress++;
    }
  }

  private bumpScoreObjectives(): void {
    for (const o of this.objectives) {
      if (o.type === 'score') o.progress = Math.min(o.target, this.score);
    }
  }

  private finish(steps: Step[]): void {
    if (this.objectivesDone()) {
      this.status = 'won';
      const bonus = this.movesLeft * FINALE_BONUS_PER_MOVE;
      this.score += bonus;
      steps.push({ type: 'finale', bonus });
      return;
    }
    if (this.movesLeft <= 0) {
      this.status = 'lost';
      return;
    }
    if (findValidMoves(this.grid).length === 0) {
      const moves = shuffleBoard(this.grid, this.rng);
      steps.push({ type: 'shuffle', moves });
    }
  }
}
