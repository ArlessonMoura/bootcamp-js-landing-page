import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/unbounded';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Collapse from 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/tab';
import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from './config.js';
import { BLOCKS, GALLERY, LOGOS, TERMINAL } from './data.js';
import './styles/main.scss';

const $ = (s, r = document) => r.querySelector(s);
const base = import.meta.env.BASE_URL;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) document.documentElement.classList.add('reduce-motion');

const logoSrc = (id) => `${base}logos/${id}.png`;
const avatarSrc = (filename) => `${base}img/${filename}`;

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

/* ---------- WhatsApp ---------- */
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
document.querySelectorAll('[data-wa]').forEach((a) => (a.href = waUrl));

/* ---------- máscara do WhatsApp ---------- */
const whatsappInput = $('#lead-whatsapp');
const formatBrazilianPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length < 3) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  const mobile = digits.length > 10 || subscriber.startsWith('9');
  const firstGroupLength = mobile ? 5 : 4;
  const firstGroup = subscriber.slice(0, firstGroupLength);
  const secondGroup = subscriber.slice(firstGroupLength);
  return `(${areaCode}) ${firstGroup}${secondGroup ? `-${secondGroup}` : ''}`;
};

whatsappInput.addEventListener('input', () => {
  const value = whatsappInput.value;
  const cursor = whatsappInput.selectionStart ?? value.length;
  const digitsBeforeCursor = value.slice(0, cursor).replace(/\D/g, '').length;
  whatsappInput.value = formatBrazilianPhone(value);

  let nextCursor = 0;
  let countedDigits = 0;
  while (nextCursor < whatsappInput.value.length && countedDigits < digitsBeforeCursor) {
    if (/\d/.test(whatsappInput.value[nextCursor])) countedDigits += 1;
    nextCursor += 1;
  }
  whatsappInput.setSelectionRange(nextCursor, nextCursor);
});

/* ---------- envio do formulário ---------- */
const leadForm = $('form[name="interesse-bootcamp"]');
const leadError = $('#lead-error');
const leadStatus = $('#lead-status');
const leadWhatsapp = $('[data-wa]');
const leadIntro = $('#lead-intro');
const leadSuccess = $('#lead-success');
const leadPreviewNote = $('#lead-preview-note');
const submitButton = leadForm.querySelector('[type="submit"]');

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  leadError.classList.add('d-none');
  leadStatus.classList.add('d-none');
  leadWhatsapp.href = waUrl;
  submitButton.disabled = true;
  leadForm.setAttribute('aria-busy', 'true');
  const formData = new FormData(leadForm);

  try {
    if (import.meta.env.DEV) {
      leadPreviewNote.classList.remove('d-none');
    } else {
      let accepted = false;
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        leadStatus.textContent = `Enviando inscrição (tentativa ${attempt} de 2)...`;
        leadStatus.classList.remove('d-none');
        const controller = new AbortController();
        const requestTimeout = window.setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch(leadForm.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString(),
            signal: controller.signal,
          });
          accepted = response.ok;
        } catch (error) {
          if (attempt === 2) throw error;
        } finally {
          window.clearTimeout(requestTimeout);
        }

        if (accepted) break;
      }
      if (!accepted) throw new Error('Form submission failed after two attempts');
    }
    leadWhatsapp.href = waUrl;
    leadStatus.classList.add('d-none');
    leadIntro.classList.add('d-none');
    leadForm.classList.add('d-none');
    leadSuccess.classList.remove('d-none');
    $('#lead-success-title').focus();
  } catch {
    const name = String(formData.get('nome') ?? '').trim();
    const phone = String(formData.get('whatsapp') ?? '').trim();
    const referrer = String(formData.get('nome-indicacao') ?? '').trim();
    const message = [
      'Olá! Tentei enviar minha inscrição no Bootcamp Full Stack, mas não consegui confirmar o recebimento.',
      `Nome: ${name}`,
      `WhatsApp: ${phone}`,
      referrer ? `Indicação: ${referrer}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    leadWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    leadStatus.classList.add('d-none');
    leadError.classList.remove('d-none');
  } finally {
    submitButton.disabled = false;
    leadForm.removeAttribute('aria-busy');
  }
});

$('#lead-new-proposal').addEventListener('click', () => {
  leadForm.reset();
  leadError.classList.add('d-none');
  leadStatus.classList.add('d-none');
  leadWhatsapp.href = waUrl;
  leadPreviewNote.classList.add('d-none');
  leadIntro.classList.remove('d-none');
  leadForm.classList.remove('d-none');
  leadSuccess.classList.add('d-none');
  $('#lead-heading').focus();
});

/* ---------- menu mobile fecha ao escolher um link ---------- */
const menu = $('#menu');
menu.addEventListener('click', (e) => {
  if (e.target.closest('a') && menu.classList.contains('show'))
    Collapse.getOrCreateInstance(menu).hide();
});

/* ---------- terminal do hero ---------- */
const term = $('#term');
const termAvatar = $('#term-avatar');
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
  let messageIndex = 0;

  while (true) {
    const message = TERMINAL[messageIndex];
    term.replaceChildren();
    termAvatar.src = avatarSrc(message.avatar);

    const status = line('term-status');
    status.innerHTML =
      '<span class="term-segment term-segment--location">~/bootcamp</span><span class="term-segment term-segment--branch">full-stack</span><span class="term-segment term-segment--runtime">node.js</span>';

    const command = line('term-command');
    const prompt = document.createElement('span');
    prompt.className = 'p';
    prompt.textContent = '❯';
    const commandText = document.createElement('span');
    command.append(prompt, document.createTextNode(' '), commandText, caret);

    const output = line(`out tone-${message.tone}`);
    const outputText = document.createElement('span');
    output.appendChild(outputText);

    if (reduce) {
      commandText.textContent = message.cmd;
      outputText.textContent = message.out;
      command.appendChild(caret);
      return;
    }

    for (const character of message.cmd) {
      commandText.textContent += character;
      await sleep(24 + Math.random() * 28);
    }
    await sleep(240);
    output.appendChild(caret);
    for (const character of message.out) {
      outputText.textContent += character;
      await sleep(14 + Math.random() * 12);
    }
    await sleep(1800);
    messageIndex = (messageIndex + 1) % TERMINAL.length;
  }
}
runTerminal();
