// Обновлённый список зикров с переводами
const SETTINGS = {
  zikrList: [
    { ru: "Субханаллах", en: "Subhanallah", ar: "سبحان الله" },
    { ru: "Алхамдулиллах", en: "Alhamdulillah", ar: "الحمد لله" },
    { ru: "Аллоhу Акбар", en: "Allahu Akbar", ar: "الله أكبر" },
    { ru: "Ла илАhа иллалЛоh", en: "La ilaha illallah", ar: "لا إله إلا الله" },
    { ru: "АстагфирулЛoh", en: "Astaghfirullah", ar: "أستغفر الله" },
    { ru: "СубhаналЛоhи ва баhамдиhиhи", en: "Subhanallahi wa bihamdihi", ar: "سبحان الله وبحمده" },
    { ru: "Ла илаha илла-лЛоhу ваhдаhу ла шарика лаh. Лаhул мулку ва лаhу-л haмда ва hува ъала кулли шайин Qадир",
      en: "La ilaha illallah, wahdahu la sharika lahu, lahu al-mulku wa lahu al-hamd, wa huwa 'ala kulli shay'in qadeer",
      ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير" }
  ],
  levels: [
    { required: 3500, level: 1 },
    { required: 7000, level: 2 },
    { required: 14000, level: 3 },
    { required: 30000, level: 4 },
    { required: 50000, level: 5 }
  ]
};

const translations = {
  ru: {
    title: "Награда Тасбиха",
    menuHome: "📱 Главная",
    menuReward: "🎁 Награды", 
    menuHelp: "🆘 Помощь", 
    menuResetCount: "🔄",
    menuToggleTextVisible: "👁️‍🗨️",
    menuToggleTextHidden: "🙈",
    menuChangeLang: "RU",
    statDaily: "📅 Сегодня (Ежедневный цель 🎯 900)",
    statYesterday: "🗓️ Вчерашний счет",
    statTotal: "📿 Всего (Ежемесячный цель 🎯50K)",
    statLastActive: "⏱ Последняя активность",
    statFirstVisit: "📅 Первый вход",
    statNews: "Здесь будут отображаться хадисы Пророка (с.а.в.)",
    levelText: "Уровень {level} из 5",
    dailyCounterLabel: "Сегодня: ",
    alertResetSuccess: "Общий счет сброшен!",
    alertResetFailure: "Для сброса нужно более 100000 зикров!"
  },
  en: {
    title: "Tasbih Reward",
    menuHome: "📱 Home",
    menuReward: "🎁 Rewards", 
    menuHelp: "🆘 Help",  
    menuResetCount: "🔄",
    menuToggleTextVisible: "👁️ Hide text",
    menuToggleTextHidden: "🙈 Show text",
    menuChangeLang: "EN",
    statDaily: "📅 Today (Daily goal 🎯 900)",
    statYesterday: "🗓️ Yesterday's count",
    statTotal: "📿 Total (Monthly goal 🎯50K)",
    statLastActive: "⏱ Last activity",
    statFirstVisit: "📅 First visit",
    statNews: "Hadiths of the Prophet (PBUH) will be displayed here",
    levelText: "Level {level} of 5",
    dailyCounterLabel: "Today: ",
    alertResetSuccess: "Total count reset!",
    alertResetFailure: "Need more than 100000 zikr to reset!"
  },
  ar: {
    title: "جائزة التسبيح",
    menuHome: "الرئيسية",
    menuReward: "🎁 الجوائز", 
    menuHelp: "🆘 تعليمات" ,  
    menuResetCount: "🔄",
    menuToggleTextVisible: "👁️ إخفاء النص",
    menuToggleTextHidden: "🙈 إظهار النص",
    menuChangeLang: "AR",
    statDaily: "📅 اليوم (الهدف اليومي 🎯 900)",
    statYesterday: "🗓️ عدد الأذكار البارحة",
    statTotal: "📿 الإجمالي (الهدف الشهري 🎯50K)",
    statLastActive: "⏱ آخر نشاط",
    statFirstVisit: "📅 أول دخول",
    statNews: "سيتم عرض أحاديث النبي (صلى الله عليه وسلم) هنا",
    levelText: "المستوى {level} من 5",
    dailyCounterLabel: "اليوم: ",
    alertResetSuccess: "تم إعادة تعيين العدد الإجمالي!",
    alertResetFailure: "يجب أن يكون العدد الإجمالي أكثر من 100000 للتمكن من إعادة التعيين!"
  }
};

// Загружаем данные или создаём начальные
let appData = JSON.parse(localStorage.getItem('tasbihData')) || {
  count: 0,
  totalCount: 0,
  currentZikrIndex: 0,
  firstVisitDate: new Date().toISOString(),
  dailyCount: 0,
  yesterdayCount: 0,
  lastVisitDate: new Date().toLocaleDateString(),
  lastActive: null,
  isZikrTextVisible: true,
  lang: "ru"
};

const tg = window.Telegram.WebApp;

let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 10;
const ACTION_INTERVAL = 300;
let lastActionTime = 0;

tg.ready();
tg.onEvent('auth', setUserName);
tg.expand();
updateStats();
updateDisplays();
updateLanguage();

function setUserName() {
    if (tg.initDataUnsafe?.user?.first_name) {
        document.getElementById('user-name').textContent = `Привет, ${tg.initDataUnsafe.user.first_name}!`;
    } else {
        document.getElementById('user-name').textContent = "Привет, гость!";
    }
}

// Устанавливаем имя после загрузки Telegram WebApp
tg.ready();
setUserName();
tg.onEvent('auth', setUserName);

// Функция показа/скрытия бокового меню
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
  if (sidebar.classList.contains('active')) updateStats();
}

