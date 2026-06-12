import { describe, expect, it } from 'vitest';
import { Engine } from './engine';
import type { LevelDef } from './engine';
import { findValidMoves, swapCells } from './board';
import { findMatches } from './match';
import type { Pos } from './types';

const level: LevelDef = {
  id: 1,
  name: 'test',
  moves: 20,
  kinds: 4,
  baseScore: 1000,
  objectives: [{ type: 'score', target: 999999 }],
};

/** Find an adjacent pair whose swap creates a real match (not a special activation). */
function matchSwap(e: Engine): readonly [Pos, Pos] {
  for (const [a, b] of findValidMoves(e.grid)) {
    swapCells(e.grid, a, b);
    const m = findMatches(e.grid);
    swapCells(e.grid, a, b);
    if (m) return [a, b] as const;
  }
  throw new Error('no match swap found');
}

describe('Engine', () => {
  it('a valid swap consumes a move, scores, and leaves a full board', () => {
    const e = new Engine(level, 42);
    const [a, b] = matchSwap(e);
    const steps = e.trySwap(a, b);
    expect(steps.length).toBeGreaterThan(0);
    expect(e.movesLeft).toBe(19);
    expect(e.score).toBeGreaterThan(0);
    for (const row of e.grid) for (const cell of row) expect(cell).not.toBeNull();
  });

  it('an invalid swap costs nothing and reverts', () => {
    const e = new Engine(level, 42);
    const valid = new Set(findValidMoves(e.grid).map(([a, b]) => `${a.r},${a.c}-${b.r},${b.c}`));
    let pair: [Pos, Pos] | null = null;
    outer: for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        for (const [dr, dc] of [
          [0, 1],
          [1, 0],
        ] as const) {
          const b = { r: r + dr, c: c + dc };
          if (b.r > 7 || b.c > 7) continue;
          if (!valid.has(`${r},${c}-${b.r},${b.c}`)) {
            pair = [{ r, c }, b];
            break outer;
          }
        }
      }
    }
    const steps = e.trySwap(pair![0], pair![1]);
    expect(steps.map((s) => s.type)).toEqual(['swap', 'revert']);
    expect(e.movesLeft).toBe(20);
    expect(e.score).toBe(0);
  });

  it('completing the objective wins with a finale bonus', () => {
    const lvl: LevelDef = { ...level, objectives: [{ type: 'clearAny', target: 3 }] };
    const e = new Engine(lvl, 7);
    const [a, b] = matchSwap(e);
    const steps = e.trySwap(a, b);
    expect(e.status).toBe('won');
    expect(steps.at(-1)?.type).toBe('finale');
  });

  it('rejects non-adjacent and out-of-game swaps', () => {
    const e = new Engine(level, 5);
    expect(e.trySwap({ r: 0, c: 0 }, { r: 2, c: 0 })).toHaveLength(0);
    expect(e.trySwap({ r: 0, c: 0 }, { r: 1, c: 1 })).toHaveLength(0);
  });
});
