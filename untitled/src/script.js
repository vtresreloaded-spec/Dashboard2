// ============================================
// NASDAQ CFD PRO - JAVASCRIPT COMPLETO
// ============================================

// ============================================
// DATOS DE TRADING
// ============================================

const tradingData = {
    zones: [
        { time: '00:00-07:00', status: 'red', label: '🔴 NO OPERAR', desc: 'Sesión asiática' },
        { time: '07:00-09:30', status: 'yellow', label: '🟡 OBSERVAR', desc: 'Pre-market' },
        { time: '09:30-10:30', status: 'green', label: '🟢 VENTANA PRINCIPAL', desc: 'Apertura Wall Street' },
        { time: '10:30-12:00', status: 'green', label: '🟢 CONTINUACIÓN', desc: 'Trades direccionales' },
        { time: '12:00-13:30', status: 'red', label: '🔴 DEAD ZONE', desc: 'No operar' },
        { time: '13:30-15:00', status: 'green', label: '🟢 ÚLTIMA VENTANA', desc: 'Liquidez vuelve' },
        { time: '15:30-16:00', status: 'yellow', label: '🟡 CIERRE', desc: 'Alta volatilidad' }
    ],
    
    weekly: [
        { day: 'LUN', desc: 'Define tendencia', status: 'yellow' },
        { day: 'MAR', desc: 'Continuidad fuerte', status: 'green' },
        { day: 'MIÉ', desc: 'Volatilidad macro', status: 'yellow' },
        { day: 'JUE', desc: 'Excelente trading', status: 'green' },
        { day: 'VIE', desc: 'Errátil', status: 'red' }
    ],
    
    magnificent7: [
        { symbol: 'AAPL', name: 'Apple', price: 175.34, change: 1.2 },
        { symbol: 'MSFT', name: 'Microsoft', price: 420.45, change: 0.8 },
        { symbol: 'GOOGL', name: 'Google', price: 142.67, change: -0.3 },
        { symbol: 'AMZN', name: 'Amazon', price: 178.90, change: 1.5 },
        { symbol: 'NVDA', name: 'NVIDIA', price: 950.23, change: 2.1 },
        { symbol: 'META', name: 'Meta', price: 485.50, change: 0.5 },
        { symbol: 'TSLA', name: 'Tesla', price: 175.80, change: -1.2 }
    ],
    
    news: [
        { time: '09:45', title: 'Powell: "Tasas se mantendrán altas"', impact: 'high', interpretation: 'bearish', reason: 'Política monetaria restrictiva' },
        { time: '10:30', title: 'NVIDIA anuncia split 10x1', impact: 'high', interpretation: 'bullish', reason: 'Mayor accesibilidad para inversores' },
        { time: '11:15', title: 'IPC subyacente: +0.4% vs +0.3% esperado', impact: 'high', interpretation: 'bearish', reason: 'Presión inflacionaria' },
        { time: '13:00', title: 'Tesla: Entregas superan estimados', impact: 'medium', interpretation: 'bullish', reason: 'Fuerte demanda' },
        { time: '14:30', title: 'Apple: iPhone 16 ventas sólidas', impact: 'medium', interpretation: 'bullish', reason: 'Crecimiento en China' },
        { time: '15:45', title: 'Amazon: AWS crece 18%', impact: 'medium', interpretation: 'bullish', reason: 'Margen superior' }
    ]
};

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================

let appState = {
    capital: 10000,
    profile: { name: 'Trader Alpha', avatar: '👤' }
};

// ============================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ============================================

function init() {
    loadProfile();
    populateZones();
    populateWeekly();
    populateMag7();
    populateNews();
    initAnalyticsChart();
    generateCalendar();
    initEventListeners();
    
    // Timers en tiempo real
    updateTime();
    setInterval(updateTime, 1000);
    setInterval(updateMarketData, 3000);
    setInterval(updateNews, 15000);
}

// ============================================
// PERFIL DE USUARIO
// ============================================

