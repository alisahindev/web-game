import { KINDS } from './types';
import type { Cell, Grid, Kind, Pos, Special, Tile } from './types';
import type { RNG } from './rng';
import { hasImmediateMatch, matchAt } from './match';

let nextId = 1;

export function makeTile(kind: Kind | null, special: Special | null = null): Tile {
  return { id: nextId++, kind, special };
}

export function kindsFor(count: number): Kind[] {
  return KINDS.slice(0, count);
}

export function swapCells(grid: Grid, a: Pos, b: Pos): void {
  const t = grid[a.r][a.c];
  grid[a.r][a.c] = grid[b.r][b.c];
  grid[b.r][b.c] = t;
}

/** Would placing kind k at (r,c) complete a run of 3 or a 2x2 square against already-filled cells (left/up)? */
function wouldMatch(grid: Grid, r: number, c: number, k: Kind): boolean {
  const at = (rr: number, cc: number) => grid[rr]?.[cc]?.kind;
  if (at(r, c - 1) === k && at(r, c - 2) === k) return true;
  if (at(r - 1, c) === k && at(r - 2, c) === k) return true;
  if (at(r - 1, c) === k && at(r - 1, c - 1) === k && at(r, c - 1) === k) return true;
  return false;
}

export function createBoard(rows: number, cols: number, kinds: Kind[], rng: RNG): Grid {
  for (let attempt = 0; attempt < 100; attempt++) {
    const grid: Grid = Array.from({ length: rows }, () => Array<Cell>(cols).fill(null));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const options = kinds.filter((k) => !wouldMatch(grid, r, c, k));
        const pool = options.length ? options : kinds;
        grid[r][c] = makeTile(pool[Math.floor(rng() * pool.length)]);
      }
    }
    if (!hasImmediateMatch(grid) && findValidMoves(grid).length > 0) return grid;
  }
  throw new Error('board generation failed');
}

/** All adjacent swaps that produce a match, or activate specials (soul + any, special + special). */
export function findValidMoves(grid: Grid): [Pos, Pos][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const out: [Pos, Pos][] = [];
  const check = (a: Pos, b: Pos) => {
    const ta = grid[a.r][a.c];
    const tb = grid[b.r][b.c];
    if (!ta || !tb) return;
    if (ta.special === 'soul' || tb.special === 'soul' || (ta.special && tb.special)) {
      out.push([a, b]);
      return;
    }
    swapCells(grid, a, b);
    if (matchAt(grid, a.r, a.c) || matchAt(grid, b.r, b.c)) out.push([a, b]);
    swapCells(grid, a, b);
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) check({ r, c }, { r, c: c + 1 });
      if (r + 1 < rows) check({ r, c }, { r: r + 1, c });
    }
  }
  return out;
}

export function applyGravity(grid: Grid): { id: number; from: Pos; to: Pos }[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const moves: { id: number; from: Pos; to: Pos }[] = [];
  for (let c = 0; c < cols; c++) {
    let write = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      const t = grid[r][c];
      if (!t) continue;
      if (write !== r) {
        grid[write][c] = t;
        grid[r][c] = null;
        moves.push({ id: t.id, from: { r, c }, to: { r: write, c } });
      }
      write--;
    }
  }
  return moves;
}

function formsMatch(grid: Grid, r: number, c: number, k: Kind): boolean {
  const probe: Tile = { id: -1, kind: k, special: null };
  const prev = grid[r][c];
  grid[r][c] = probe;
  const hit = matchAt(grid, r, c);
  grid[r][c] = prev;
  return hit;
}

/** Fill empty cells from the top. With `safe`, avoid kinds that would form an immediate match (cascade soft cap). */
export function refillBoard(
  grid: Grid,
  kinds: Kind[],
  rng: RNG,
  safe: boolean,
): { id: number; pos: Pos; kind: Kind; dropFrom: number }[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const out: { id: number; pos: Pos; kind: Kind; dropFrom: number }[] = [];
  for (let c = 0; c < cols; c++) {
    const empty: number[] = [];
    for (let r = 0; r < rows; r++) if (!grid[r][c]) empty.push(r);
    for (const r of empty) {
      let kind = kinds[Math.floor(rng() * kinds.length)];
      if (safe) {
        const options = kinds.filter((k) => !formsMatch(grid, r, c, k));
        if (options.length) kind = options[Math.floor(rng() * options.length)];
      }
      const t = makeTile(kind);
      grid[r][c] = t;
      out.push({ id: t.id, pos: { r, c }, kind, dropFrom: r - empty.length });
    }
  }
  return out;
}

function randomOrder(n: number, rng: RNG): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/**
 * Reshuffle the existing tiles in place: no immediate match, at least one valid move.
 * Returns the new position of every tile id.
 */
export function shuffleBoard(grid: Grid, rng: RNG): { id: number; to: Pos }[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const tiles: Tile[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = grid[r][c];
      if (t) tiles.push(t);
    }
  }
  for (let attempt = 0; attempt < 150; attempt++) {
    const pool = [...tiles];
    const placed: Grid = Array.from({ length: rows }, () => Array<Cell>(cols).fill(null));
    let ok = true;
    outer: for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const order = randomOrder(pool.length, rng);
        let chosen = -1;
        for (const i of order) {
          const k = pool[i].kind;
          if (!k || !wouldMatch(placed, r, c, k)) {
            chosen = i;
            break;
          }
        }
        if (chosen < 0) {
          ok = false;
          break outer;
        }
        placed[r][c] = pool[chosen];
        pool.splice(chosen, 1);
      }
    }
    if (!ok) continue;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid[r][c] = placed[r][c];
    if (findValidMoves(grid).length > 0) break;
  }
  const moves: { id: number; to: Pos }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = grid[r][c];
      if (t) moves.push({ id: t.id, to: { r, c } });
    }
  }
  return moves;
}
