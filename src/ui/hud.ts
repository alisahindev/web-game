import type { Engine, Objective } from '../core/engine';
import { KIND_INFO, drawGem } from './draw';

const COMBO_MSGS = ['Güzel!', 'Harika!', 'Taş Gibi!', 'Mağara Çılgınlığı!', 'Dev Combo!'];

export function comboMessage(wave: number): string | null {
  if (wave < 2) return null;
  return wave >= 7 ? 'UNGA BUNGA!' : COMBO_MSGS[wave - 2];
}

export function objectiveLabel(o: Objective): string {
  if (o.type === 'collect' && o.kind) return KIND_INFO[o.kind].name;
  if (o.label) return o.label;
  if (o.type === 'score') return 'Skor';
  if (o.type === 'clearAny') return 'Taş';
  return 'Özel';
}

function el(tag: string, cls: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function objectiveIcon(o: Objective): HTMLElement {
  if (o.type === 'collect' && o.kind) {
    const canvas = document.createElement('canvas');
    canvas.className = 'obj-icon';
    canvas.width = 56;
    canvas.height = 56;
    const ctx = canvas.getContext('2d')!;
    drawGem(ctx, 28, 28, 56, o.kind, null);
    return canvas;
  }
  if (o.type === 'special' && o.specials?.length) {
    const canvas = document.createElement('canvas');
    canvas.className = 'obj-icon';
    canvas.width = 56;
    canvas.height = 56;
    const ctx = canvas.getContext('2d')!;
    const special = o.specials[0];
    drawGem(ctx, 28, 28, 56, special === 'soul' ? null : 'crystal', special);
    return canvas;
  }
  return el('span', 'obj-icon obj-icon-text', o.type === 'score' ? '★' : '✦');
}

export class Hud {
  private engine: Engine | null = null;
  private movesEl: HTMLElement | null = null;
  private scoreEl: HTMLElement | null = null;
  private chips: { objective: Objective; value: HTMLElement; chip: HTMLElement }[] = [];

  constructor(private root: HTMLElement) {}

  bind(engine: Engine): void {
    this.engine = engine;
    this.root.innerHTML = '';
    this.chips = [];

    const moves = el('div', 'hud-block');
    moves.appendChild(el('div', 'hud-label', 'Hamle'));
    this.movesEl = el('div', 'hud-value hud-moves');
    moves.appendChild(this.movesEl);

    const objs = el('div', 'hud-objectives');
    for (const o of engine.objectives) {
      const chip = el('div', 'obj-chip');
      chip.appendChild(objectiveIcon(o));
      const value = el('span', 'obj-value');
      chip.appendChild(value);
      chip.title = objectiveLabel(o);
      objs.appendChild(chip);
      this.chips.push({ objective: o, value, chip });
    }

    const score = el('div', 'hud-block hud-right');
    score.appendChild(el('div', 'hud-label', 'Skor'));
    this.scoreEl = el('div', 'hud-value');
    score.appendChild(this.scoreEl);

    this.root.append(moves, objs, score);
    this.update();
  }

  update(): void {
    if (!this.engine) return;
    if (this.movesEl) {
      this.movesEl.textContent = String(this.engine.movesLeft);
      this.movesEl.classList.toggle('low', this.engine.movesLeft <= 5);
    }
    if (this.scoreEl) this.scoreEl.textContent = String(this.engine.score);
    for (const { objective, value, chip } of this.chips) {
      const remaining = Math.max(0, objective.target - objective.progress);
      const done = remaining === 0;
      value.textContent = done ? '✓' : String(remaining);
      chip.classList.toggle('done', done);
    }
  }
}