function loadProfile() {
    const saved = localStorage.getItem('nasdaqProfile');
    if (saved) {
        appState.profile = JSON.parse(saved);
    }
    document.getElementById('profileName').textContent = appState.profile.name;
    document.getElementById('avatarDisplay').textContent = appState.profile.avatar;
    document.getElementById('headerAvatar').textContent = appState.profile.avatar;
}

// Eventos del perfil
document.addEventListener('DOMContentLoaded', function() {
    // Botón editar perfil
    document.getElementById('editProfileBtn').addEventListener('click', () => {
        document.getElementById('profileModal').classList.add('show');
        document.getElementById('profileNameInput').value = appState.profile.name;
    });
    
    // Guardar perfil
    document.getElementById('saveProfileBtn').addEventListener('click', () => {
        appState.profile.name = document.getElementById('profileNameInput').value;
        const selected = document.querySelector('.avatar-option.selected');
        if (selected) appState.profile.avatar = selected.dataset.avatar;
        localStorage.setItem('nasdaqProfile', JSON.stringify(appState.profile));
        loadProfile();
        document.getElementById('profileModal').classList.remove('show');
    });
    
    // Selector de avatar
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });
    
    // Cerrar modal haciendo clic fuera
    document.getElementById('profileModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('profileModal')) {
            e.target.classList.remove('show');
        }
    });
});

// ============================================
// CAPITAL SIMULADO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addCapital').addEventListener('click', () => {
        appState.capital += 1000;
        updateCapital();
    });
    
    document.getElementById('removeCapital').addEventListener('click', () => {
        if (appState.capital >= 1000) {
            appState.capital -= 1000;
            updateCapital();
        }
    });
});

function updateCapital() {
    document.getElementById('capitalValue').textContent = '$' + appState.capital.toLocaleString();
    const progress = ((appState.capital - 10000) / 10000) * 50;
    document.getElementById('capitalProgress').style.width = Math.min(progress, 100) + '%';
}

// ============================================
// RELOJ EN TIEMPO REAL
// ============================================

