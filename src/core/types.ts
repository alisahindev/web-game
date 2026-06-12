export const KINDS = ['amber', 'lava', 'crystal', 'moss', 'spark', 'moon'] as const;
export type Kind = (typeof KINDS)[number];

export type Special = 'lineH' | 'lineV' | 'bomb' | 'soul' | 'rocket';

export interface Tile {
  id: number;
  /** null only for the kindless Soul Crystal */
  kind: Kind | null;
  special: Special | null;
}

export interface Pos {
  r: number;
  c: number;
}

export type Cell = Tile | null;
export type Grid = Cell[][];
