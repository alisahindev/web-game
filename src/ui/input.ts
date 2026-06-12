import type { Pos } from '../core/types';

const DRAG_THRESHOLD = 18;

export class InputController {
  enabled = true;
  private start: { pos: Pos; x: number; y: number } | null = null;
  private selected: Pos | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    private cellAt: (x: number, y: number) => Pos | null,
    private onSwap: (a: Pos, b: Pos) => void,
    private onSelect: (p: Pos | null) => void,
  ) {
    canvas.addEventListener('pointerdown', this.down);
    canvas.addEventListener('pointermove', this.move);
    window.addEventListener('pointerup', this.up);
  }

  private down = (e: PointerEvent): void => {
    if (!this.enabled) return;
    const p = this.cellAt(e.clientX, e.clientY);
    if (!p) return;
    this.start = { pos: p, x: e.clientX, y: e.clientY };
  };

  private move = (e: PointerEvent): void => {
    if (!this.enabled || !this.start) return;
    const dx = e.clientX - this.start.x;
    const dy = e.clientY - this.start.y;
    if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    const from = this.start.pos;
    const to =
      Math.abs(dx) > Math.abs(dy)
        ? { r: from.r, c: from.c + Math.sign(dx) }
        : { r: from.r + Math.sign(dy), c: from.c };
    this.start = null;
    this.clearSelection();
    this.onSwap(from, to);
  };

  private up = (e: PointerEvent): void => {
    if (!this.enabled || !this.start) return;
    const p = this.cellAt(e.clientX, e.clientY) ?? this.start.pos;
    this.start = null;
    if (this.selected) {
      const adj = Math.abs(this.selected.r - p.r) + Math.abs(this.selected.c - p.c) === 1;
      if (adj) {
        const a = this.selected;
        this.clearSelection();
        this.onSwap(a, p);
        return;
      }
      if (this.selected.r === p.r && this.selected.c === p.c) {
        this.clearSelection();
        return;
      }
    }
    this.selected = p;
    this.onSelect(p);
  };

  clearSelection(): void {
    this.selected = null;
    this.onSelect(null);
  }
}
