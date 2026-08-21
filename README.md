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
- A responsividade agora é organizada em **cinco faixas de largura**:
  - **< 800px** → `body.screen-20`
  - **800–1279px** → `body.screen-40`
  - **1280–1599px** → `body.screen-60`
  - **1600–2400px** → `body.screen-46`
  - **> 2400px** → `body.screen-46xl`
- A detecção acontece automaticamente pela largura da janela no `app.js`
- As classes são usadas para ajustar a escala global da interface e manter a leitura consistente em diferentes resoluções

### Visual
- Tema escuro (`--bg: #09090D`)
- Fontes Inter + JetBrains Mono
- Tipografia fluida com `clamp()` aplicada aos principais componentes
- Nos slides 3, 4 e 5, os rótulos de `CONTRATADA`, `Nº PROCESSO SEI` e `INÍCIO DA OBRA` mantêm o padrão visual
- Os valores de `CONTRATADA` e `Nº PROCESSO SEI` foram reduzidos levemente, mantendo `INÍCIO DA OBRA` como estava, para melhorar a leitura em telas menores

### Dependências externas (CDN)
| Biblioteca | Versão |
|------------|--------|
| [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) | latest |
| [chartjs-plugin-datalabels](https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0) | 2.2.0 |
| [Leaflet](https://unpkg.com/leaflet@1.9.4/dist/leaflet.js) | 1.9.4 |
