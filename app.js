// Configuração Global Chart.js
Chart.defaults.color = '#9090B0';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = '#252535';

if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
    Chart.defaults.plugins.datalabels.display = false; // Disable globally by default
}

// Automatic Screen Size Parameterization
function updateScreenSizeMode() {
    const body = document.body;
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
    
    body.classList.remove('screen-20', 'screen-40', 'screen-60', 'screen-46', 'screen-46xl');

    if (width < 800) {
        body.classList.add('screen-20');
    } else if (width < 1280) {
        body.classList.add('screen-40');
    } else if (width < 1600) {
        body.classList.add('screen-60');
    } else if (width <= 2400) {
        body.classList.add('screen-46');
    } else {
        body.classList.add('screen-46xl');
    }
}

window.addEventListener('resize', updateScreenSizeMode);
document.addEventListener('DOMContentLoaded', updateScreenSizeMode);
updateScreenSizeMode();

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val || 0);

// Clock update
setInterval(() => {
    const now = new Date();
    document.getElementById('clock-time').textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const days = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
    const months = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    document.getElementById('clock-date').textContent = `${days[now.getDay()]}, ${String(now.getDate()).padStart(2, '0')} DE ${months[now.getMonth()]} DE ${now.getFullYear()}`;
}, 1000);

// Slideshow logic
const slides = document.querySelectorAll('.sg-slide');
let currentSlide = 0;
const slideDotsContainer = document.getElementById('slide-dots');

slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'pulse-dot';
    dot.style.animation = 'none';
    dot.style.backgroundColor = i === 0 ? 'var(--cyan)' : 'var(--border2)';
    dot.style.transition = 'all 0.3s ease';
    dot.dataset.index = i; // store index
    dot.addEventListener('click', () => {
        // manually switch slide
        // deactivate current
        slides[currentSlide].classList.remove('active');
        slideDotsContainer.children[currentSlide].style.backgroundColor = 'var(--border2)';
        slideDotsContainer.children[currentSlide].style.transform = 'scale(1)';
        // set new
        currentSlide = parseInt(dot.dataset.index, 10);
        slides[currentSlide].classList.add('active');
        slideDotsContainer.children[currentSlide].style.backgroundColor = 'var(--cyan)';
        slideDotsContainer.children[currentSlide].style.transform = 'scale(1.3)';
        // Resize map if needed
        if (currentSlide === 0 && window.map) {
            setTimeout(() => window.map.invalidateSize(), 100);
        }
        if (currentSlide >= 2 && window.obraMaps && window.obraMaps[currentSlide - 2]) {
            setTimeout(() => window.obraMaps[currentSlide - 2].invalidateSize(), 100);
        }
    });
    slideDotsContainer.appendChild(dot);
});

setInterval(() => {
    slides[currentSlide].classList.remove('active');
    slideDotsContainer.children[currentSlide].style.backgroundColor = 'var(--border2)';
    slideDotsContainer.children[currentSlide].style.transform = 'scale(1)';

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add('active');
    slideDotsContainer.children[currentSlide].style.backgroundColor = 'var(--cyan)';
    slideDotsContainer.children[currentSlide].style.transform = 'scale(1.3)';

    // Resize map when it becomes visible
    if (currentSlide === 0 && window.map) {
        setTimeout(() => window.map.invalidateSize(), 100);
    }
    if (currentSlide >= 2 && window.obraMaps && window.obraMaps[currentSlide - 2]) {
        setTimeout(() => window.obraMaps[currentSlide - 2].invalidateSize(), 100);
    }
}, 15000); // 15s per slide