function updateTime() {
    const now = new Date();
    
    // Polonia (UTC+1/UTC+2)
    const polandTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
    document.getElementById('polandTime').textContent = 
        polandTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
    // Nueva York (UTC-4/UTC-5)
    const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const nyTimeStr = nyTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    document.getElementById('nyTime').textContent = nyTimeStr;
    document.getElementById('currentTime').textContent = nyTimeStr.substring(0,5);
    
    // Fecha actual
    document.getElementById('currentDate').textContent = 
        nyTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // Cuenta regresiva a apertura (09:30 NY)
    const target = new Date(nyTime);
    target.setHours(9, 30, 0, 0);
    if (nyTime > target) target.setDate(target.getDate() + 1);
    
    const diff = target - nyTime;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('marketCountdown').textContent = 
        `Apertura en: ${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    
    updateMarketStatus(nyTime);
}

// ============================================
// ESTADO DEL MERCADO
// ============================================

function updateMarketStatus(nyTime) {
    const hour = nyTime.getHours() + nyTime.getMinutes() / 60;
    let status, session, volatility, zoneAlert;
    
    if (hour < 7) { 
        status = 'Sesión asiática'; 
        session = '🔴 Cerrado'; 
        volatility = 'Baja'; 
        zoneAlert = '🔴 No operar - Sesión asiática'; 
    }
    else if (hour < 9.5) { 
        status = 'Pre-market'; 
        session = '🟡 Observación'; 
        volatility = 'Media'; 
        zoneAlert = '🟡 Pre-market - Observar niveles'; 
    }
    else if (hour < 10.5) { 
        status = 'Apertura'; 
        session = '🟢 VENTANA PRINCIPAL'; 
        volatility = 'Alta'; 
        zoneAlert = '⚡ APERTURA - Mayor volatilidad'; 
    }
    else if (hour < 12) { 
        status = 'Continuación'; 
        session = '🟢 Trading activo'; 
        volatility = 'Alta'; 
        zoneAlert = '📈 Continuación - Buscar confirmación'; 
    }
    else if (hour < 13.5) { 
        status = 'Dead Zone'; 
        session = '🔴 NO OPERAR'; 
        volatility = 'Baja'; 
        zoneAlert = '💤 Dead zone - No operar'; 
    }
    else if (hour < 15) { 
        status = 'Última ventana'; 
        session = '🟢 Oportunidad'; 
        volatility = 'Alta'; 
        zoneAlert = '🎯 Última ventana - Oportunidad'; 
    }
    else if (hour < 16) { 
        status = 'Cierre'; 
        session = '🟡 Alta volatilidad'; 
        volatility = 'Muy Alta'; 
        zoneAlert = '⚠️ Cierre - Precaución'; 
    }
    else { 
        status = 'Cerrado'; 
        session = '🔴 Cerrado'; 
        volatility = 'N/A'; 
        zoneAlert = '🔒 Mercado cerrado'; 
    }
    
    document.getElementById('marketStatus').textContent = status;
    document.getElementById('currentSession').textContent = session;
    document.getElementById('volatilityValue').textContent = volatility;
    document.getElementById('zoneAlert').textContent = zoneAlert;
    
    const indicator = document.getElementById('marketIndicator');
    if (session.includes('🟢')) indicator.style.background = 'var(--success)';
    else if (session.includes('🟡')) indicator.style.background = 'var(--warning)';
    else indicator.style.background = 'var(--danger)';
}

// ============================================
// MAGNIFICENT 7
// ============================================

function populateMag7() {
    const container = document.getElementById('mag7Container');
    container.innerHTML = tradingData.magnificent7.map(s => `
        <div class="mag7-item">
            <span class="mag7-symbol">${s.symbol}</span>
            <span class="mag7-name">${s.name}</span>
            <span class="mag7-price">$${s.price.toFixed(2)}</span>
            <span class="${s.change >= 0 ? 'positive' : 'negative'}">
                ${s.change >= 0 ? '+' : ''}${s.change}%
            </span>
        </div>
    `).join('');
}

function updateMarketData() {
    tradingData.magnificent7 = tradingData.magnificent7.map(s => ({
        ...s,
        price: s.price * (1 + (Math.random() - 0.5) * 0.01),
        change: (Math.random() * 4 - 2).toFixed(1)
    }));
    populateMag7();
    document.getElementById('tradesCount').textContent = Math.floor(Math.random() * 4) + '/3';
}

// ============================================
// NOTICIAS CON INTERPRETACIÓN
// ============================================

function populateNews() {
    const container = document.getElementById('newsContainer');
    container.innerHTML = tradingData.news.map(n => {
        const icon = n.interpretation === 'bullish' ? '🚀' : n.interpretation === 'bearish' ? '📉' : '⚖️';
        const color = n.interpretation === 'bullish' ? 'var(--success)' : n.interpretation === 'bearish' ? 'var(--danger)' : 'var(--warning)';
        return `
            <div class="news-item">
                <div class="news-time">${n.time}</div>
                <div style="font-weight:500;">${n.title}</div>
                <div class="news-interpretation" style="color:${color}">
                    ${icon} ${n.interpretation === 'bullish' ? 'MERCADO ALCISTA' : n.interpretation === 'bearish' ? 'MERCADO BAJISTA' : 'NEUTRAL'} 
                    <span style="color:var(--text-secondary);">· ${n.reason}</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateNews() {
    if (Math.random() > 0.6) {
        const interpretations = ['bullish', 'bearish', 'neutral'];
        const headlines = [
            'NVIDIA supera estimados',
            'Apple anuncia recompras',
            'Tesla baja producción',
            'Inflación mayor a esperada',
            'FOMC mantiene tasas',
            'Microsoft sube dividendo'
        ];
        const reasons = {
            bullish: ['Fuerte demanda', 'Catalizador positivo', 'Crecimiento esperado'],
            bearish: ['Presión regulatoria', 'Debilidad sectorial', 'Riesgos macro'],
            neutral: ['En línea esperado', 'Sin novedades', 'Mercado consolida']
        };
        
        const interpretation = interpretations[Math.floor(Math.random() * 3)];
        tradingData.news.unshift({
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            title: headlines[Math.floor(Math.random() * headlines.length)],
            impact: interpretation === 'bullish' || interpretation === 'bearish' ? 'high' : 'medium',
            interpretation: interpretation,
            reason: reasons[interpretation][Math.floor(Math.random() * 3)]
        });
        tradingData.news = tradingData.news.slice(0, 8);
        populateNews();
    }
}

// ============================================
// ZONAS DE TRADING
// ============================================

function populateZones() {
    document.getElementById('zonesTable').innerHTML = tradingData.zones.map(z => `
        <div class="zone-row">
            <span>${z.time}</span>
            <span class="zone-status status-${z.status}">${z.label}</span>
            <span class="zone-desc">${z.desc}</span>
        </div>
    `).join('');
}

// ============================================
// CALENDARIO SEMANAL
// ============================================

function populateWeekly() {
    document.getElementById('weeklyGrid').innerHTML = tradingData.weekly.map(w => `
        <div class="day-card">
            <div class="day-name">${w.day}</div>
            <div class="day-desc">${w.desc}</div>
            <div class="day-status status-${w.status}">${w.status === 'green' ? '🟢' : w.status === 'yellow' ? '🟡' : '🔴'}</div>
        </div>
    `).join('');
    
    // Calcular número de semana
    const now = new Date();
    const weekNumber = getWeekNumber(now);
    document.getElementById('weekOfYear').textContent = 'Semana ' + weekNumber;
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ============================================
// GRÁFICO ANALYTICS
// ============================================

function initAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
            datasets: [{
                data: [2.1, 3.8, 1.5, 4.2, 2.8],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0,212,255,0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00d4ff',
                pointBorderColor: '#fff',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                y: { 
                    grid: { color: 'rgba(255,255,255,0.05)' }, 
                    ticks: { color: '#a0a0b0' } 
                },
                x: { 
                    ticks: { color: '#a0a0b0' } 
                }
            }
        }
    });
}

