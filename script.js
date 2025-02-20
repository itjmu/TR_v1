// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Состояние приложения
let state = {
    count: 0,
    dailyCount: 0,
    yesterdayCount: 0,
    totalCount: 0,
    menuOpen: false
};

// Элементы интерфейса
const elements = {
    menu: document.getElementById('sidebar'),
    counter: document.getElementById('count'),
    mainProgress: document.querySelector('.main-progress'),
    statDaily: document.getElementById('stat-daily'),
    statYesterday: document.getElementById('stat-yesterday'),
    statTotal: document.getElementById('stat-total'),
    dailyProgress: document.getElementById('daily-progress'),
    yesterdayProgress: document.getElementById('yesterday-progress'),
    totalProgress: document.getElementById('total-progress')
};

// Функции
function updateCounter() {
    elements.counter.textContent = state.count;
    elements.mainProgress.style.width = `${(state.count / 33) * 100}%`;
}

function updateStats() {
    elements.statDaily.textContent = state.dailyCount;
    elements.statYesterday.textContent = state.yesterdayCount;
    elements.statTotal.textContent = state.totalCount;

    elements.dailyProgress.style.width = `${Math.min((state.dailyCount / 900) * 100, 100)}%`;
    elements.yesterdayProgress.style.width = `${Math.min((state.yesterdayCount / 900) * 100, 100)}%`;
    elements.totalProgress.style.width = `${Math.min((state.totalCount / 50000) * 100, 100)}%`;
}

// Обработчики событий
document.addEventListener('click', (e) => {
    if (e.target.closest('#reset')) {
        state.count = 0;
        updateCounter();
        return;
    }

    if (!e.target.closest('.menu-btn') && !e.target.closest('.sidebar')) {
        if (state.menuOpen) toggleMenu();

        state.count = (state.count + 1) % 33;
        state.dailyCount++;
        state.totalCount++;

        updateCounter();
        updateStats();
    }
});