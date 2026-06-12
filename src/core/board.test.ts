import { describe, expect, it } from 'vitest';
import {
  applyGravity,
  createBoard,
  findValidMoves,
  kindsFor,
  makeTile,
  refillBoard,
  shuffleBoard,
} from './board';
import { hasImmediateMatch } from './match';
import { mulberry32 } from './rng';
import type { Grid } from './types';

describe('createBoard', () => {
  it('generates fair boards: no auto-match, at least one valid move', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const grid = createBoard(8, 8, kindsFor(5), mulberry32(seed));
      expect(hasImmediateMatch(grid)).toBe(false);
      expect(findValidMoves(grid).length).toBeGreaterThan(0);
    }
  });

  it('works with the minimum 4 kinds', () => {
    const grid = createBoard(8, 8, kindsFor(4), mulberry32(99));
    expect(hasImmediateMatch(grid)).toBe(false);
    expect(findValidMoves(grid).length).toBeGreaterThan(0);
  });
});

describe('shuffleBoard', () => {
  it('produces a playable, match-free arrangement and reports every tile position', () => {
    const kinds = kindsFor(3);
    const grid: Grid = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => makeTile(kinds[(r + c) % 3])),
    );
    const moves = shuffleBoard(grid, mulberry32(7));
    expect(hasImmediateMatch(grid)).toBe(false);
    expect(findValidMoves(grid).length).toBeGreaterThan(0);
    expect(moves).toHaveLength(64);
  });
});

describe('gravity + refill', () => {
  it('restores a full board after holes are punched', () => {
    const grid = createBoard(8, 8, kindsFor(5), mulberry32(3));
    grid[0][0] = null;
    grid[4][4] = null;
    grid[5][4] = null;
    grid[7][2] = null;
    const falls = applyGravity(grid);
    expect(falls.length).toBeGreaterThan(0);
    const refills = refillBoard(grid, kindsFor(5), mulberry32(9), true);
    expect(refills).toHaveLength(4);
    for (const row of grid) for (const cell of row) expect(cell).not.toBeNull();
  });
});