// ============================================
// CALENDARIO MENSUAL
// ============================================

let currentCalDate = new Date();

function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();
    document.getElementById('currentMonthYear').textContent = 
        currentCalDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let html = '';
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(d => {
        html += `<div class="calendar-day-header">${d}</div>`;
    });
    
    for (let i = 0; i < firstDay.getDay(); i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    const today = new Date();
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(year, month, d);
        const isToday = date.toDateString() === today.toDateString();
        const dayOfWeek = date.getDay();
        let statusClass = '';
        if (dayOfWeek === 1) statusClass = 'status-yellow';
        else if (dayOfWeek === 2 || dayOfWeek === 4) statusClass = 'status-green';
        else if (dayOfWeek === 3) statusClass = 'status-yellow';
        else if (dayOfWeek === 5) statusClass = 'status-red';
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div>${d}</div>
                <div class="calendar-day-indicator ${statusClass}"></div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            const section = item.dataset.section;
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
            document.getElementById('pageTitle').textContent = 
                section.charAt(0).toUpperCase() + section.slice(1);
        });
    });
});

// ============================================
// BOTONES DE ACCIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Botón Refresh
    document.getElementById('refreshBtn').addEventListener('click', () => {
        location.reload();
    });
    
    // Botón Refresh Noticias
    document.getElementById('refreshNews').addEventListener('click', () => {
        updateNews();
        populateNews();
    });
    
    // Botón Notificaciones
    document.getElementById('notificationsBtn').addEventListener('click', () => {
        alert('🔔 Notificaciones:\n• Apertura en 15 min\n• Niveles clave: 17,850\n• Noticia importante: Datos IPC');
    });
    
    // Navegación calendario
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() - 1);
        generateCalendar();
    });
    
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        generateCalendar();
    });
    
    // Botones Settings
    document.getElementById('saveSettings').addEventListener('click', () => {
        alert('✅ Configuración guardada correctamente');
    });
    
    document.getElementById('resetSettings').addEventListener('click', () => {
        if (confirm('¿Resetear toda la configuración?')) {
            localStorage.clear();
            location.reload();
        }
    });
});

// ============================================
// CURSOR GLOW
// ============================================

document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }
});

// ============================================
// INICIAR APLICACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', init);