// Переключение видимости зикра: скрываем не только текст, но и весь блок с эмодзи (кнопка клика)
function toggleZikrText() {
  appData.isZikrTextVisible = !appData.isZikrTextVisible;
  // Скрываем/показываем блок с зикром целиком
  document.getElementById('zikr-container').classList.toggle('hidden', !appData.isZikrTextVisible);
  updateToggleTextBtn();
  toggleMenu();
  saveData();
}

function updateToggleTextBtn() {
  const lang = appData.lang;
  const btn = document.getElementById('toggle-text-btn');
  if (btn) {
    btn.textContent = appData.isZikrTextVisible
      ? translations[lang].menuToggleTextVisible
      : translations[lang].menuToggleTextHidden;
  }
}

// Сброс общего счёта с отображением переведённого сообщения
function resetTotalCount() {
  const lang = appData.lang;
  if (appData.totalCount > 100000) {
    appData.totalCount = 0;
    updateDisplays();
    saveData();
    alert(translations[lang].alertResetSuccess);
  } else {
    alert(translations[lang].alertResetFailure);
  }
  toggleMenu();
}

// Обновление статистики
function updateStats() {
  const dailyProgress = (appData.dailyCount / 900) * 100;
  document.getElementById('daily-progress').style.width = `${Math.min(dailyProgress, 100)}%`;
  document.getElementById('stat-daily').textContent = appData.dailyCount;

  document.getElementById('stat-yesterday').textContent = appData.yesterdayCount;
  document.getElementById('yesterday-progress').style.width = `${Math.min((appData.yesterdayCount / 900) * 100, 100)}%`;

  document.getElementById('stat-total').textContent = appData.totalCount;
  document.getElementById('total-progress').style.width = `${Math.min((appData.totalCount / 50000) * 100, 100)}%`;

  document.getElementById('stat-first-date').textContent =
    new Date(appData.firstVisitDate).toLocaleDateString(appData.lang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  document.getElementById('stat-last-active').textContent =
    new Date().toLocaleDateString(appData.lang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
}

// Сохранение данных
function saveData() {
  appData.lastActive = new Date().toISOString();
  localStorage.setItem('tasbihData', JSON.stringify(appData));
  updateStats();
}

// Обновление отображения счетчиков и зикра с переводом
function updateDisplays() {
  const today = new Date().toLocaleDateString();
  if (appData.lastVisitDate !== today) {
    appData.yesterdayCount = appData.dailyCount;
    appData.dailyCount = 0;
    appData.lastVisitDate = today;
  }

  document.getElementById('count').textContent = appData.count;
  document.getElementById('today-count').textContent = appData.dailyCount;
  // Выбираем перевод для текущего зикра
  document.getElementById('zikr-text').textContent =
    SETTINGS.zikrList[appData.currentZikrIndex][appData.lang];

  document.querySelector('.main-progress').style.width = `${(appData.count / 33) * 100}%`;

  const levelProgress = calculateLevelProgress();
  document.querySelector('.level-progress').style.width = `${levelProgress}%`;
}

// Расчёт прогресса уровня
function calculateLevelProgress() {
  const currentLevel = SETTINGS.levels.find(l => appData.totalCount < l.required) || { level: 5 };
  document.getElementById('level').textContent = currentLevel.level;
  const prevLevel = SETTINGS.levels[currentLevel.level - 2] || { required: 0 };
  return ((appData.totalCount - prevLevel.required) / (currentLevel.required - prevLevel.required)) * 100 || 100;
}

// Обработчик кликов (учёт интервала между действиями)
function handleClick() {
  const now = Date.now();
  if (now - lastActionTime < ACTION_INTERVAL) return;
  lastActionTime = now;

  if (document.getElementById('sidebar').classList.contains('active')) {
    toggleMenu();
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

// Обработчики свайпов
function handleSwipe(e) {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
    handleClick();
  }
}

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

// Обработчик кнопки сброса (старый, оставляем для дополнительного сброса)
document.getElementById('reset').addEventListener('click', () => {
  if (appData.totalCount > 100) {
    appData.totalCount--;
  }
  appData.count = 0;
  appData.currentZikrIndex = 0;
  updateDisplays();
  saveData();
});

// Добавляем глобальные обработчики кликов и свайпов
document.addEventListener('click', (e) => {
  if (!e.target.closest('#reset') && !e.target.closest('.menu-btn')) {
    handleClick();
  }
});
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleSwipe);

// Переключение языка
function toggleLanguage() {
  const langs = ["ru", "en", "ar"];
  let currentIndex = langs.indexOf(appData.lang);
  currentIndex = (currentIndex + 1) % langs.length;
  appData.lang = langs[currentIndex];
  saveData();
  updateLanguage();
}

// Обновление всех текстов согласно выбранному языку
function updateLanguage() {
  const lang = appData.lang;
  document.title = translations[lang].title;
  document.getElementById('menu-home').textContent = translations[lang].menuHome;
  
  // Обновляем кнопки ряда
  document.getElementById('reset-btn').textContent = translations[lang].menuResetCount;
  updateToggleTextBtn();
  document.getElementById('lang-toggle-btn').textContent = translations[lang].menuChangeLang;
  
  document.getElementById('daily-label').textContent = translations[lang].statDaily;
  document.getElementById('yesterday-label').textContent = translations[lang].statYesterday;
  document.getElementById('total-label').textContent = translations[lang].statTotal;
  document.getElementById('last-active-label').textContent = translations[lang].statLastActive;
  document.getElementById('first-date-label').textContent = translations[lang].statFirstVisit;
  document.getElementById('news-text').textContent = translations[lang].statNews;
  
  const totalCounter = document.querySelector('.total-counter');
  totalCounter.innerHTML = translations[lang].dailyCounterLabel + '<span id="today-count">' + appData.dailyCount + '</span>';

  // Обновляем текст уровня
  const levelElem = document.getElementById('level').textContent;
  document.getElementById('level-text').innerHTML = translations[lang].levelText.replace("{level}", '<span id="level">' + levelElem + '</span>');
}

function init() {
  const today = new Date().toLocaleDateString();
  if (appData.lastVisitDate !== today) {
    appData.yesterdayCount = appData.dailyCount;
    appData.dailyCount = 0;
    appData.lastVisitDate = today;
    saveData();
  }
}

init();