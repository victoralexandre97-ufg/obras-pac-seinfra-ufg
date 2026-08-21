# DESIGN.md — Design System do Painel SEINFRA/UFG

## Visão Geral

Dashboard de signage em tema escuro (dark mode) com estética futurista/neon. Visual inspirado em painéis de controle e monitoramento 24/7.

---

## Paleta de Cores

### Core Tokens

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `--bg` | `#09090D` | `9, 9, 13` | Fundo principal, body |
| `--surface` | `#111118` | `17, 17, 24` | Cards, header, footer |
| `--surface2` | `#1A1A24` | `26, 26, 36` | Superfícies secundárias, tracks de barra, badge fundo |
| `--surface3` | `#22222F` | `34, 34, 47` | Hover states |
| `--border` | `#252535` | `37, 37, 53` | Bordas de cards, header, footer |
| `--border2` | `#333348` | `51, 51, 72` | Bordas secundárias, botões |

### Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `--text` | `#F0F0FA` | Texto principal, valores, títulos |
| `--text2` | `#9090B0` | Texto secundário, subtítulos, labels de chart |
| `--text3` | `#5A5A7A` | Texto terciário, labels de KPI, data/hora |

### Cores de Destaque

| Token | Hex | Opacidade 12% | Uso |
|-------|-----|---------------|-----|
| `--cyan` | `#00D4FF` | `rgba(0,212,255,0.12)` | Destaque principal, logo, KPI req., ano corrente, dot ativo |
| `--cyan2` | `#00A8CC` | — | Variação cyan (não utilizado ativamente) |
| `--ok` | `#00E676` | `rgba(0,230,118,0.12)` | Status positivo, finalizadas, dot pulsante, dataset Equipamentos |
| `--ok2` | `#00B35A` | — | Variação ok (não utilizado ativamente) |
| `--warn` | `#FFB300` | `rgba(255,179,0,0.12)` | Atenção, botão pause, dataset Predial |
| `--warn2` | `#CC8C00` | — | Variação warn (não utilizado ativamente) |
| `--danger` | `#FF4444` | `rgba(255,68,68,0.12)` | Crítico, em aberto, erros |
| `--danger2` | `#CC2222` | — | Variação danger (não utilizado ativamente) |
| `--blue` | `#4B8BFF` | `rgba(75,139,255,0.12)` | Secundário, KPI horas, barras padrão |
| `--blue2` | `#2966DD` | — | Variação blue (não utilizado ativamente) |
| `--purple` | `#9B59FF` | `rgba(155,89,255,0.12)` | Terciário, gradiente header |

### Uso de Cores por Componente

| Componente | Cor | Detalhe |
|------------|-----|---------|
| Logo text | `--cyan` | Com `text-shadow: 0 0 24px rgba(0,212,255,0.35)` |
| Header bottom border | Gradiente | `linear-gradient(90deg, --cyan 0%, --blue 50%, --purple 100%)` |
| Status badge "DADOS ATIVOS" | `--ok` | Fundo `rgba(0,230,118,0.1)`, borda `rgba(0,230,118,0.25)` |
| Dot pulsante | `--ok` | Animação `pulse-dot` 2s infinite |
| Dot de navegação (inativo) | `--border2` | — |
| Dot de navegação (ativo) | `--cyan` | Com `box-shadow: 0 0 10px rgba(0,212,255,0.5)`, scale 1.3 |
| Barra de progresso | `--cyan` | Com `box-shadow: 0 0 8px rgba(0,212,255,0.6)` |
| Botão Pause | `--warn` | Borda `rgba(255,179,0,0.3)`, hover `rgba(255,179,0,0.1)` |
| KPI Req. | `--cyan` | — |
| KPI Horas | `--blue` | — |
| KPI Finalizadas | `--ok` | — |
| KPI Em Aberto | `--danger` | — |
| Rank #1 | `--cyan` | Fundo `rgba(0,212,255,0.15)` |
| Rank #2 | `--text` | Fundo `rgba(255,255,255,0.07)` |
| Rank #3 | `--text2` | Fundo `rgba(255,255,255,0.05)` |
| Pill Bom | `--ok` | Fundo `rgba(0,230,118,0.15)` |
| Pill Regular | `--warn` | Fundo `rgba(255,179,0,0.15)` |
| Pill Crítico | `--danger` | Fundo `rgba(255,68,68,0.15)` |
| Pill genérico | `--blue` | Fundo `rgba(75,139,255,0.15)` |
| Alert danger | `--danger` | Fundo `rgba(255,68,68,0.08)`, borda `rgba(255,68,68,0.2)` |
| Alert warn | `--warn` | Fundo `rgba(255,179,0,0.08)`, borda `rgba(255,179,0,0.2)` |
| Alert ok | `--ok` | Fundo `rgba(0,230,118,0.08)`, borda `rgba(0,230,118,0.2)` |

