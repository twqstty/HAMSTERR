let resetFlag = false; // Глобальный флаг сброса

function saveGameState() {
    const gameState = {
        score: resetFlag ? 0 : score, // Сбрасываем, если флаг активен
        level: resetFlag ? 1 : level,
        multiplier, autoTapActive, acquiredItems,
        acquiredThemes, currentTheme, acquiredButtonImages, currentButtonImage,
        clicks: resetFlag ? 0 : clicks,
        achieved: resetFlag ? [] : achieved,
        playerName
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    sendScoreToBot();
}

function sendScoreToBot() {
    const data = { playerName, score, clicks, level, reset: resetFlag };
    window.Telegram.WebApp.sendData(JSON.stringify(data));
}

// Добавим обработку ответа от бота
window.Telegram.WebApp.onEvent('web_app_data', (event) => {
    if (event.data && event.data.reset) {
        resetFlag = true; // Получаем сигнал сброса
        localStorage.clear(); // Очищаем localStorage
        score = 0;
        clicks = 0;
        level = 1;
        achieved = [];
        updateUI();
        alert('Статистика сброшена админом!');
    }
});
const gameButton = document.getElementById('gameButton');
const buttonImage = document.getElementById('buttonImage');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const clicksDisplay = document.getElementById('clicks');
const doublePointsBtn = document.getElementById('doublePoints');
const superDoubleBtn = document.getElementById('superDouble');
const megaDoubleBtn = document.getElementById('megaDouble');
const autoTapBtn = document.getElementById('autoTap');
const superMegaBoostBtn = document.getElementById('superMegaBoost');
const hyperBoostBtn = document.getElementById('hyperBoost');
const ultraBoostBtn = document.getElementById('ultraBoost');
const ultra2BoostBtn = document.getElementById('ultra2Boost');
const shopBtn = document.getElementById('shopBtn');
const acquisitionsBtn = document.getElementById('acquisitionsBtn');
const boostersBtn = document.getElementById('boostersBtn');
const themesBtn = document.getElementById('themesBtn');
const buttonImagesBtn = document.getElementById('buttonImagesBtn');
const achievementsBtn = document.getElementById('achievementsBtn');
const statsBtn = document.getElementById('statsBtn');
const shopModal = document.getElementById('shopModal');
const acquisitionsModal = document.getElementById('acquisitionsModal');
const boostersModal = document.getElementById('boostersModal');
const themesModal = document.getElementById('themesModal');
const buttonImagesModal = document.getElementById('buttonImagesModal');
const achievementsModal = document.getElementById('achievementsModal');
const statsModal = document.getElementById('statsModal');
const shopItemsContainer = document.getElementById('shopItems');
const acquiredItemsContainer = document.getElementById('acquiredItems');
const themesContainer = document.getElementById('themesContainer');
const buttonImagesContainer = document.getElementById('buttonImagesContainer');
const achievementsContainer = document.getElementById('achievementsContainer');
const statsContainer = document.getElementById('statsContainer');

const levelBarContainer = document.createElement('div');
levelBarContainer.id = 'levelBarContainer';
levelBarContainer.style.position = 'absolute';
levelBarContainer.style.top = '10px';
levelBarContainer.style.left = '50%';
levelBarContainer.style.transform = 'translateX(-50%)';
levelBarContainer.style.width = '80%';
levelBarContainer.style.height = '20px';
levelBarContainer.style.background = '#ddd';
levelBarContainer.style.borderRadius = '10px';
document.body.appendChild(levelBarContainer);

const levelBar = document.createElement('div');
levelBar.id = 'levelBar';
levelBar.style.height = '100%';
levelBar.style.width = '0%';
levelBar.style.background = '#4CAF50';
levelBar.style.borderRadius = '10px';
levelBarContainer.appendChild(levelBar);

let score = 0;
let level = 1;
let multiplier = 1;
let autoTapActive = false;
let acquiredItems = [];
let acquiredThemes = ['default'];
let currentTheme = 'default';
let acquiredButtonImages = ['default'];
let currentButtonImage = 'default';
let clicks = 0;
let achieved = [];
let playerName = '';

// Telegram Web App интеграция
window.Telegram.WebApp.ready();
const user = window.Telegram.WebApp.initDataUnsafe.user;
const adminId = '857785777'; // Замени на свой Telegram ID (узнай через @userinfobot)

// Запрос ника
if (user && user.username) {
    playerName = user.username; // Берём ник из Telegram
} else if (user) {
    playerName = user.first_name; // Или имя, если нет ника
} else {
    playerName = prompt('Введи свой ник, братан:') || 'Аноним'; // Ручной ввод, если не в Telegram
}

const achievements = [
    { id: 'clicks100', name: '100 кликов', condition: () => clicks >= 100, reward: 50 },
    { id: 'level5', name: '5 уровней', condition: () => level >= 5, reward: 100 },
    { id: 'score1000', name: '1000 очков', condition: () => score >= 1000, reward: 200 },
    { id: 'buy3items', name: '3 покупки', condition: () => acquiredItems.length >= 3, reward: 150 },
    { id: 'legend', name: 'Легенда', condition: () => acquiredItems.includes(11), reward: 5000 } // Новое достижение за "Михаил Эйдус" (id: 11)
];

const shopItems = [
    { id: 1, name: 'Алекс', price: 100, desc: 'АЙ ТИГР', img: 'https://steamuserimages-a.akamaihd.net/ugc/2048623604695933913/75EE024B6CC87758CCBEC3B341F98F4E004445B2/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true' },
    { id: 2, name: 'Аркана на сфа', price: 200, desc: 'Для самых крутых', img: 'https://steamuserimages-a.akamaihd.net/ugc/1281786444814080166/11BCEB033140EBF7E25C389C0FA6BB336DF51B1B/?imw=512&imh=504&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true' },
    { id: 3, name: 'Айфон 16', price: 500, desc: 'Новый телефон Apple', img: 'https://avatars.mds.yandex.net/get-mpic/1565610/2a000001920ad82cceddd667a8815e983dfd/optimize' },
    { id: 4, name: 'Sange and Kaya', price: 1000, desc: 'это имба', img: 'https://esports.ru/wp-content/uploads/2023/01/kaya-and-sange-1.jpg' },
    { id: 5, name: 'Тинкер', price: 2000, desc: 'Имба в 7.32', img: 'https://avatars.mds.yandex.net/i?id=c0cd2bd52b0c1406337198ff95ed5cc2_l-4576161-images-thumbs&n=13' },
    { id: 6, name: 'Конь', price: 5000, desc: 'Быстрый конь', img: 'https://m.media-amazon.com/images/I/71nlCb57qvL._AC_UL800_QL65_.png' },
    { id: 7, name: 'МЕГАНАЙТ', price: 10000, desc: 'Любой мужчина это купит', img: 'https://static.wikia.nocookie.net/0c0afc6c-b783-45eb-8a2b-38ebefcb87de/scale-to-width/755' },
    { id: 8, name: 'Майкл', price: 15000, desc: 'Легенда', img: 'https://img5tv.cdnvideo.ru/webp/shared/files/202108/1_1375113.jpg' },
    { id: 9, name: 'Урус', price: 20000, desc: 'Норм машина, конечно, но четырка лучше', img: 'https://a.d-cd.net/22fb6ds-1920.jpg' },
    { id: 10, name: 'Военный Билет', price: 50000, desc: 'Купите пж', img: 'https://cachizer2.2gis.com/reviews-photos/082ec442-d025-41dc-b9d4-e8448fdf8161.jpg?w=640' },
    { id: 11, name: 'Михаил Эйдус', price: 1000000, desc: 'МИХАИЛ МАТЬ ЕГО ЭЙДУС', img: 'https://i.ibb.co/3yGvsBtG/a685128f-bece-4692-8be6-3fd4d9bb38a8.jpg' }
];

const themes = [
    { id: 'default', name: 'Стандартный', price: 0, img: 'https://steamuserimages-a.akamaihd.net/ugc/2047498313982249616/B2692BD036F1035574205930942363FC77B071EC/?imw=512&imh=288&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true', bg: '#f0f0f0', textColor: '#333' },
    { id: 'forest', name: 'Лес', price: 5, img: 'https://img.freepik.com/free-vector/cartoon-forest-landscape-endless-nature-background-computer-games-nature-tree-outdoor-plant-green-natural-environment-wood_1284-41524.jpg', bg: 'url(https://img.freepik.com/free-vector/cartoon-forest-landscape-endless-nature-background-computer-games-nature-tree-outdoor-plant-green-natural-environment-wood_1284-41524.jpg)', textColor: '#fff' },
    { id: 'space', name: 'Космос', price: 10, img: 'https://cdn.steamstatic.com/steamcommunity/public/images/items/504400/ac6891f4a16e9dfbdfef65dc5672b01cc1abf271.jpg', bg: 'url(https://cdn.steamstatic.com/steamcommunity/public/images/items/504400/ac6891f4a16e9dfbdfef65dc5672b01cc1abf271.jpg)', textColor: '#fff' },
    { id: 'ocean', name: 'Океан', price: 20, img: 'https://wallpapers.com/images/hd/dark-ocean-1920-x-1080-wallpaper-erhi5bstqli1l23f.jpg', bg: 'url(https://wallpapers.com/images/hd/dark-ocean-1920-x-1080-wallpaper-erhi5bstqli1l23f.jpg)', textColor: '#fff' },
    { id: 'desert', name: 'Пустыня', price: 30, img: 'https://i.pinimg.com/originals/0e/c0/65/0ec0653f9cb1323e15d8ecd4a96807b6.jpg', bg: 'url(https://i.pinimg.com/originals/0e/c0/65/0ec0653f9cb1323e15d8ecd4a96807b6.jpg)', textColor: '#000' }
];

const buttonImages = [
    { id: 'default', name: 'Хомяк', price: 0, img: 'https://46tv.ru/uploads/posts/2024-07/1721374745_hamster-kombat.png' },
    { id: 'cat', name: 'Спанч-Боб', price: 1000, img: 'https://i.pinimg.com/736x/cd/e2/33/cde2338d374f3f1fd1cfc21242d39fd4.jpg' },
    { id: 'dog', name: '9mice', price: 1000, img: 'https://i.pinimg.com/736x/8f/d4/44/8fd444028b0c544214f594c14b03751a.jpg' },
    { id: 'bird', name: 'Kai Angel', price: 1000, img: 'https://i.pinimg.com/736x/5b/28/47/5b28472756d6cd031e6a1c668b10bec3.jpg' },
    { id: 'walter', name: 'Heisenberg', price: 1000, img: 'https://playprint.ru/images/catalog/categories/category-series-preview.jpg' },
    { id: 'pinkman', name: 'Jesse Pinkman', price: 1000, img: 'https://www.kino-teatr.ru/news/4804/52524.jpg' },
];

function saveGameState() {
    const gameState = {
        score, level, multiplier, autoTapActive, acquiredItems,
        acquiredThemes, currentTheme, acquiredButtonImages, currentButtonImage,
        clicks, achieved, playerName
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    sendScoreToBot();
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        score = gameState.score || 0;
        level = gameState.level || 1;
        multiplier = gameState.multiplier || 1;
        autoTapActive = gameState.autoTapActive || false;
        acquiredItems = gameState.acquiredItems || [];
        acquiredThemes = gameState.acquiredThemes || ['default'];
        currentTheme = gameState.currentTheme || 'default';
        acquiredButtonImages = gameState.acquiredButtonImages || ['default'];
        currentButtonImage = gameState.currentButtonImage || 'default';
        clicks = gameState.clicks || 0;
        achieved = gameState.achieved || [];
        playerName = gameState.playerName || playerName;
    }
}

function sendScoreToBot() {
    const data = { playerName, score, clicks, level };
    window.Telegram.WebApp.sendData(JSON.stringify(data));
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achieved.includes(achievement.id) && achievement.condition()) {
            achieved.push(achievement.id);
            score += achievement.reward;
            alert(`Достижение: ${achievement.name}! Бонус: +${achievement.reward} очков`);
            saveGameState();
            updateUI();
        }
    });
}

