// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Состояние приложения
let state = {
    count: 0,
    menuOpen: false
};

// Элементы интерфейса
const elements = {
    menu: document.getElementById('sidebar'),
    counter: document.querySelector('.main-counter'),
    resetBtn: document.getElementById('reset')
};

// Функции
function toggleMenu() {
    state.menuOpen = !state.menuOpen;
    elements.menu.classList.toggle('active', state.menuOpen);
}

function updateCounter() {
    elements.counter.textContent = `${state.count}/33`;
}

// Обработчики событий
document.addEventListener('click', (e) => {
    if(e.target.closest('#reset')) {
        state.count = 0;
        updateCounter();
        return;
    }
    
    if(!e.target.closest('.menu-btn') && !e.target.closest('.sidebar')) {
        if(state.menuOpen) toggleMenu();
        state.count = (state.count + 1) % 33;
        updateCounter();
    }
});

// Первоначальная настройка
updateCounter();