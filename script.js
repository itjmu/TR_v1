const SETTINGS = { zikrList: [ "СубhаналЛоh", "АлhамдулилЛah", "Аллоhу Акбар", "Ла илАhа иллалЛоh", "АстагфирулЛoh", "СубhаналЛоhи ва баhамдиhиhи", "Ла илаha илла-лЛоhу ваhдаhу ла шарика лаh. Лаhул мулку ва лаhу-л haмда ва hува ъала кулли шайин Qадир" ], levels: [ { required: 3500, level: 1 }, { required: 7000, level: 2 }, { required: 14000, level: 3 }, { required: 30000, level: 4 }, { required: 50000, level: 5 } ] };

let appData = JSON.parse(localStorage.getItem('tasbihData')) || { count: 0, totalCount: 0, currentZikrIndex: 0, firstVisitDate: new Date().toISOString(), dailyCount: 0, yesterdayCount: 0, lastVisitDate: new Date().toLocaleDateString(), lastActive: null, isZikrTextVisible: true };

const tg = window.Telegram.WebApp; const SWIPE_THRESHOLD = 10; const ACTION_INTERVAL = 300; let lastActionTime = 0;

tg.ready(); setTimeout(() => { tg.expand(); tg.enableClosingConfirmation(); }, 500); tg.onEvent('viewportChanged', () => tg.expand()); tg.MainButton.disable(); tg.expand(); tg.enableClosingConfirmation(); tg.expand(); updateStats(); updateDisplays();

function toggleMenu() { const sidebar = document.getElementById('sidebar'); sidebar.classList.toggle('active'); if (sidebar.classList.contains('active')) updateStats(); }

function toggleZikrText() { appData.isZikrTextVisible = !appData.isZikrTextVisible; document.getElementById('zikr-text').classList.toggle('hidden', !appData.isZikrTextVisible); toggleMenu(); saveData(); }

function resetTotalCount() { if (appData.totalCount > 100000) { appData.totalCount = 0; updateDisplays(); saveData(); alert('Общий счет сброшен!'); } else { alert('Для сброса нужно более 100000 зикров!'); } toggleMenu(); }

function updateStats() { document.getElementById('stat-daily').textContent = appData.dailyCount; document.getElementById('stat-yesterday').textContent = appData.yesterdayCount; document.getElementById('stat-total').textContent = appData.totalCount; document.getElementById('stat-first-date').textContent = new Date(appData.firstVisitDate).toLocaleDateString('ru'); document.getElementById('stat-last-active').textContent = new Date().toLocaleDateString('ru', { hour: '2-digit', minute: '2-digit' }); }

function saveData() { appData.lastActive = new Date().toISOString(); localStorage.setItem('tasbihData', JSON.stringify(appData)); updateStats(); if (tg?.sendData) { tg.sendData(JSON.stringify(appData)); } }

function updateDisplays() { const today = new Date().toLocaleDateString(); if (appData.lastVisitDate !== today) { appData.yesterdayCount = appData.dailyCount; appData.dailyCount = 0; appData.lastVisitDate = today; } document.getElementById('count').textContent = appData.count; document.getElementById('today-count').textContent = appData.dailyCount; document.getElementById('zikr-text').textContent = SETTINGS.zikrList[appData.currentZikrIndex]; document.getElementById('zikr-text').classList.toggle('hidden', !appData.isZikrTextVisible); }

function handleClick() { const now = Date.now(); if (now - lastActionTime < ACTION_INTERVAL) return; lastActionTime = now;

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

document.addEventListener('click', (e) => { if (!e.target.closest('#reset') && !e.target.closest('.menu-btn')) { handleClick(); } });

document.getElementById('reset').addEventListener('click', () => { if (appData.totalCount > 100) { appData.totalCount--; } appData.count = 0; appData.currentZikrIndex = 0; updateDisplays(); saveData(); });

function init() { const today = new Date().toLocaleDateString(); if (appData.lastVisitDate !== today) { appData.yesterdayCount = appData.dailyCount; appData.dailyCount = 0; appData.lastVisitDate = today; saveData(); } }

init(); tg.expand();

