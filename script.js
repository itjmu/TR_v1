// Настройки
const SETTINGS = {
    zikrList: [
        "СубhаналЛоh",
        "АлhамдулилЛah",
        "Аллоhу Акбар",
        "Ла илАhа иллалЛоh",
        "АстагфирулЛoh",
        "СубhаналЛоhи ва баhамдиhиhи",
        "Ла илаha илла-лЛоhу ваhдаhу ла шарика лаh. Лаhул мулку ва лаhу-л haмда ва hува ъала кулли шайин Qадир"
    ],
    levels: [
        {required: 3500, level: 1},
        {required: 7000, level: 2},
        {required: 14000, level: 3},
        {required: 30000, level: 4},
        {required: 50000, level: 5}
    ]
};

// Данные приложения
let appData = JSON.parse(localStorage.getItem('tasbihData')) || {
    count: 0,
    totalCount: 0,
    currentZikrIndex: 0,
    firstVisitDate: new Date().toISOString(),
    dailyCount: 0,
    yesterdayCount: 0,
    lastVisitDate: new Date().toLocaleDateString(),
    lastActive: null,
    isZikrTextVisible: true
};

const tg = window.Telegram.WebApp;

// Переменные для обработки свайпов
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 10;
const ACTION_INTERVAL = 300;
let lastActionTime = 0;

// Инициализация Telegram Web App
function initTelegramWebApp() {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    tg.BackButton.hide();
}

// Обработчик кликов
function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const now = Date.now();
    if (now - lastActionTime < ACTION_INTERVAL) return;
    lastActionTime = now;

    if (document.getElementById('sidebar').classList.contains('active')) {
        toggleMenu();
        return;
    }

    appData.count++;
    appData.totalCount++;
    appData.dailyCount++;
    
    if (appData.count === 33) {
        appData.count = 0;
        appData.currentZikrIndex = (appData.currentZikrIndex + 1) % SETTINGS.zikrList.length;
    }
    
    updateDisplays();
    updateStats();
    saveData();
}

// Обработчик свайпов
function handleSwipe(e) {
    e.preventDefault();
    e.stopPropagation();

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
        handleClick(e);
    }
}

// Обработчик начала касания
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

// Инициализация приложения
function initApp() {
    initTelegramWebApp();
    updateStats();
    updateDisplays();

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#reset') && !e.target.closest('.menu-btn')) {
            handleClick(e);
        }
    });

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleSwipe);

    document.getElementById('reset').addEventListener('click', () => {
        if (appData.totalCount > 100) appData.totalCount--;
        appData.count = 0;
        appData.currentZikrIndex = 0;
        updateDisplays();
        saveData();
    });

    // Проверка ежедневного сброса
    const today = new Date().toLocaleDateString();
    if (appData.lastVisitDate !== today) {
        appData.yesterdayCount = appData.dailyCount;
        appData.dailyCount = 0;
        appData.lastVisitDate = today;
        saveData();
    }
}

// Запуск приложения после полной загрузки
window.addEventListener('DOMContentLoaded', initApp);