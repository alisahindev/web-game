import { describe, expect, it } from 'vitest';
import { makeTile } from './board';
import { findMatches } from './match';
import type { Grid, Kind } from './types';

const M: Record<string, Kind> = {
  A: 'amber',
  L: 'lava',
  C: 'crystal',
  Y: 'moss',
  S: 'spark',
  N: 'moon',
};

function g(rows: string[]): Grid {
  return rows.map((row) => row.split('').map((ch) => (ch === '.' ? null : makeTile(M[ch]))));
}

describe('findMatches', () => {
  it('detects a plain 3-run with no special spawn', () => {
    const m = findMatches(g(['AAA.', '....', '....', '....']))!;
    expect(m.cleared.size).toBe(3);
    expect(m.spawns).toHaveLength(0);
  });

  it('returns null when there is no match', () => {
    expect(findMatches(g(['ALAC', 'LACA', 'ACAL', 'CALA']))).toBeNull();
  });

  it('4-run spawns a line blaster matching the run orientation', () => {
    const m = findMatches(g(['AAAA', '....', '....', '....']))!;
    expect(m.spawns).toHaveLength(1);
    expect(m.spawns[0].special).toBe('lineH');
    expect(m.spawns[0].kind).toBe('amber');

    const v = findMatches(g(['L...', 'L...', 'L...', 'L...']))!;
    expect(v.spawns[0].special).toBe('lineV');
  });

  it('5-run spawns a kindless soul crystal', () => {
    const m = findMatches(g(['AAAAA', '.....', '.....', '.....', '.....']))!;
    expect(m.spawns).toHaveLength(1);
    expect(m.spawns[0].special).toBe('soul');
    expect(m.spawns[0].kind).toBeNull();
  });

  it('T intersection spawns a bomb at the crossing', () => {
    const m = findMatches(g(['.A..', 'AAA.', '.A..', '....']))!;
    expect(m.cleared.size).toBe(5);
    expect(m.spawns).toHaveLength(1);
    expect(m.spawns[0].special).toBe('bomb');
    expect(m.spawns[0].pos).toEqual({ r: 1, c: 1 });
  });

  it('pure 2x2 square spawns a rocket', () => {
    const m = findMatches(g(['AA..', 'AA..', '....', '....']))!;
    expect(m.cleared.size).toBe(4);
    expect(m.spawns).toHaveLength(1);
    expect(m.spawns[0].special).toBe('rocket');
    expect(m.spawns[0].kind).toBe('amber');
  });

  it('prefers the swap position for the spawned special', () => {
    const m = findMatches(g(['AAAA', '....', '....', '....']), [{ r: 0, c: 0 }])!;
    expect(m.spawns[0].pos).toEqual({ r: 0, c: 0 });
  });
});
