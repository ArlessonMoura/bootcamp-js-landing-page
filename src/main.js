import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/unbounded';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Collapse from 'bootstrap/js/dist/collapse';
import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from './config.js';
import { BLOCKS, GALLERY, GOALS, LOGOS, TERMINAL } from './data.js';
import './styles/main.scss';

const $ = (s, r = document) => r.querySelector(s);
const base = import.meta.env.BASE_URL;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) document.documentElement.classList.add('reduce-motion');

const logoSrc = (id) => `${base}logos/${id}.png`;

/* ---------- galeria do hero ---------- */
$('#gallery').innerHTML = GALLERY.map(
  (
    id,
  ) => `<li class="col"><div class="tile tile-fx ratio ratio-1x1 mx-auto" title="${LOGOS[id]}">
    <img src="${logoSrc(id)}" alt="${LOGOS[id]}" width="256" height="256" decoding="async"></div></li>`,
).join('');

// a luz do hover segue o cursor
$('#gallery').addEventListener('pointermove', (e) => {
  const t = e.target.closest('.tile-fx');
  if (!t) return;
  const r = t.getBoundingClientRect();
  t.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  t.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
});

/* ---------- roadmap: bento + blocos ---------- */
let n = 0;
const meta = (m) => {
  if (m.meta) return m.meta;
  if (m.topics.length)
    return `${m.topics.length} tópicos${m.project ? ' e projeto' : ''}`;
  return 'Projeto prático';
};

const moduleHtml = (m, parentId) => {
  n += 1;
  const id = `m${n}`;
  const body = [
    m.topics.length
      ? `<ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">${m.topics.map((t) => `<li class="chip">${t}</li>`).join('')}</ul>`
      : '',
    m.desc ? `<p class="mb-0">${m.desc}</p>` : '',
    m.project
      ? `<p class="proj ${m.topics.length ? 'mt-3' : ''} mb-0"><strong>${m.topics.length ? 'Projeto' : 'Skills exercitadas'}</strong>${m.project}</p>`
      : '',
  ].join('');
  return `<div class="accordion-item">
    <h4 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="${id}">
        <span class="mod-num">${String(n).padStart(2, '0')}</span>
        <span class="mod-ico"><i class="bi bi-${m.icon}"></i></span>
        <span class="flex-grow-1">
          <span class="mod-title">${m.title}</span>
          <span class="mod-meta">${meta(m)}</span>
        </span>
        ${m.tag ? `<span class="badge text-bg-info">${m.tag}</span>` : ''}
      </button>
    </h4>
    <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#${parentId}">
      <div class="accordion-body">${body}</div>
    </div>
  </div>`;
};

$('#bento').innerHTML = BLOCKS.map(
  (b) => `<div class="${b.colClass}">
    <button class="bento glass" type="button" data-bs-toggle="collapse" data-bs-target="#pane-${b.id}" aria-expanded="false" aria-controls="pane-${b.id}">
      <span class="d-flex justify-content-between align-items-start gap-3 mb-3">
        <span>
          <span class="bento-title d-block">${b.title}</span>
          <span class="d-block text-body-secondary mt-1">${b.blurb}</span>
        </span>
        <i class="bi bi-chevron-down bento-chev"></i>
      </span>
      <span class="mosaic mb-3">${b.logos
        .map(
          (id) =>
            `<span class="tile tile-sm" title="${LOGOS[id]}"><img src="${logoSrc(id)}" alt="${LOGOS[id]}" width="256" height="256" loading="lazy"></span>`,
        )
        .join('')}</span>
      <span class="bento-cta">${b.modules.length} módulos · ver detalhes</span>
    </button>
  </div>`,
).join('');

$('#panes').innerHTML = BLOCKS.map(
  (b) => `<div id="pane-${b.id}" class="pane collapse" data-bs-parent="#panes">
    <div class="pt-3 pb-2">
      <h3 class="pane-title mb-2">${b.heading}</h3>
      <p class="text-body-secondary mb-3">${b.blurb}</p>
      ${b.note ? `<p class="pane-note mb-4">${b.note}</p>` : ''}
      <div class="accordion d-flex flex-column gap-2" id="acc-${b.id}">${b.modules.map((m) => moduleHtml(m, `acc-${b.id}`)).join('')}</div>
    </div>
  </div>`,
).join('');

// ao abrir um bloco, leva o leitor até ele
$('#panes').addEventListener('shown.bs.collapse', (e) => {
  if (e.target.classList.contains('pane'))
    e.target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
});

/* ---------- CTA ---------- */
$('#goals').innerHTML = GOALS.map(
  (g) => `<li><i class="bi bi-check2-circle"></i><span>${g}</span></li>`,
).join('');

/* ---------- WhatsApp ---------- */
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
document.querySelectorAll('[data-wa]').forEach((a) => (a.href = waUrl));

/* ---------- menu mobile fecha ao escolher um link ---------- */
const menu = $('#menu');
menu.addEventListener('click', (e) => {
  if (e.target.closest('a') && menu.classList.contains('show'))
    Collapse.getOrCreateInstance(menu).hide();
});

/* ---------- terminal do hero ---------- */
const term = $('#term');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const line = (cls = '') => {
  const el = document.createElement('span');
  el.className = `ln ${cls}`;
  term.appendChild(el);
  return el;
};

async function runTerminal() {
  const caret = document.createElement('span');
  caret.className = 'caret';
  for (const s of TERMINAL) {
    if (s.cmd) {
      const cmd = line();
      cmd.innerHTML = '<span class="p">$</span>';
      const txt = document.createElement('span');
      cmd.append(txt, caret);
      if (reduce) txt.textContent = s.cmd;
      else
        for (const ch of s.cmd) {
          txt.textContent += ch;
          await sleep(24 + Math.random() * 28);
        }
      if (!reduce) await sleep(240);
    }
    const out = line(`out${s.done ? ' done' : ''}`);
    out.textContent = s.out;
    if (!reduce) await sleep(480);
  }
  const last = line();
  last.innerHTML = '<span class="p">$</span>';
  last.appendChild(caret);
}
runTerminal();
