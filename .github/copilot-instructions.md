# Regras do projeto: landing do Bootcamp Full Stack

Stack: Vite + Bootstrap 5.3 (Sass, via npm) + Bootstrap Icons + JS puro. Sem CDN. Textos em português do Brasil, sem emojis.

## Responsividade (regra mais importante)

- Mobile first. Toda a responsividade usa só o sistema do Bootstrap: `container`, `row`/`col-*`, utilitários e breakpoints nativos (`col-md-7`, `d-lg-none`, `vh-lg-100`).
- NUNCA escrever `@media` (em CSS, SCSS ou JS). Também não usar os mixins `media-breakpoint-*` no código próprio.
- Se faltar um utilitário responsivo, criá-lo no mapa `$utilities` de `src/styles/main.scss` (como já foi feito com `vh-lg-100` e `hform-*`), nunca com media query.
- NUNCA usar CSS Grid: nada de `display: grid`, `grid-template-*`, `grid-area`, `d-grid`, `g-col-*`, `$enable-cssgrid`. O "grid" do Bootstrap (`row`/`col`) é flexbox e está liberado.
- Movimento reduzido é tratado no JS (classe `reduce-motion` na tag html), não com media query.

## Estrutura

- Conteúdo do curso em `src/data.js`; número do WhatsApp em `src/config.js`. Não escrever esses dados direto no HTML ou JS.
- Estilos em `src/styles/_custom.scss`. Preferir classes utilitárias do Bootstrap antes de CSS novo.
- Hero: `vh-lg-100`, exatamente 100vh no desktop, com o conteúdo cabendo. A navbar é `fixed-top`.
- Os blocos (Fundamentos, Front-end, Back-end, Especial) só aparecem depois de escolhidos nos cards bento (Bootstrap Collapse). Módulos em accordion do Bootstrap.
- Logos: só no hero (galeria) e nos cards bento. Sempre em tile quadrado com `object-fit: contain`, arquivos em `public/logos/` (256x256, fundo transparente). Nos módulos usar apenas Bootstrap Icons.

## Visual

- Tema escuro com vidro (`.glass`), alto contraste, fontes Unbounded (títulos) e Hanken Grotesk (texto) via fontsource.
- Foco visível em todos os elementos interativos e atributos ARIA nos componentes.

## Antes de concluir qualquer tarefa

1. Rodar `npm run build` sem erros.
2. Buscar `@media`, `display: grid` e `grid-template` em `src/` e `index.html`: o resultado deve ser vazio.
3. Conferir que não há rolagem horizontal em 360 px e que o hero tem 100vh em telas de 992 px ou mais.
