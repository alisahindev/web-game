import type { Grid, Kind, Pos, Special } from '../core/types';
import type { Step } from '../core/engine';
import { BOARD_BG, CELL_BG_A, CELL_BG_B, KIND_INFO, drawGem } from './draw';

const CELL = 56;
const PAD = 10;

type NumProp = 'x' | 'y' | 'scale' | 'alpha';

interface Sprite {
  id: number;
  kind: Kind | null;
  special: Special | null;
  r: number;
  c: number;
  x: number;
  y: number;
  scale: number;
  alpha: number;
}

interface Tween {
  sprite: Sprite;
  prop: NumProp;
  from: number;
  to: number;
  start: number;
  dur: number;
  ease: (t: number) => number;
  resolve: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  color: string;
  size: number;
}

export type RenderEvent = { type: 'wave'; wave: number } | { type: 'finale'; bonus: number };

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInQuad = (t: number) => t * t;
const easeOutBack = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;

export class Renderer {
  selected: Pos | null = null;
  readonly rows: number;
  readonly cols: number;
  private ctx: CanvasRenderingContext2D;
  private sprites = new Map<number, Sprite>();
  private tweens: Tween[] = [];
  private particles: Particle[] = [];
  private w: number;
  private h: number;
  private lastT = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    rows: number,
    cols: number,
  ) {
    this.rows = rows;
    this.cols = cols;
    this.w = cols * CELL + PAD * 2;
    this.h = rows * CELL + PAD * 2;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = this.w * dpr;
    canvas.height = this.h * dpr;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(dpr, dpr);
    requestAnimationFrame(this.frame);
  }

  px = (p: Pos) => ({ x: PAD + p.c * CELL + CELL / 2, y: PAD + p.r * CELL + CELL / 2 });

  cellAt = (clientX: number, clientY: number): Pos | null => {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) * this.w) / rect.width - PAD;
    const y = ((clientY - rect.top) * this.h) / rect.height - PAD;
    const c = Math.floor(x / CELL);
    const r = Math.floor(y / CELL);
    return r >= 0 && c >= 0 && r < this.rows && c < this.cols ? { r, c } : null;
  };

  sync(grid: Grid): void {
    this.sprites.clear();
    this.tweens = [];
    this.particles = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const t = grid[r][c];
        if (!t) continue;
        const p = this.px({ r, c });
        this.sprites.set(t.id, {
          id: t.id,
          kind: t.kind,
          special: t.special,
          r,
          c,
          x: p.x,
          y: p.y,
          scale: 1,
          alpha: 1,
        });
      }
    }
  }

  async play(steps: Step[], onEvent?: (e: RenderEvent) => void): Promise<void> {
    for (const s of steps) {
      switch (s.type) {
        case 'swap':
        case 'revert': {
          const sa = this.spriteAt(s.a);
          const sb = this.spriteAt(s.b);
          if (!sa || !sb) break;
          const pa = this.px(s.a);
          const pb = this.px(s.b);
          await Promise.all([
            this.tween(sa, 'x', pb.x, 140),
            this.tween(sa, 'y', pb.y, 140),
            this.tween(sb, 'x', pa.x, 140),
            this.tween(sb, 'y', pa.y, 140),
          ]);
          const tr = sa.r;
          const tc = sa.c;
          sa.r = sb.r;
          sa.c = sb.c;
          sb.r = tr;
          sb.c = tc;
          break;
        }
        case 'clear': {
          onEvent?.({ type: 'wave', wave: s.wave });
          const ps: Promise<void>[] = [];
          for (const cell of s.cells) {
            const sp = this.sprites.get(cell.id);
            if (!sp) continue;
            this.burst(sp.x, sp.y, sp.kind);
            ps.push(this.tween(sp, 'scale', 0, 170), this.tween(sp, 'alpha', 0, 170));
          }
          await Promise.all(ps);
          for (const cell of s.cells) this.sprites.delete(cell.id);
          break;
        }
        case 'spawn': {
          const p = this.px(s.pos);
          const sp: Sprite = {
            id: s.id,
            kind: s.kind,
            special: s.special,
            r: s.pos.r,
            c: s.pos.c,
            x: p.x,
            y: p.y,
            scale: 0,
            alpha: 1,
          };
          this.sprites.set(s.id, sp);
          await this.tween(sp, 'scale', 1, 180, easeOutBack);
          break;
        }
        case 'fall': {
          const ps: Promise<void>[] = [];
          for (const m of s.moves) {
            const sp = this.sprites.get(m.id);
            if (!sp) continue;
            sp.r = m.to.r;
            sp.c = m.to.c;
            const p = this.px(m.to);
            const dur = 90 + 45 * Math.abs(m.to.r - m.from.r);
            ps.push(this.tween(sp, 'x', p.x, dur, easeInQuad), this.tween(sp, 'y', p.y, dur, easeInQuad));
          }
          await Promise.all(ps);
          break;
        }
        case 'refill': {
          const ps: Promise<void>[] = [];
          for (const td of s.tiles) {
            const target = this.px(td.pos);
            const start = this.px({ r: td.dropFrom, c: td.pos.c });
            const sp: Sprite = {
              id: td.id,
              kind: td.kind,
              special: null,
              r: td.pos.r,
              c: td.pos.c,
              x: target.x,
              y: start.y,
              scale: 1,
              alpha: 1,
            };
            this.sprites.set(td.id, sp);
            const dur = 90 + 45 * Math.abs(td.pos.r - td.dropFrom);
            ps.push(this.tween(sp, 'y', target.y, dur, easeInQuad));
          }
          await Promise.all(ps);
          break;
        }
        case 'shuffle': {
          await Promise.all([...this.sprites.values()].map((sp) => this.tween(sp, 'alpha', 0.35, 150)));
          const ps: Promise<void>[] = [];
          for (const m of s.moves) {
            const sp = this.sprites.get(m.id);
            if (!sp) continue;
            sp.r = m.to.r;
            sp.c = m.to.c;
            const p = this.px(m.to);
            ps.push(this.tween(sp, 'x', p.x, 320), this.tween(sp, 'y', p.y, 320));
          }
          await Promise.all(ps);
          await Promise.all([...this.sprites.values()].map((sp) => this.tween(sp, 'alpha', 1, 150)));
          break;
        }
        case 'finale':
          onEvent?.({ type: 'finale', bonus: s.bonus });
          break;
      }
    }
  }

  private spriteAt(p: Pos): Sprite | null {
    for (const sp of this.sprites.values()) {
      if (sp.r === p.r && sp.c === p.c) return sp;
    }
    return null;
  }

  private tween(sprite: Sprite, prop: NumProp, to: number, dur: number, ease = easeOutCubic): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.push({ sprite, prop, from: sprite[prop], to, start: performance.now(), dur, ease, resolve });
    });
  }

  private burst(x: number, y: number, kind: Kind | null): void {
    const color = kind ? KIND_INFO[kind].light : '#e8dcff';
    for (let i = 0; i < 7; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 60 + Math.random() * 130;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 50,
        life: 0,
        ttl: 380 + Math.random() * 200,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  private frame = (t: number): void => {
    const dt = this.lastT ? Math.min(50, t - this.lastT) : 16;
    this.lastT = t;

    this.tweens = this.tweens.filter((tw) => {
      const k = Math.min(1, (t - tw.start) / tw.dur);
      tw.sprite[tw.prop] = tw.from + (tw.to - tw.from) * tw.ease(k);
      if (k >= 1) {
        tw.resolve();
        return false;
      }
      return true;
    });

    this.particles = this.particles.filter((p) => {
      p.life += dt;
      if (p.life >= p.ttl) return false;
      p.x += (p.vx * dt) / 1000;
      p.y += (p.vy * dt) / 1000;
      p.vy += (300 * dt) / 1000;
      return true;
    });

    this.draw(t);
    requestAnimationFrame(this.frame);
  };

  private draw(t: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.fillStyle = BOARD_BG;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.w, this.h, 16);
    ctx.fill();

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? CELL_BG_A : CELL_BG_B;
        ctx.beginPath();
        ctx.roundRect(PAD + c * CELL + 2, PAD + r * CELL + 2, CELL - 4, CELL - 4, 8);
        ctx.fill();
      }
    }

    if (this.selected) {
      ctx.strokeStyle = '#FFB347';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(PAD + this.selected.c * CELL + 2, PAD + this.selected.r * CELL + 2, CELL - 4, CELL - 4, 8);
      ctx.stroke();
    }

    for (const sp of this.sprites.values()) {
      if (sp.scale <= 0 || sp.alpha <= 0) continue;
      ctx.save();
      ctx.globalAlpha = sp.alpha;
      ctx.translate(sp.x, sp.y);
      ctx.scale(sp.scale, sp.scale);
      drawGem(ctx, 0, 0, CELL, sp.kind, sp.special, t);
      ctx.restore();
    }

    for (const p of this.particles) {
      ctx.globalAlpha = 1 - p.life / p.ttl;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