function renderAchievements() {
    achievementsContainer.innerHTML = '';
    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.classList.add('item-card');
        div.innerHTML = `
            <h3>${achievement.name}</h3>
            <p>Награда: ${achievement.reward} очков</p>
            <p>Статус: ${achieved.includes(achievement.id) ? 'Выполнено' : 'В процессе'}</p>
        `;
        achievementsContainer.appendChild(div);
    });
}

function renderStats() {
    statsContainer.innerHTML = '';
    const stats = [
        `Всего кликов: ${clicks}`,
        `Текущий уровень: ${level}`,
        `Всего очков: ${score}`,
        `Куплено предметов: ${acquiredItems.length}`,
        `Куплено тем: ${acquiredThemes.length - 1}`,
        `Куплено изображений кнопки: ${acquiredButtonImages.length - 1}`,
        `Выполнено достижений: ${achieved.length}`
    ];
    stats.forEach(stat => {
        const div = document.createElement('div');
        div.classList.add('item-card');
        div.innerHTML = `<p>${stat}</p>`;
        statsContainer.appendChild(div);
    });
}

function updateUI() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    clicksDisplay.textContent = clicks;
    doublePointsBtn.disabled = score < 50 || multiplier >= 2;
    superDoubleBtn.disabled = score < 150 || multiplier >= 4;
    megaDoubleBtn.disabled = score < 300 || multiplier >= 8;
    autoTapBtn.disabled = score < 100 || autoTapActive;
    superMegaBoostBtn.disabled = score < 1000 || multiplier >= 16;
    hyperBoostBtn.disabled = score < 5000 || multiplier >= 32;
    ultraBoostBtn.disabled = score < 10000 || multiplier >= 64;
    ultra2BoostBtn.disabled = score < 20000 || multiplier >= 128;

    if (multiplier >= 2) doublePointsBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 4) superDoubleBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 8) megaDoubleBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 16) superMegaBoostBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 32) hyperBoostBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 64) ultraBoostBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 128) ultra2BoostBtn.style.backgroundColor = '#007BFF';

    let progress = (score % 100) / 100 * 100;
    levelBar.style.width = `${progress}%`;

    saveGameState();
    checkAchievements();
}

