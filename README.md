# obras-pac-seinfra-ufg
Repositório para página de análise de andamento das obras do PAC via SEINFRA UFG

## Configuração de Exibição Web

### Estrutura (`index.html`)
- Dashboard fullscreen em modo painel/TV (`overflow: hidden`, sem scroll)
- **5 slides**:
  1. Visão Geral — 4 KPIs + mapa Leaflet + lista de obras
  2. Andamento Financeiro — 2 gráficos Chart.js
  3–5. Slides de obras individuais (gerados via JS a partir de `dados_obras.json`)

### Rotação de slides (`app.js`)
- Troca automática a cada **15 segundos**
- Dots clicáveis no rodapé para navegação manual
- Relógio/data ao vivo no header (atualização a cada 1 segundo)

### Autoajuste de tela (`app.js` + `styles.css`)
- O dashboard agora usa **escala global automática** baseada no tamanho real da janela
- A referência de layout é **1920x1080**, e o conteúdo é ajustado com `document.documentElement.style.zoom`
- A lógica antiga de escala por **40" / 46"** foi removida
- O objetivo é manter as proporções e legibilidade em telas pequenas e grandes sem reduzir agressivamente as fontes

### Visual
- Tema escuro (`--bg: #09090D`)
- Fontes Inter + JetBrains Mono
- Tipografia e espaçamentos padronizados com valores fixos para manter consistência visual no autoajuste

### Dependências externas (CDN)
| Biblioteca | Versão |
|------------|--------|
| [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) | latest |
| [chartjs-plugin-datalabels](https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0) | 2.2.0 |
| [Leaflet](https://unpkg.com/leaflet@1.9.4/dist/leaflet.js) | 1.9.4 |
