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


const SETTINGS = {
    levels: [
        { required: 3500, level: 1 },
        { required: 7000, level: 2 },
        { required: 14000, level: 3 },
        { required: 30000, level: 4 },
        { required: 50000, level: 5 }
    ]
};

function calculateLevelProgress() {
    const currentLevel = SETTINGS.levels.find(l => state.totalCount < l.required) || { level: 5 };
    const prevLevel = SETTINGS.levels[currentLevel.level - 2] || { required: 0 };
    return ((state.totalCount - prevLevel.required) / (currentLevel.required - prevLevel.required)) * 100 || 100;
}

function updateLevel() {
    const levelProgress = calculateLevelProgress();
    document.querySelector('.level-progress').style.width = `${levelProgress}%`;
    document.getElementById('level').textContent = SETTINGS.levels.find(l => state.totalCount < l.required)?.level || 5;
}

const SETTINGS = {
    zikrList: [
        "СубhаналЛоh",
        "АлhамдулилЛah",
        "Аллоhу Акбар",
        "Ла илАhа иллалЛоh",
        "АстагфирулЛoh",
        "СубhаналЛоhи ва баhамдиhиhи",
        "Ла илаha илла-лЛоhу ваhдаhу ла шарика лаh. Лаhул мулку ва лаhу-л haмда ва hува ъала кулли шайин Qадир"
    ]
};

function updateZikrText() {
    const zikrText = document.getElementById('zikr-text');
    zikrText.textContent = SETTINGS.zikrList[state.currentZikrIndex];
}

// В обработчике кликов:
if (state.count === 33) {
    state.count = 0;
    state.currentZikrIndex = (state.currentZikrIndex + 1) % SETTINGS.zikrList.length;
    updateZikrText();
}


function saveData() {
    localStorage.setItem('tasbihData', JSON.stringify(state));
}

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('tasbihData'));
    if (savedData) {
        state = { ...state, ...savedData };
    }
}

// При загрузке страницы:
loadData();
updateCounter();
updateStats();
updateLevel();
updateZikrText();


    if (!e.target.closest('.menu-btn') && !e.target.closest('.sidebar')) {
        if (state.menuOpen) toggleMenu();

        state.count = (state.count + 1) % 33;
        state.dailyCount++;
        state.totalCount++;

        updateCounter();
        updateStats();
    }
});