function applyTheme(themeId) {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
        currentTheme = theme.id;
        document.body.style.background = theme.bg;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.getElementById('ui').style.color = theme.textColor;
    }
}

function applyButtonImage(imageId) {
    const image = buttonImages.find(b => b.id === imageId);
    if (image) {
        currentButtonImage = image.id;
        buttonImage.src = image.img;
    }
}

function handleTap() {
    clicks++;
    score += 1 * multiplier;
    if (score >= level * 100) level++;
    updateUI();
}

function renderShop() {
    shopItemsContainer.innerHTML = '';
    shopItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <p>Цена: ${item.price.toLocaleString()} очков</p>
            <button ${score < item.price || acquiredItems.includes(item.id) ? 'disabled' : ''}>
                ${acquiredItems.includes(item.id) ? 'Куплено' : 'Купить'}
            </button>
        `;
        const buyBtn = card.querySelector('button');
        buyBtn.addEventListener('click', () => {
            if (score >= item.price && !acquiredItems.includes(item.id)) {
                score -= item.price;
                acquiredItems.push(item.id);
                updateUI(); // Проверяем достижение "Легенда" после покупки
                renderShop();
                renderAcquisitions();
            }
        });
        shopItemsContainer.appendChild(card);
    });
}

function renderAcquisitions() {
    acquiredItemsContainer.innerHTML = '';
    shopItems.filter(item => acquiredItems.includes(item.id)).forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
        `;
        acquiredItemsContainer.appendChild(card);
    });
}

