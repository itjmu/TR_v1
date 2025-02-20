const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const SETTINGS = {
    zikrList: [
        "Субханаллах",
        "Альхамдулиллях",
        "Аллаху Акбар",
        "Ля иляха илляллах",
        "Астагфируллах"
    ],
    levels: [
        {required: 100, level: 1},
        {required: 500, level: 2},
        {required: 1500, level: 3},
        {required: 3000, level: 4},
        {required: 5000, level: 5}
    ]
};

let state = JSON.parse(localStorage.getItem('tasbihData')) || {
    count: 0,
    daily: 0,
    total: 0,
    currentZikr: 0,
    textVisible: true
};

// Элементы
const elements = {
    menu: document.getElementById('sidebar'),
    count: document.getElementById('count'),
    zikrText: document.getElementById('zikr-text'),
    daily: document.getElementById('stat-daily'),
    total: document.getElementById('stat-total'),
    level: document.getElementById('level'),
    dailyProgress: document.getElementById('daily-progress'),
    totalProgress: document.getElementById('total-progress')
};

// Основные функции
function updateUI() {
    elements.count.textContent = state.count;
    elements.zikrText.textContent = SETTINGS.zikrList[state.currentZikr];
    elements.zikrText.classList.toggle('hidden', !state.textVisible);
    
    elements.daily.textContent = state.daily;
    elements.total.textContent = state.total;
    
    elements.dailyProgress.style.width = `${Math.min((state.daily / 900)*100, 100)}%`;
    elements.totalProgress.style.width = `${Math.min((state.total / 50000)*100, 100)}%`;
    
    const currentLevel = SETTINGS.levels.find(l => state.total < l.required) || SETTINGS.levels.at(-1);
    elements.level.textContent = currentLevel.level;
}

function saveData() {
    localStorage.setItem('tasbihData', JSON.stringify(state));
    if(tg?.sendData) tg.sendData(JSON.stringify(state));
}

// Обработчики событий
document.addEventListener('click', (e) => {
    if(e.target.closest('#reset')) {
        state.count = 0;
        updateUI();
        saveData();
        return;
    }
    
    if(!e.target.closest('.menu-btn') && !e.target.closest('.sidebar')) {
        state.count = (state.count + 1) % 33;
        state.daily++;
        state.total++;
        
        if(state.count === 0) {
            state.currentZikr = (state.currentZikr + 1) % SETTINGS.zikrList.length;
        }
        
        updateUI();
        saveData();
    }
});

let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(deltaX) > 50) handleClick();
});

// Меню
function toggleMenu() {
    elements.menu.classList.toggle('active');
}

function toggleText() {
    state.textVisible = !state.textVisible;
    updateUI();
    saveData();
    toggleMenu();
}

function resetProgress() {
    if(confirm("Сбросить весь прогресс?")) {
        localStorage.clear();
        state = {
            count: 0,
            daily: 0,
            total: 0,
            currentZikr: 0,
            textVisible: true
        };
        updateUI();
        toggleMenu();
    }
}

// Инициализация
updateUI();