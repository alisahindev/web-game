import type { Kind, Special } from '../core/types';

export const KIND_INFO: Record<Kind, { name: string; fill: string; light: string; dark: string }> = {
  amber: { name: 'Amber', fill: '#FFB347', light: '#FFD89A', dark: '#C97E1F' },
  lava: { name: 'Lav', fill: '#E8543F', light: '#FF8A70', dark: '#A32E1E' },
  crystal: { name: 'Kristal', fill: '#5BC0EB', light: '#A8E3FF', dark: '#2E7FA8' },
  moss: { name: 'Yosun', fill: '#7BC95F', light: '#B5E8A0', dark: '#4A8C35' },
  spark: { name: 'Kıvılcım', fill: '#F7D548', light: '#FFF0A8', dark: '#B89A1C' },
  moon: { name: 'Ay', fill: '#CBA8E8', light: '#EBD8FF', dark: '#8E68B0' },
};

export const BOARD_BG = '#241a2e';
export const CELL_BG_A = '#2f2240';
export const CELL_BG_B = '#352747';

function gemPath(kind: Kind, x: number, y: number, h: number): Path2D {
  const p = new Path2D();
  switch (kind) {
    case 'amber':
      p.moveTo(x, y - h);
      p.bezierCurveTo(x + h * 0.95, y - h * 0.15, x + h * 0.8, y + h * 0.55, x, y + h * 0.95);
      p.bezierCurveTo(x - h * 0.8, y + h * 0.55, x - h * 0.95, y - h * 0.15, x, y - h);
      break;
    case 'lava':
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 6 + (i * Math.PI) / 3;
        const px = x + Math.cos(a) * h * 0.95;
        const py = y + Math.sin(a) * h * 0.95;
        if (i === 0) p.moveTo(px, py);
        else p.lineTo(px, py);
      }
      p.closePath();
      break;
    case 'crystal':
      p.moveTo(x, y - h);
      p.lineTo(x + h * 0.78, y);
      p.lineTo(x, y + h);
      p.lineTo(x - h * 0.78, y);
      p.closePath();
      break;
    case 'moss':
      p.arc(x, y, h * 0.88, 0, Math.PI * 2);
      break;
    case 'spark':
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 4;
        const r = i % 2 === 0 ? h : h * 0.42;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) p.moveTo(px, py);
        else p.lineTo(px, py);
      }
      p.closePath();
      break;
    case 'moon': {
      const R = h * 0.92;
      p.arc(x - R * 0.08, y, R, -Math.PI / 2, Math.PI / 2, false);
      p.arc(x + R * 0.5, y, R * 0.74, Math.PI / 2 + 0.4, -Math.PI / 2 - 0.4, true);
      p.closePath();
      break;
    }
  }
  return p;
}

function drawSoul(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, t: number): void {
  const g = ctx.createRadialGradient(x - h * 0.3, y - h * 0.3, h * 0.1, x, y, h);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.5, '#d9c1f5');
  g.addColorStop(1, '#7e5bc0');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, h * 0.85, 0, Math.PI * 2);
  ctx.fill();
  const colors = ['#FFB347', '#5BC0EB', '#7BC95F'];
  for (let i = 0; i < 3; i++) {
    const a = t / 500 + (i * Math.PI * 2) / 3;
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, h * 0.62, a, a + Math.PI * 0.8);
    ctx.stroke();
  }
}

export function drawGem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  kind: Kind | null,
  special: Special | null,
  t = 0,
): void {
  const h = (cellSize * 0.82) / 2;
  if (special === 'soul' || !kind) {
    drawSoul(ctx, x, y, h, t);
    return;
  }
  const info = KIND_INFO[kind];
  const path = gemPath(kind, x, y, h);
  const g = ctx.createRadialGradient(x - h * 0.35, y - h * 0.4, h * 0.1, x, y, h * 1.15);
  g.addColorStop(0, info.light);
  g.addColorStop(0.55, info.fill);
  g.addColorStop(1, info.dark);
  ctx.fillStyle = g;
  ctx.fill(path);
  ctx.strokeStyle = 'rgba(0,0,0,0.28)';
  ctx.lineWidth = 1.5;
  ctx.stroke(path);
  // top-left highlight
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - h * 0.32, y - h * 0.4, h * 0.26, h * 0.16, -0.6, 0, Math.PI * 2);
  ctx.fill();

  if (special === 'lineH' || special === 'lineV') {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const off of [-h * 0.22, h * 0.18]) {
      ctx.beginPath();
      if (special === 'lineH') ctx.roundRect(x - h * 0.6, y + off - 2, h * 1.2, 4.5, 3);
      else ctx.roundRect(x + off - 2, y - h * 0.6, 4.5, h * 1.2, 3);
      ctx.fill();
    }
  } else if (special === 'bomb') {
    ctx.fillStyle = 'rgba(30,16,28,0.85)';
    ctx.beginPath();
    ctx.arc(x, y, h * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFB347';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, h * 0.45, 0, Math.PI * 2);
    ctx.stroke();
    const pulse = 0.6 + 0.4 * Math.sin(t / 180);
    ctx.fillStyle = `rgba(255,214,120,${pulse})`;
    ctx.beginPath();
    ctx.arc(x + h * 0.28, y - h * 0.5, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (special === 'rocket') {
    ctx.fillStyle = '#f3ead7';
    ctx.beginPath();
    ctx.moveTo(x, y - h * 0.55);
    ctx.lineTo(x + h * 0.32, y + h * 0.35);
    ctx.lineTo(x - h * 0.32, y + h * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#E8543F';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.32, y + h * 0.35);
    ctx.lineTo(x, y + h * 0.55);
    ctx.lineTo(x + h * 0.32, y + h * 0.35);
    ctx.closePath();
    ctx.fill();
  }
}