### Paleta dos Gráficos (Chart.js)

| Gráfico | Cores |
|---------|-------|
| Barras evolução anual | `#4B8BFF` (padrão), `#00D4FF` (ano corrente — último item) |
| Barras divisão | `#FFB300` (Predial), `#00E676` (Equipamentos) |
| Doughnut status | `#00E676`, `#00D4FF`, `#FFB300`, `#4B8BFF`, `#FF6B6B`, `#9B59FF`, `#FF4444`, `#555577` |
| Doughnut oficinas | `#00D4FF`, `#4B8BFF`, `#9B59FF`, `#00E676`, `#FFB300` |
| Barras horizontais | `#00D4FF`, `#4B8BFF`, `#9B59FF`, `#00E676`, `#FFB300`, `#FF6B6B` |

---

## Tipografia

### Fontes

| Fonte | Família CSS | Uso | CDN |
|-------|-------------|-----|-----|
| **Inter** | `'Inter', sans-serif` | Fonte principal (texto, títulos, labels) | Google Fonts, pesos 300–900 |
| **JetBrains Mono** | `'JetBrains Mono', monospace` | Valores numéricos, relógio, SLA | Google Fonts, pesos 400–600 |

### Escala de Tipografia

| Elemento | Tamanho | Peso | Family | Cor | Transform | Spacing |
|----------|---------|------|--------|-----|-----------|---------|
| Logo nome | 22px | 800 | Inter | `--cyan` | — | -0.5px |
| Logo subtítulo | 12px | 800 | Inter | `--text` | uppercase | 0.12em |
| Título slide (header) | 16px | 800 | Inter | `--text` | — | 0.04em |
| Título slide (inline, slides 4–5) | 22px | bold | Inter | `#ffffff` | — | — |
| Subtítulo slide (inline, slides 4–5) | 16px | — | Inter | `--text2` | — | — |
| KPI label | 13px | 800 | Inter | `--text2` | uppercase | 0.05em |
| KPI value | 32px | 800 | JetBrains Mono | (varia por cor) | — | — |
| KPI sub | 12px | 500 | Inter | `rgba(255,255,255,0.7)` | — | — |
| Card title | 18px | 800 | Inter | `#ffffff` | — | 0.01em |
| Card subtitle | 14px | 500 | Inter | `--text2` | — | — |
| Table header (th) | 13px | 800 | Inter | `--text2` | uppercase | 0.1em |
| Table cell (td) | 15px | 400 | Inter | `--text` | — | — |
| Table cell mono | 14px | — | JetBrains Mono | `--text` | — | — |
| Pill / badge | 13px | 600 | Inter | (varia) | — | — |
| Relógio hora | 26px | 600 | JetBrains Mono | `--text` | — | — |
| Relógio data | 12px | 800 | Inter | `--text` | uppercase | 0.08em |
| Status badge | 11px | 500 | Inter | `--ok` | — | — |
| Footer fonte | 11px | 400 | Inter | `--text3` | italic | — |
| Bar label | 11px | 400 | Inter | `--text2` | — | — |
| Bar value | 11px | 400 | JetBrains Mono | `--text3` | — | — |
| Alert title | 12px | 700 | Inter | (varia) | — | — |
| Alert description | 11px | 400 | Inter | `--text2` | — | — |
| Chart axis (slides 4–5) | 14–15px | 600–bold | Inter | `#FFFFFF` / `#C0C0D8` | — | — |
| Chart datalabel | 14px | bold | Inter | `#FFFFFF` | — | — |

---

## Espaçamento e Dimensões

### Layout Geral

| Elemento | Valor |
|----------|-------|
| Viewport | `100vw × 100vh` |
| Header height | `72px` |
| Footer height | `52px` |
| Slides padding | `16px 24px` |
| Slides gap (layout) | `12px` |

### Cards KPI

| Propriedade | Valor |
|-------------|-------|
| Border radius | `14px` |
| Padding | `12px 18px` |
| Border | `1px solid var(--border)` |
| Bottom bar height | `3px` |
| Icon size | `36px × 36px` |
| Icon border radius | `8px` |
| Icon margin bottom | `8px` |
| KPI row gap | `16px` |
| Decorative circle | `80px × 80px`, opacity 0.06, translate(20px, -20px) |

### Cards de Conteúdo

| Propriedade | Valor |
|-------------|-------|
| Border radius | `14px` |
| Padding | `20px 22px` |
| Border | `1px solid var(--border)` |
| Title bar width | `4px` |
| Title bar height | `18px` |
| Title bar radius | `3px` |
| Grid gap | `16px` |