function renderThemes() {
    themesContainer.innerHTML = '';
    themes.forEach(theme => {
        const card = document.createElement('div');
        card.classList.add('theme-card');
        card.innerHTML = `
            <img src="${theme.img}" alt="${theme.name}">
            <h3>${theme.name}</h3>
            <p>Цена: ${theme.price.toLocaleString()} очков</p>
            <button ${score < theme.price && !acquiredThemes.includes(theme.id) ? 'disabled' : ''}>
                ${theme.id === currentTheme ? 'Выбрано' : acquiredThemes.includes(theme.id) ? 'Выбрать' : 'Купить'}
            </button>
        `;
        const actionBtn = card.querySelector('button');
        actionBtn.addEventListener('click', () => {
            if (!acquiredThemes.includes(theme.id) && score >= theme.price) {
                score -= theme.price;
                acquiredThemes.push(theme.id);
                applyTheme(theme.id);
            } else if (acquiredThemes.includes(theme.id) && theme.id !== currentTheme) {
                applyTheme(theme.id);
            }
            updateUI();
            renderThemes();
        });
        themesContainer.appendChild(card);
    });
}

function renderButtonImages() {
    buttonImagesContainer.innerHTML = '';
    buttonImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('theme-card');
        card.innerHTML = `
            <img src="${image.img}" alt="${image.name}">
            <h3>${image.name}</h3>
            <p>Цена: ${image.price.toLocaleString()} очков</p>
            <button ${score < image.price && !acquiredButtonImages.includes(image.id) ? 'disabled' : ''}>
                ${image.id === currentButtonImage ? 'Выбрано' : acquiredButtonImages.includes(image.id) ? 'Выбрать' : 'Купить'}
            </button>
        `;
        const actionBtn = card.querySelector('button');
        actionBtn.addEventListener('click', () => {
            if (!acquiredButtonImages.includes(image.id) && score >= image.price) {
                score -= image.price;
                acquiredButtonImages.push(image.id);
                applyButtonImage(image.id);
            } else if (acquiredButtonImages.includes(image.id) && image.id !== currentButtonImage) {
                applyButtonImage(image.id);
            }
            updateUI();
            renderButtonImages();
        });
        buttonImagesContainer.appendChild(card);
    });
}

