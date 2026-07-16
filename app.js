// Configuração Global Chart.js
Chart.defaults.color = '#9090B0';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = '#252535';

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val || 0);

// Clock update
setInterval(() => {
    const now = new Date();
    document.getElementById('clock-time').textContent = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    const days = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
    const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    document.getElementById('clock-date').textContent = `${days[now.getDay()]}, ${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]}`;
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
    if(currentSlide === 0 && window.map) {
        setTimeout(() => window.map.invalidateSize(), 100);
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
        const res = await fetch('pac_data.json');
        const pac = await res.json();

        if(!pac || pac.length === 0) return;

        // Process KPIs
        const qtdObras = pac.length;
        const totalContrato = pac.reduce((acc, curr) => acc + (curr['VALOR DO CONTRATO'] || 0), 0);
        const totalMedido = pac.reduce((acc, curr) => acc + (curr['VALOR MEDIDO'] || 0), 0);
        const avgAvanco = (pac.reduce((acc, curr) => acc + (curr['ANDAMENTO %'] || 0), 0) / qtdObras) * 100;

        document.getElementById('kpi-qtd').textContent = qtdObras;
        document.getElementById('kpi-valor-total').textContent = formatCurrency(totalContrato);
        document.getElementById('kpi-valor-medido').textContent = formatCurrency(totalMedido);
        document.getElementById('kpi-avanco').textContent = avgAvanco.toFixed(1) + '%';

        // Initialize Map
        const map = L.map('map', {zoomControl: false}).setView([-16.605, -49.26], 8);
        window.map = map;
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const bounds = [];
        const obrasListContainer = document.getElementById('obras-list');

        pac.forEach(obra => {
            // Map marker
            if(obra.LATITUDE && obra.LONGITUDE) {
                L.marker([obra.LATITUDE, obra.LONGITUDE], {icon: customIcon})
                 .addTo(map)
                 .bindTooltip(obra.OBRA || 'Obra', {direction: 'top'});
                bounds.push([obra.LATITUDE, obra.LONGITUDE]);
            }

            // Obras List Item (using HTML bar)
            const avanco = (obra['ANDAMENTO %'] || 0) * 100;
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
        });

        if(bounds.length > 0) map.fitBounds(bounds, {padding: [20, 20]});

        // Chart 1: Financeiro (Contratado vs Medido)
        const labels = pac.map(o => {
            let nome = o.OBRA || 'Obra';
            if (nome.length > 20) nome = nome.substring(0, 17) + '...';
            return nome;
        });
        const vContrato = pac.map(o => o['VALOR DO CONTRATO'] || 0);
        const vMedido = pac.map(o => o['VALOR MEDIDO'] || 0);

        new Chart(document.getElementById('chart-financeiro'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Contratado', data: vContrato, backgroundColor: '#00D4FF', borderRadius: 4 },
                    { label: 'Medido', data: vMedido, backgroundColor: '#00E676', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#FFF' } } },
                scales: {
                    x: { ticks: { color: '#C0C0D8' }, grid: { display: false } },
                    y: { ticks: { color: '#C0C0D8' }, grid: { color: '#2A2A35' } }
                }
            }
        });

        // Chart 2: Prazos (Corridos vs Faltantes)
        const vCorridos = pac.map(o => o['DIAS CORRIDOS'] || 0);
        const vFaltam = pac.map(o => o['DIAS QUE FALTAM'] || 0);

        new Chart(document.getElementById('chart-prazo'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Dias Corridos', data: vCorridos, backgroundColor: '#FFB300', borderRadius: 4 },
                    { label: 'Dias Faltantes', data: vFaltam, backgroundColor: '#4B8BFF', borderRadius: 4 }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#FFF' } } },
                scales: {
                    x: { ticks: { color: '#C0C0D8' }, grid: { color: '#2A2A35' } },
                    y: { ticks: { color: '#C0C0D8' }, grid: { display: false } }
                }
            }
        });

    } catch (e) {
        console.error('Error loading pac data:', e);
    }
}

init();
