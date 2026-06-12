import type { Grid, Kind, Pos, Special, Tile } from './types';
import { key, unkey } from './match';
import { pickRandom } from './rng';
import type { RNG } from './rng';

export interface BlastCtx {
  rng: RNG;
  /** Kinds the player still needs to collect — rockets aim for these first. */
  priorityKinds: Kind[];
}

function lineCells(grid: Grid, p: Pos, horizontal: boolean): Pos[] {
  const out: Pos[] = [];
  if (horizontal) {
    for (let c = 0; c < grid[0].length; c++) if (grid[p.r][c]) out.push({ r: p.r, c });
  } else {
    for (let r = 0; r < grid.length; r++) if (grid[r][p.c]) out.push({ r, c: p.c });
  }
  return out;
}

function areaCells(grid: Grid, p: Pos, radius: number): Pos[] {
  const out: Pos[] = [];
  for (let r = p.r - radius; r <= p.r + radius; r++) {
    for (let c = p.c - radius; c <= p.c + radius; c++) {
      if (grid[r]?.[c]) out.push({ r, c });
    }
  }
  return out;
}

function plusCells(grid: Grid, p: Pos): Pos[] {
  const out: Pos[] = [];
  for (const [dr, dc] of [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]) {
    const r = p.r + dr;
    const c = p.c + dc;
    if (grid[r]?.[c]) out.push({ r, c });
  }
  return out;
}

export function cellsOfKind(grid: Grid, k: Kind): Pos[] {
  const out: Pos[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c]?.kind === k) out.push({ r, c });
    }
  }
  return out;
}

function allTileCells(grid: Grid): Pos[] {
  const out: Pos[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c]) out.push({ r, c });
    }
  }
  return out;
}

export function mostCommonKind(grid: Grid): Kind | null {
  const counts = new Map<Kind, number>();
  for (const row of grid) {
    for (const t of row) {
      if (t?.kind) counts.set(t.kind, (counts.get(t.kind) ?? 0) + 1);
    }
  }
  let best: Kind | null = null;
  let max = 0;
  for (const [k, n] of counts) {
    if (n > max) {
      max = n;
      best = k;
    }
  }
  return best;
}

function rocketTarget(grid: Grid, exclude: Set<string>, ctx: BlastCtx): Pos | null {
  const prio: Pos[] = [];
  const rest: Pos[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const t = grid[r][c];
      if (!t || exclude.has(key(r, c))) continue;
      (t.kind && ctx.priorityKinds.includes(t.kind) ? prio : rest).push({ r, c });
    }
  }
  const list = prio.length ? prio : rest;
  if (!list.length) return null;
  return list[Math.floor(ctx.rng() * list.length)];
}

function blastCells(grid: Grid, p: Pos, t: Tile, ctx: BlastCtx, current: Set<string>): Pos[] {
  switch (t.special) {
    case 'lineH':
      return lineCells(grid, p, true);
    case 'lineV':
      return lineCells(grid, p, false);
    case 'bomb':
      return areaCells(grid, p, 1);
    case 'rocket': {
      const tgt = rocketTarget(grid, current, ctx);
      return tgt ? plusCells(grid, tgt) : [];
    }
    case 'soul': {
      const k = mostCommonKind(grid);
      return k ? cellsOfKind(grid, k) : [];
    }
    default:
      return [];
  }
}

/**
 * Chain-trigger every special caught in the cleared set until stable.
 * `pretriggered` cells (combo sources) are consumed without re-firing.
 */
export function expandWithSpecials(
  grid: Grid,
  initial: Set<string>,
  ctx: BlastCtx,
  pretriggered: string[] = [],
): Set<string> {
  const out = new Set(initial);
  const queue = [...initial];
  const done = new Set(pretriggered);
  while (queue.length) {
    const k = queue.pop()!;
    if (done.has(k)) continue;
    done.add(k);
    const p = unkey(k);
    const t = grid[p.r][p.c];
    if (!t?.special) continue;
    for (const cell of blastCells(grid, p, t, ctx, out)) {
      const ck = key(cell.r, cell.c);
      if (!out.has(ck)) {
        out.add(ck);
        queue.push(ck);
      }
    }
  }
  return out;
}

/**
 * Cells cleared by swapping two specials (or soul + normal tile).
 * Returns null when the swap is a plain swap (no activation).
 * Combo effects are centered on `to` — the cell the player dragged onto.
 */
export function comboClear(grid: Grid, from: Pos, to: Pos, ctx: BlastCtx): Set<string> | null {
  const ta = grid[from.r][from.c];
  const tb = grid[to.r][to.c];
  if (!ta || !tb) return null;
  const sa = ta.special;
  const sb = tb.special;
  const soulOther = sa === 'soul' ? tb : sb === 'soul' ? ta : null;
  if (!soulOther && (!sa || !sb)) return null;

  const out = new Set<string>();
  const add = (cells: Pos[]) => {
    for (const p of cells) out.add(key(p.r, p.c));
  };
  add([from, to]);

  if (soulOther) {
    const os = soulOther.special;
    if (os === 'soul') {
      add(allTileCells(grid));
    } else if (os === 'lineH' || os === 'lineV') {
      cellsOfKind(grid, soulOther.kind!).forEach((p, i) => add(lineCells(grid, p, i % 2 === 0)));
    } else if (os === 'bomb') {
      for (const p of pickRandom(cellsOfKind(grid, soulOther.kind!), 5, ctx.rng)) {
        add(areaCells(grid, p, 1));
      }
    } else if (os === 'rocket') {
      const k = mostCommonKind(grid);
      if (k) add(cellsOfKind(grid, k));
      const tgt = rocketTarget(grid, out, ctx);
      if (tgt) add(plusCells(grid, tgt));
    } else if (soulOther.kind) {
      add(cellsOfKind(grid, soulOther.kind));
    }
    return out;
  }

  const isLine = (s: Special | null) => s === 'lineH' || s === 'lineV';
  const has = (x: Special) => sa === x || sb === x;

  if (isLine(sa) && isLine(sb)) {
    add(lineCells(grid, to, true));
    add(lineCells(grid, to, false));
  } else if ((isLine(sa) || isLine(sb)) && has('bomb')) {
    for (let d = -1; d <= 1; d++) {
      const r = to.r + d;
      const c = to.c + d;
      if (r >= 0 && r < grid.length) add(lineCells(grid, { r, c: to.c }, true));
      if (c >= 0 && c < grid[0].length) add(lineCells(grid, { r: to.r, c }, false));
    }
  } else if (sa === 'bomb' && sb === 'bomb') {
    add(areaCells(grid, to, 2));
  } else if (sa === 'rocket' && sb === 'rocket') {
    for (let i = 0; i < 3; i++) {
      const tgt = rocketTarget(grid, out, ctx);
      if (tgt) add(plusCells(grid, tgt));
    }
  } else if (has('rocket') && (isLine(sa) || isLine(sb))) {
    const tgt = rocketTarget(grid, out, ctx) ?? to;
    add(lineCells(grid, tgt, true));
    add(lineCells(grid, tgt, false));
  } else if (has('rocket') && has('bomb')) {
    const tgt = rocketTarget(grid, out, ctx) ?? to;
    add(areaCells(grid, tgt, 1));
  }
  return out;
}
