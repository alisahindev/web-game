import type { Grid, Kind, Pos, Special } from './types';

export const key = (r: number, c: number) => `${r},${c}`;
export const unkey = (k: string): Pos => {
  const [r, c] = k.split(',').map(Number);
  return { r, c };
};

export interface Run {
  cells: Pos[];
  kind: Kind;
  horizontal: boolean;
}

export interface Spawn {
  pos: Pos;
  special: Special;
  kind: Kind | null;
}

export interface MatchResult {
  cleared: Set<string>;
  spawns: Spawn[];
}

export function findRuns(grid: Grid): Run[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const runs: Run[] = [];
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      const k = grid[r][c]?.kind;
      if (!k) {
        c++;
        continue;
      }
      let end = c + 1;
      while (end < cols && grid[r][end]?.kind === k) end++;
      if (end - c >= 3) {
        const cells: Pos[] = [];
        for (let cc = c; cc < end; cc++) cells.push({ r, c: cc });
        runs.push({ cells, kind: k, horizontal: true });
      }
      c = end;
    }
  }
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      const k = grid[r][c]?.kind;
      if (!k) {
        r++;
        continue;
      }
      let end = r + 1;
      while (end < rows && grid[end][c]?.kind === k) end++;
      if (end - r >= 3) {
        const cells: Pos[] = [];
        for (let rr = r; rr < end; rr++) cells.push({ r: rr, c });
        runs.push({ cells, kind: k, horizontal: false });
      }
      r = end;
    }
  }
  return runs;
}

function findSquares(grid: Grid): { cells: Pos[]; kind: Kind }[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const out: { cells: Pos[]; kind: Kind }[] = [];
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const k = grid[r][c]?.kind;
      if (
        k &&
        grid[r][c + 1]?.kind === k &&
        grid[r + 1][c]?.kind === k &&
        grid[r + 1][c + 1]?.kind === k
      ) {
        out.push({
          kind: k,
          cells: [
            { r, c },
            { r, c: c + 1 },
            { r: r + 1, c },
            { r: r + 1, c: c + 1 },
          ],
        });
      }
    }
  }
  return out;
}

/** True if the tile at (r,c) participates in a run of 3+ or a 2x2 square. */
export function matchAt(grid: Grid, r: number, c: number): boolean {
  const k = grid[r]?.[c]?.kind;
  if (!k) return false;
  const same = (rr: number, cc: number) => grid[rr]?.[cc]?.kind === k;
  let h = 1;
  for (let cc = c - 1; same(r, cc); cc--) h++;
  for (let cc = c + 1; same(r, cc); cc++) h++;
  if (h >= 3) return true;
  let v = 1;
  for (let rr = r - 1; same(rr, c); rr--) v++;
  for (let rr = r + 1; same(rr, c); rr++) v++;
  if (v >= 3) return true;
  for (const dr of [-1, 0]) {
    for (const dc of [-1, 0]) {
      if (
        same(r + dr, c + dc) &&
        same(r + dr, c + dc + 1) &&
        same(r + dr + 1, c + dc) &&
        same(r + dr + 1, c + dc + 1)
      ) {
        return true;
      }
    }
  }
  return false;
}

export function hasImmediateMatch(grid: Grid): boolean {
  return findRuns(grid).length > 0 || findSquares(grid).length > 0;
}

/**
 * Detect all matches on the board. Special spawn priority:
 * 5+ straight (soul) > T/L intersection (bomb) > pure 2x2 (rocket) > 4 straight (line).
 * `swapPos` cells are preferred spawn locations so the player feels ownership.
 */
export function findMatches(grid: Grid, swapPos: Pos[] = []): MatchResult | null {
  const runs = findRuns(grid);
  const squares = findSquares(grid);
  if (!runs.length && !squares.length) return null;

  const cleared = new Set<string>();
  for (const run of runs) for (const p of run.cells) cleared.add(key(p.r, p.c));
  for (const sq of squares) for (const p of sq.cells) cleared.add(key(p.r, p.c));

  const spawns: Spawn[] = [];
  const taken = new Set<string>();
  const used = new Set<Run>();

  const pickPos = (cells: Pos[], preferred?: Pos): Pos => {
    for (const sp of swapPos) {
      if (cells.some((p) => p.r === sp.r && p.c === sp.c) && !taken.has(key(sp.r, sp.c))) return sp;
    }
    if (preferred && !taken.has(key(preferred.r, preferred.c))) return preferred;
    const free = cells.filter((p) => !taken.has(key(p.r, p.c)));
    const arr = free.length ? free : cells;
    return arr[Math.floor(arr.length / 2)];
  };
  const push = (pos: Pos, special: Special, kind: Kind | null) => {
    spawns.push({ pos, special, kind });
    taken.add(key(pos.r, pos.c));
  };

  for (const run of runs) {
    if (run.cells.length >= 5) {
      used.add(run);
      push(pickPos(run.cells), 'soul', null);
    }
  }

  const hRuns = runs.filter((r) => r.horizontal && !used.has(r));
  const vRuns = runs.filter((r) => !r.horizontal && !used.has(r));
  for (const h of hRuns) {
    if (used.has(h)) continue;
    for (const v of vRuns) {
      if (used.has(v) || v.kind !== h.kind) continue;
      const inter = h.cells.find((p) => v.cells.some((q) => q.r === p.r && q.c === p.c));
      if (!inter) continue;
      used.add(h);
      used.add(v);
      push(pickPos([...h.cells, ...v.cells], inter), 'bomb', h.kind);
      break;
    }
  }

  const inAnyRun = (p: Pos) => runs.some((run) => run.cells.some((q) => q.r === p.r && q.c === p.c));
  for (const sq of squares) {
    if (sq.cells.some(inAnyRun)) continue;
    if (sq.cells.every((p) => taken.has(key(p.r, p.c)))) continue;
    push(pickPos(sq.cells), 'rocket', sq.kind);
  }

  for (const run of runs) {
    if (used.has(run) || run.cells.length !== 4) continue;
    push(pickPos(run.cells), run.horizontal ? 'lineH' : 'lineV', run.kind);
  }

  return { cleared, spawns };
}