// Leaflet Icons
const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:var(--cyan); width:16px; height:16px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 10px var(--cyan);'></div>",
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Data Fetching and Chart Rendering
async function init() {
    try {
        const res = await fetch('dados_obras.json');
        const pac = await res.json();

        if (!pac || pac.length === 0) return;

        // Process KPIs
        const qtdObras = pac.length;
        const totalContrato = pac.reduce((acc, curr) => acc + (curr.VALOR_DO_CONTRATO || 0), 0);
        const totalMedido = pac.reduce((acc, curr) => acc + (curr.VALOR_MEDIDO || 0), 0);
        const avgAvanco = (pac.reduce((acc, curr) => acc + (curr.PERCENTUAL_DE_ANDAMENTO || 0), 0) / qtdObras) * 100;

        document.getElementById('kpi-qtd').textContent = qtdObras;
        document.getElementById('kpi-valor-total').textContent = formatCurrency(totalContrato);
        document.getElementById('kpi-valor-medido').textContent = formatCurrency(totalMedido);
        document.getElementById('kpi-avanco').textContent = avgAvanco.toFixed(1) + '%';

        // Initialize Map
        const map = L.map('map', { zoomControl: false }).setView([-16.605, -49.26], 8);
        window.map = map;
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const bounds = [];
        const obrasListContainer = document.getElementById('obras-list');
        window.obraMaps = [];

        pac.forEach((obra, index) => {
            // Map marker
            if (obra.LATITUDE && obra.LONGITUDE) {
                L.marker([obra.LATITUDE, obra.LONGITUDE], { icon: customIcon })
                    .addTo(map)
                    .bindTooltip(obra.OBRA || 'Obra', { direction: 'top' });
                bounds.push([obra.LATITUDE, obra.LONGITUDE]);
            }

            // Obras List Item (using HTML bar)
            const avanco = (obra.PERCENTUAL_DE_ANDAMENTO || 0) * 100;
            const row = document.createElement('div');
            row.style.marginBottom = '12px';
            row.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
                    <span style="color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:80%;">${obra.OBRA}</span>
                    <span style="font-family:'JetBrains Mono'; color:var(--cyan);">${avanco.toFixed(1)}%</span>
                </div>
                <div style="width:100%; height:8px; background:var(--surface2); border-radius:4px; overflow:hidden;">
                    <div style="width:${avanco}%; height:100%; background:var(--cyan); box-shadow:0 0 8px rgba(0,212,255,0.6);"></div>
                </div>
            `;
            obrasListContainer.appendChild(row);

            // Build slide for the obra
            if (index < 3) {
                const formatExcelDate = (excelDate) => {
                    if (!excelDate) return "-";
                    const date = new Date((excelDate - 25569) * 86400 * 1000);
                    return date.toLocaleDateString('pt-BR');
                };

                const dataInicio = formatExcelDate(obra.INICIO_DA_OBRA);
                const valorContrato = obra.VALOR_DO_CONTRATO || 0;
                const valorMedido = obra.VALOR_MEDIDO || 0;
                const valorRestante = Math.max(0, valorContrato - valorMedido);

                const html = `
                    <div class="obra-container">
                        <div class="obra-title fade-up-1">${obra.OBRA.toUpperCase()}</div>
                        
                        <div class="obra-content-row fade-up-2">
                            <!-- Left Column: Info Gerais -->
                            <div style="display:flex; flex-direction:column; gap:16px;">
                                <div class="content-card" style="flex:1; justify-content:center;">
                                    <div class="obra-info-label">CONTRATADA</div>
                                    <div class="obra-info-val" style="font-size: clamp(14px, 1.3vw, 24px);">${obra.CONTRATADA || '-'}</div>
                                </div>
                                <div class="content-card" style="flex:1; justify-content:center;">
                                    <div class="obra-info-label">Nº PROCESSO SEI</div>
                                    <div class="obra-info-val" style="font-size: clamp(14px, 1.3vw, 24px);">${obra.PROCESSO_SEI || '-'}</div>
                                </div>
                                <div class="content-card" style="flex:1; justify-content:center;">
                                    <div class="obra-info-label">INÍCIO DA OBRA</div>
                                    <div class="obra-info-val">${dataInicio}</div>
                                </div>
                            </div>
                            
                            <!-- Central Column: Analise & Geo -->
                            <div style="display:flex; flex-direction:row; gap:16px;">
                                <div class="content-card" style="flex:1;">
                                    <div class="card-title">Análise de Custos</div>
                                    <div class="chart-container" style="min-height:180px; display:flex; justify-content:center; align-items:center;">
                                        <canvas id="chart-custos-${index}"></canvas>
                                    </div>
                                </div>
                                <div class="content-card" style="flex:1;">
                                    <div class="card-title">Geolocalização</div>
                                    <div class="chart-container" style="min-height:180px;">
                                        <div id="map-obra-${index}" style="width:100%; height:100%; border-radius:8px;"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Right Column: Equipe -->
                            <div class="content-card">
                                <div class="card-title">Equipe de Fiscalização</div>
                                <div style="display:flex; flex-direction:column; gap:16px; margin-top:20px;">
                                    <div><div class="obra-info-label">ARQUITETURA</div><div class="obra-info-val obra-team-val" style="margin-top:2px;">${obra.ARQUITETURA || '-'}</div></div>
                                    <div><div class="obra-info-label">CIVIL</div><div class="obra-info-val obra-team-val" style="margin-top:2px;">${obra.CIVIL || '-'}</div></div>
                                    <div><div class="obra-info-label">ELÉTRICA</div><div class="obra-info-val obra-team-val" style="margin-top:2px;">${obra.ELETRICA || '-'}</div></div>
                                    <div><div class="obra-info-label">MECÂNICA</div><div class="obra-info-val obra-team-val" style="margin-top:2px;">${obra.MECANICA || '-'}</div></div>
                                    <div><div class="obra-info-label">SISTEMA DADOS</div><div class="obra-info-val obra-team-val" style="margin-top:2px;">${obra.SISTEMA_DADOS || '-'}</div></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Bottom KPIs -->
                        <div class="kpi-row fade-up-3" style="margin-top:auto;">
                            <div class="kpi-card c-warn">
                                <div class="kpi-label">Dias Faltantes</div>
                                <div class="kpi-value obra-kpi-large">${obra.DIAS_ATUAIS_PARA_TERMINO_DE_OBRAS || 0}</div>
                            </div>
                            <div class="kpi-card c-blue">
                                <div class="kpi-label">Nº de Medições</div>
                                <div class="kpi-value obra-kpi-large">${obra.MEDICOES || 0}</div>
                            </div>
                            <div class="kpi-card c-ok">
                                <div class="kpi-label">Valor Medido</div>
                                <div class="kpi-value obra-kpi-med">${formatCurrency(valorMedido)}</div>
                            </div>
                            <div class="kpi-card c-cyan">
                                <div class="kpi-label">Valor Contrato</div>
                                <div class="kpi-value obra-kpi-med">${formatCurrency(valorContrato)}</div>
                            </div>
                        </div>
                    </div>
                `;

                const slideEl = document.getElementById(`slide-obra-${index}`);
                if (slideEl) {
                    slideEl.innerHTML = html;

                    // Chart
                    new Chart(document.getElementById(`chart-custos-${index}`), {
                        type: 'doughnut',
                        data: {
                            labels: ['Valor Pago', 'Total Restante a Pagar'],
                            datasets: [{
                                data: [valorMedido, valorRestante],
                                backgroundColor: ['#00E676', '#333348'],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#FFF' } },
                                datalabels: {
                                    display: true,
                                    color: '#FFFFFF',
                                    font: { weight: 'bold', size: 14 },
                                    formatter: (value, context) => {
                                        const total = context.chart._metasets[context.datasetIndex].total;
                                        if (total === 0) return '0%';
                                        return (value / total * 100).toFixed(0) + '%';
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return formatCurrency(context.raw);
                                        }
                                    }
                                }
                            },
                            cutout: '65%'
                        }
                    });

                    // Map
                    if (obra.LATITUDE && obra.LONGITUDE) {
                        const obraMap = L.map(`map-obra-${index}`, { zoomControl: false }).setView([obra.LATITUDE, obra.LONGITUDE], 14);
                        window.obraMaps.push(obraMap);
                        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                            attribution: '&copy; OpenStreetMap',
                            subdomains: 'abcd',
                            maxZoom: 20
                        }).addTo(obraMap);
                        L.marker([obra.LATITUDE, obra.LONGITUDE], { icon: customIcon }).addTo(obraMap);
                    } else {
                        window.obraMaps.push(null);
                    }
                }
            }
        });

        if (bounds.length > 0) map.fitBounds(bounds, { padding: [20, 20] });

        // Chart 1: Financeiro (Contratado vs Medido)
        const labels = pac.map(o => {
            let nome = o.OBRA || 'Obra';
            if (nome.length > 20) nome = nome.substring(0, 17) + '...';
            return nome;
        });
        const vContrato = pac.map(o => o.VALOR_DO_CONTRATO || 0);
        const vMedido = pac.map(o => o.VALOR_MEDIDO || 0);
        const vRestante = vContrato.map((c, i) => c - vMedido[i]);
        new Chart(document.getElementById('chart-financeiro'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Medido', data: vMedido, backgroundColor: '#00E676', borderRadius: 4 },
                    { label: 'Restante', data: vRestante, backgroundColor: '#FF8A80', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#FFF' } },
                    datalabels: {
                        display: true,
                        color: '#FFF',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: 4,
                        padding: 4,
                        anchor: 'center',
                        align: 'center',
                        formatter: (value, ctx) => {
                            const total = ctx.chart.data.datasets.reduce((sum, ds) => sum + ds.data[ctx.dataIndex], 0);
                            return total ? ((value / total) * 100).toFixed(1) + '%' : '';
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const dataset = tooltipItem.dataset;
                                const value = dataset.data[tooltipItem.dataIndex];
                                return `${dataset.label}: ${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: { stacked: true, ticks: { color: '#C0C0D8' }, grid: { display: false } },
                    y: { stacked: true, ticks: { color: '#C0C0D8' }, grid: { color: '#2A2A35' } }
                }
            }
        });

        // Chart 2: Prazos (Corridos vs Faltantes)
        const vCorridos = pac.map(o => o.DIAS_CORRIDOS_DE_OBRA || 0);
        const vFaltam = pac.map(o => o.DIAS_ATUAIS_PARA_TERMINO_DE_OBRAS || 0);

        new Chart(document.getElementById('chart-prazo'), {
            type: 'bar',
            indexAxis: 'y',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Dias Corridos', data: vCorridos, backgroundColor: '#FFB300', borderRadius: 4 },
                    { label: 'Dias Faltantes', data: vFaltam, backgroundColor: '#4B8BFF', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#FFF' } },
                    datalabels: {
                        display: true,
                        color: '#FFF',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: 4,
                        padding: 4,
                        anchor: 'center',
                        align: 'center',
                        formatter: (value, ctx) => {
                            const total = ctx.chart.data.datasets.reduce((sum, ds) => sum + ds.data[ctx.dataIndex], 0);
                            return total ? ((value / total) * 100).toFixed(1) + '%' : '';
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const dataset = tooltipItem.dataset;
                                const value = dataset.data[tooltipItem.dataIndex];
                                return `${dataset.label}: ${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: { stacked: true, ticks: { color: '#C0C0D8' }, grid: { display: false } },
                    y: { stacked: true, ticks: { color: '#C0C0D8' }, grid: { color: '#2A2A35' } }
                }
            }
        });

    } catch (e) {
        console.error('Error loading pac data:', e);
        document.body.innerHTML += `<div style="position:absolute;top:0;left:0;background:red;color:white;z-index:9999;padding:20px;font-size:18px;">ERRO: ${e.message} <br> ${e.stack}</div>`;
    }
}

init();
