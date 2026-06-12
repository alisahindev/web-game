import './style.css';
import { Engine } from './core/engine';
import { LEVELS } from './core/levels';
import type { Pos } from './core/types';
import { Renderer } from './ui/renderer';
import type { RenderEvent } from './ui/renderer';
import { InputController } from './ui/input';
import { Hud, comboMessage, objectiveLabel } from './ui/hud';

const hudRoot = document.getElementById('hud')!;
const canvas = document.getElementById('board') as HTMLCanvasElement;
const comboEl = document.getElementById('combo')!;
const overlay = document.getElementById('overlay')!;

const hud = new Hud(hudRoot);
const renderer = new Renderer(canvas, 8, 8);
let engine: Engine | null = null;
let busy = false;
let levelIndex = 0;

interface Progress {
  unlocked: number;
  stars: Record<number, number>;
}

const PROG_KEY = 'cavora-progress';

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROG_KEY);
    if (raw) return JSON.parse(raw) as Progress;
  } catch {
    /* corrupt storage → fresh start */
  }
  return { unlocked: 1, stars: {} };
}

function saveProgress(): void {
  localStorage.setItem(PROG_KEY, JSON.stringify(progress));
}

const progress = loadProgress();

const input = new InputController(canvas, renderer.cellAt, onSwap, (p) => {
  renderer.selected = p;
});

async function onSwap(a: Pos, b: Pos): Promise<void> {
  if (busy || !engine || engine.status !== 'playing') return;
  const steps = engine.trySwap(a, b);
  if (!steps.length) return;
  busy = true;
  input.enabled = false;
  renderer.selected = null;
  await renderer.play(steps, handleEvent);
  hud.update();
  busy = false;
  if (engine.status === 'playing') input.enabled = true;
  else showEnd();
}

function handleEvent(e: RenderEvent): void {
  if (e.type === 'wave') {
    hud.update();
    const msg = comboMessage(e.wave);
    if (msg) showCombo(msg);
  }
}

function showCombo(msg: string): void {
  comboEl.textContent = msg;
  comboEl.classList.remove('pop');
  void (comboEl as HTMLElement).offsetWidth;
  comboEl.classList.add('pop');
}

function startLevel(i: number): void {
  levelIndex = i;
  engine = new Engine(LEVELS[i], Date.now());
  hud.bind(engine);
  renderer.sync(engine.grid);
  input.enabled = true;
  hideOverlay();
}

function starsFor(e: Engine): number {
  const base = e.level.baseScore;
  if (e.score >= base * 2.2) return 3;
  if (e.score >= base * 1.5) return 2;
  return 1;
}

function showOverlay(panel: HTMLElement): void {
  overlay.innerHTML = '';
  overlay.appendChild(panel);
  overlay.classList.remove('hidden');
}

function hideOverlay(): void {
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
}

function button(text: string, cls: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = cls;
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}

function panelShell(title: string): { panel: HTMLElement; body: HTMLElement } {
  const panel = document.createElement('div');
  panel.className = 'panel';
  const h = document.createElement('h2');
  h.textContent = title;
  panel.appendChild(h);
  const body = document.createElement('div');
  body.className = 'panel-body';
  panel.appendChild(body);
  return { panel, body };
}

function showEnd(): void {
  if (!engine) return;
  if (engine.status === 'won') {
    const s = starsFor(engine);
    const id = LEVELS[levelIndex].id;
    progress.stars[id] = Math.max(progress.stars[id] ?? 0, s);
    progress.unlocked = Math.max(progress.unlocked, Math.min(LEVELS.length, levelIndex + 2));
    saveProgress();

    const { panel, body } = panelShell('Mağara Açıldı!');
    body.appendChild(starRow(s));
    const score = document.createElement('p');
    score.className = 'panel-score';
    score.textContent = `Skor: ${engine.score}`;
    body.appendChild(score);
    const actions = document.createElement('div');
    actions.className = 'panel-actions';
    if (levelIndex + 1 < LEVELS.length) {
      actions.appendChild(button('Sonraki Level', 'btn btn-primary', () => startLevel(levelIndex + 1)));
    }
    actions.appendChild(button('Tekrar Oyna', 'btn', () => startLevel(levelIndex)));
    actions.appendChild(button('Haritaya Dön', 'btn', showLevelSelect));
    body.appendChild(actions);
    showOverlay(panel);
  } else {
    const { panel, body } = panelShell('Çok Yaklaştın!');
    const list = document.createElement('p');
    list.className = 'panel-score';
    const missing = engine.objectives
      .filter((o) => o.progress < o.target)
      .map((o) => `${objectiveLabel(o)}: ${o.target - o.progress} kaldı`)
      .join(' · ');
    list.textContent = missing || 'Bir deneme daha mağarayı açabilir!';
    body.appendChild(list);
    const actions = document.createElement('div');
    actions.className = 'panel-actions';
    actions.appendChild(button('Tekrar Dene', 'btn btn-primary', () => startLevel(levelIndex)));
    actions.appendChild(button('Haritaya Dön', 'btn', showLevelSelect));
    body.appendChild(actions);
    showOverlay(panel);
  }
}

function starRow(count: number): HTMLElement {
  const row = document.createElement('div');
  row.className = 'stars';
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('span');
    star.textContent = '★';
    star.className = i < count ? 'star on' : 'star';
    row.appendChild(star);
  }
  return row;
}

function showLevelSelect(): void {
  const { panel, body } = panelShell('Cavora');
  const sub = document.createElement('p');
  sub.className = 'panel-sub';
  sub.textContent = 'Mağaraya in, taşları patlat!';
  body.appendChild(sub);
  const grid = document.createElement('div');
  grid.className = 'level-grid';
  LEVELS.forEach((lvl, i) => {
    const locked = lvl.id > progress.unlocked;
    const b = button(String(lvl.id), 'level-btn', () => startLevel(i));
    b.disabled = locked;
    const s = progress.stars[lvl.id] ?? 0;
    if (s > 0) {
      const stars = document.createElement('span');
      stars.className = 'level-stars';
      stars.textContent = '★'.repeat(s);
      b.appendChild(stars);
    }
    b.title = lvl.name;
    grid.appendChild(b);
  });
  body.appendChild(grid);
  showOverlay(panel);
}

showLevelSelect();