### Tabelas

| Propriedade | Valor |
|-------------|-------|
| Header padding | `8px 10px` |
| Cell padding | `8px 10px` |
| Row border | `1px solid rgba(255,255,255,0.03)` |
| Rank badge size | `26px × 26px` |
| Rank badge radius | `6px` |
| Rank badge font | `13px, 700, JetBrains Mono` |

### Botões

| Propriedade | Valor |
|-------------|-------|
| Padding | `7px 14px` |
| Border radius | `6px` |
| Border | `1px solid var(--border2)` |
| Background | `var(--surface2)` |
| Font | `12px, 500, Inter` |

### Alertas

| Propriedade | Valor |
|-------------|-------|
| Padding | `12px 14px` |
| Border radius | `10px` |
| Dot size | `10px × 10px` |
| Gap (dot → texto) | `12px` |

### Barras Horizontais

| Propriedade | Valor |
|-------------|-------|
| Track height | `8px` |
| Track radius | `4px` |
| Track background | `var(--surface2)` |
| Bar label width | `130px` |
| Bar value width | `70px` |
| Gap | `10px` |

---

## Animações

### Transições de Slide

```css
.sg-slide {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}
.sg-slide.active {
  opacity: 1;
  pointer-events: auto;
}
```

### Entrada de Elementos (fadeUp)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Duração: 0.5s ease */
```

**Delays escalonados:**

| Elemento | Delay |
|----------|-------|
| KPI card 1 | 0.05s |
| KPI card 2 | 0.10s |
| KPI card 3 | 0.15s |
| KPI card 4 | 0.20s |
| C-card 1 | 0.25s |
| C-card 2 | 0.30s |
| C-card 3 | 0.35s |

### Pulso do Dot de Status

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(0.8); }
}
/* Duração: 2s, infinite */
```

### Transições de Elementos

| Elemento | Propriedade | Duração | Easing |
|----------|-------------|---------|--------|
| Dot navegação | `all` | 0.3s | ease |
| Botão | `all` | 0.2s | ease |
| KPI card | `transform` | 0.2s | ease |
| Slide title | `opacity` | 0.4s | ease |
| Bar fill | `width` | 0.8s | cubic-bezier(0.4, 0, 0.2, 1) |
| Progress bar | `width` | 0.1s | linear |

---

## Efeitos Visuais

| Efeito | Aplicação | CSS |
|--------|-----------|-----|
| Text shadow neon | Logo nome | `text-shadow: 0 0 24px rgba(0,212,255,0.35)` |
| Box shadow glow | Dot ativo | `box-shadow: 0 0 10px rgba(0,212,255,0.5)` |
| Box shadow glow | Progress bar | `box-shadow: 0 0 8px rgba(0,212,255,0.6)` |
| Gradient line | Header bottom | `linear-gradient(90deg, cyan → blue → purple)` |
| Decorative circle | KPI cards | `::after` pseudo-element, 80px circle, opacity 0.06 |
| Scale | Dot ativo | `transform: scale(1.3)` |

---

## Ícones (Emoji)

| Slide | KPI | Emoji |
|-------|-----|-------|
| 1–3 | Total Requisições | 📋 |
| 1–3 | Total de Horas | ⏱ |
| 1–3 | Finalizadas | ✅ |
| 1–3 | Em Aberto | 🔴 |
| 4 | Evolução Anual | 📈 |
| 5 | Divisão | 🏗️ |

---

## Configurações do Chart.js

```javascript
// Defaults globais
Chart.defaults.color = '#9090B0';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = '#252535';

// Defaults do projeto
chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
};
```

### Estilo dos Gráficos (Slides 4–5)

| Propriedade | Valor |
|-------------|-------|
| Border radius das barras | `8px` |
| Border skipped | `false` |
| Padding do layout | `{ top: 30 }` |
| Y grid color | `#2A2A35` |
| X grid | `display: false` |
| Y ticks color | `#C0C0D8`, 14px |
| X ticks color | `#FFFFFF`, 15px, weight 600 |
| Legend labels | `#FFFFFF`, 15px, bold |
| Tooltip | `enabled: true` |

---

## Responsividade

- Layout usa `100vw × 100vh` com `overflow: hidden`
- Grids usam `fr` units (proporcionais)
- KPI row: `grid-template-columns: repeat(4, 1fr)`
- Content grids: `1fr 1fr` (2 colunas iguais)
- Charts usam `responsive: true` + `maintainAspectRatio: false`
- **Não há media queries** — otimizado para telas grandes (signage/TV)
