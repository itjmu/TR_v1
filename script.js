// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Настройки
const SETTINGS = {
    zikrList: [
        "Субханаллах",
        "Альхамдулиллях",
        "Аллаху Акбар",
        "Ля иляха илляллах",
        "Астагфируллах",
        "Субханаллахи ва бихамдихи",
        "Ля иляха илляллаху вахдаху ля шарика лях"
    ],
    levels: [
        {required: 100, level: 1},
        {required: 500, level: 2},
        {required: 1500, level: 3},
        {required: 3000, level: 4},
        {required: 5000, level: 5}
    ]
};

// Состояние приложения
let state = JSON.parse(localStorage.getItem('tasbihData')) || {
    count: 0,
    total: 0,
    daily: 0,
    yesterday: 0,
    currentZikr: 0,
    level: 1,
    textVisible: true
};

// Элементы интерфейса
const elements = {
    menu: document.getElementById('sidebar'),
    count: document.getElementById('count'),
    total: document.getElementById('stat-total'),
    daily: document.getElementById('stat-daily'),
    yesterday: document.getElementById('stat-yesterday'),
    zikrText: document.getElementById('zikr-text'),
    mainProgress: document.querySelector('.main-progress'),
    dailyProgress: document.getElementById('daily-progress'),
    totalProgress: document.getElementById('total-progress'),
    level: document.getElementById('level')
};

// Основные функции
function updateUI() {
    // Счетчики
    elements.count.textContent = state.count;
    elements.daily.textContent = state.daily;
    elements.total.textContent = state.total;
    elements.yesterday.textContent = state.yesterday;
    
    // Прогресс-бары
    elements.mainProgress.style.width = `${(state.count / 33) * 100}%`;
    elements.dailyProgress.style.width = `${Math.min((state.daily / 900) * 100, 100)}%`;
    elements.totalProgress.style.width = `${Math.min((state.total / 50000) * 100, 100)}%`;
    
    // Уровни
    const currentLevel = SETTINGS.levels.find(l => state.total < l.required) || SETTINGS.levels[SETTINGS.levels.length - 1];
    elements.level.textContent = currentLevel.level;
    
    // Текст зикра
    elements.zikrText.textContent = SETTINGS.zikrList[state.currentZikr];
    elements.zikrText.classList.toggle('hidden', !state.textVisible);
}

function saveData() {
    localStorage.setItem('tasbihData', JSON.stringify(state));
    if(tg?.sendData) tg.sendData(JSON.stringify(state));
}

// Обработчики событий
function handleClick() {
    if(state.count >= 33) {
        state.count = 0;
        state.currentZikr = (state.currentZikr + 1) % SETTINGS.zikrList.length;
    }
    
    state.count++;
    state.total++;
    state.daily++;
    
    updateUI();
    saveData();
}

document.addEventListener('click', (e) => {
    if(e.target.closest('#reset')) {
        state.count = 0;
        updateUI();
        saveData();
        return;
    }
    
    if(!e.target.closest('.menu-btn') && !e.target.closest('.sidebar')) {
        handleClick();
    }
});

// Меню
function toggleMenu() {
    elements.menu.classList.toggle('active');
}

function toggleZikrText() {
    state.textVisible = !state.textVisible;
    updateUI();
    toggleMenu();
}

function resetTotalCount() {
    if(confirm("Вы уверены что хотите сбросить весь прогресс?")) {
        localStorage.removeItem('tasbihData');
        state = {
            count: 0,
            total: 0,
            daily: 0,
            yesterday: 0,
            currentZikr: 0,
            level: 1,
            textVisible: true
        };
        updateUI();
        toggleMenu();
    }
}

// Инициализация
updateUI();