// Обработчики для кнопок усилений
doublePointsBtn.addEventListener('click', () => {
    if (score >= 50 && multiplier < 2) {
        score -= 50;
        multiplier = 2;
        updateUI();
    }
});

superDoubleBtn.addEventListener('click', () => {
    if (score >= 150 && multiplier < 4) {
        score -= 150;
        multiplier = 4;
        updateUI();
    }
});

megaDoubleBtn.addEventListener('click', () => {
    if (score >= 300 && multiplier < 8) {
        score -= 300;
        multiplier = 8;
        updateUI();
    }
});

autoTapBtn.addEventListener('click', () => {
    if (score >= 100 && !autoTapActive) {
        score -= 100;
        autoTapActive = true;
        updateUI();
        setInterval(() => {
            score += 1 * multiplier;
            if (score >= level * 100) level++;
            updateUI();
        }, 1000);
    }
});

superMegaBoostBtn.addEventListener('click', () => {
    if (score >= 1000 && multiplier < 16) {
        score -= 1000;
        multiplier = 16;
        updateUI();
    }
});

hyperBoostBtn.addEventListener('click', () => {
    if (score >= 5000 && multiplier < 32) {
        score -= 5000;
        multiplier = 32;
        updateUI();
    }
});

ultraBoostBtn.addEventListener('click', () => {
    if (score >= 10000 && multiplier < 64) {
        score -= 10000;
        multiplier = 64;
        updateUI();
    }
});

ultra2BoostBtn.addEventListener('click', () => {
    if (score >= 20000 && multiplier < 128) {
        score -= 20000;
        multiplier = 128;
        updateUI();
    }
});

// Обработчики для открытия модальных окон
shopBtn.addEventListener('click', () => {
    shopModal.style.display = 'block';
    renderShop();
});

acquisitionsBtn.addEventListener('click', () => {
    acquisitionsModal.style.display = 'block';
    renderAcquisitions();
});

boostersBtn.addEventListener('click', () => {
    boostersModal.style.display = 'block';
});

themesBtn.addEventListener('click', () => {
    themesModal.style.display = 'block';
    renderThemes();
});

buttonImagesBtn.addEventListener('click', () => {
    buttonImagesModal.style.display = 'block';
    renderButtonImages();
});

achievementsBtn.addEventListener('click', () => {
    achievementsModal.style.display = 'block';
    renderAchievements();
});

statsBtn.addEventListener('click', () => {
    statsModal.style.display = 'block';
    renderStats();
});

// Закрытие модальных окон
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        shopModal.style.display = 'none';
        acquisitionsModal.style.display = 'none';
        boostersModal.style.display = 'none';
        themesModal.style.display = 'none';
        buttonImagesModal.style.display = 'none';
        achievementsModal.style.display = 'none';
        statsModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === shopModal) shopModal.style.display = 'none';
    if (event.target === acquisitionsModal) acquisitionsModal.style.display = 'none';
    if (event.target === boostersModal) boostersModal.style.display = 'none';
    if (event.target === themesModal) themesModal.style.display = 'none';
    if (event.target === buttonImagesModal) buttonImagesModal.style.display = 'none';
    if (event.target === achievementsModal) achievementsModal.style.display = 'none';
    if (event.target === statsModal) statsModal.style.display = 'none';
});

gameButton.addEventListener('click', handleTap);

// Инициализация
loadGameState();
updateUI();
applyTheme(currentTheme);
applyButtonImage(currentButtonImage);

if (autoTapActive) {
    setInterval(() => {
        score += 1 * multiplier;
        if (score >= level * 100) level++;
        updateUI();
    }, 1000);
}