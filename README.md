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

### Escala adaptativa por tamanho de tela (`styles.css` + `app.js`)
- O dashboard usa `clamp()` para tipografia e espaçamentos fluidos
- Há uma parametrização por tamanho de tela via `--obra-scale`
- Telas **≤1600px (≤40")** usam redução de escala para os slides de obras
- Telas **≥1601px (46"+)** mantêm a escala padrão
- A detecção acontece automaticamente pela largura da janela, com classes `body.screen-40` e `body.screen-46`

### Visual
- Tema escuro (`--bg: #09090D`)
- Fontes Inter + JetBrains Mono
- Tipografia fluida com `clamp()` aplicada aos principais componentes

### Dependências externas (CDN)
| Biblioteca | Versão |
|------------|--------|
| [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) | latest |
| [chartjs-plugin-datalabels](https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0) | 2.2.0 |
| [Leaflet](https://unpkg.com/leaflet@1.9.4/dist/leaflet.js) | 1.9.4 |
