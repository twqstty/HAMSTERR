const gameButton = document.getElementById('gameButton');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const doublePointsBtn = document.getElementById('doublePoints');
const autoTapBtn = document.getElementById('autoTap');
const shopBtn = document.getElementById('shopBtn');
const acquisitionsBtn = document.getElementById('acquisitionsBtn');
const shopModal = document.getElementById('shopModal');
const acquisitionsModal = document.getElementById('acquisitionsModal');
const shopItemsContainer = document.getElementById('shopItems');
const acquiredItemsContainer = document.getElementById('acquiredItems');

const megaDoubleBtn = document.createElement('button');
megaDoubleBtn.textContent = 'Мега-удвоение (300 очков)';
megaDoubleBtn.classList.add('booster');
megaDoubleBtn.style.position = 'absolute';
megaDoubleBtn.style.bottom = '160px';
megaDoubleBtn.style.left = '10px';
document.body.appendChild(megaDoubleBtn);

const superDoubleBtn = document.createElement('button');
superDoubleBtn.textContent = 'Супер-удвоение (150 очков)';
superDoubleBtn.classList.add('booster');
superDoubleBtn.style.position = 'absolute';
superDoubleBtn.style.bottom = '110px';
superDoubleBtn.style.left = '10px';
document.body.appendChild(superDoubleBtn);

const levelBarContainer = document.createElement('div');
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

const shopItems = [
    { id: 1, name: 'Алекс', price: 100, desc: 'АЙ ТИГР', img: 'https://steamuserimages-a.akamaihd.net/ugc/2048623604695933913/75EE024B6CC87758CCBEC3B341F98F4E004445B2/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true' },
    { id: 2, name: 'Аркана на сфа', price: 200, desc: 'Для самых крутых', img: 'https://steamuserimages-a.akamaihd.net/ugc/1281786444814080166/11BCEB033140EBF7E25C389C0FA6BB336DF51B1B/?imw=512&imh=504&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true' },
    { id: 3, name: 'Айфон 16', price: 500, desc: 'Новый телефон Apple', img: 'https://avatars.mds.yandex.net/get-mpic/1565610/2a000001920ad82cceddd667a8815e983dfd/optimize' },
    { id: 4, name: 'Sange and Kaya', price: 1000, desc: 'это имба', img: 'https://esports.ru/wp-content/uploads/2023/01/kaya-and-sange-1.jpg' },
    { id: 5, name: 'Тинкер', price: 2000, desc: 'Имба в 7.32', img: 'https://avatars.mds.yandex.net/i?id=c0cd2bd52b0c1406337198ff95ed5cc2_l-4576161-images-thumbs&n=13' },
    { id: 6, name: 'Конь', price: 5000, desc: 'Быстрый конь', img: 'https://m.media-amazon.com/images/I/71nlCb57qvL._AC_UL800_QL65_.png' },
    { id: 7, name: 'МЕГАНАЙТ', price: 10000, desc: 'Любой мужчина это купит', img: 'https://static.wikia.nocookie.net/0c0afc6c-b783-45eb-8a2b-38ebefcb87de/scale-to-width/755' },
    { id: 8, name: 'Майкл', price: 15000, desc: 'Легенда', img: 'https://img5tv.cdnvideo.ru/webp/shared/files/202108/1_1375113.jpg' },
    { id: 9, name: 'Урус', price: 20000, desc: 'Норм машина,конечно, но четырка лучше', img: 'https://a.d-cd.net/22fb6ds-1920.jpg' },
    { id: 10, name: 'Военный Билет', price: 50000, desc: 'Купите пж', img: 'https://cachizer2.2gis.com/reviews-photos/082ec442-d025-41dc-b9d4-e8448fdf8161.jpg?w=640' },
];

function updateUI() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    doublePointsBtn.disabled = score < 50 || multiplier >= 2;
    superDoubleBtn.disabled = score < 150 || multiplier >= 4;
    megaDoubleBtn.disabled = score < 300 || multiplier >= 8;
    autoTapBtn.disabled = score < 100 || autoTapActive;

    if (multiplier >= 2) doublePointsBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 4) superDoubleBtn.style.backgroundColor = '#007BFF';
    if (multiplier >= 8) megaDoubleBtn.style.backgroundColor = '#007BFF';

    let progress = (score % 100) / 100 * 100;
    levelBar.style.width = `${progress}%`;
}

function handleTap() {
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
            <p>Цена: ${item.price} очков</p>
            <button ${score < item.price || acquiredItems.includes(item.id) ? 'disabled' : ''}>
                ${acquiredItems.includes(item.id) ? 'Куплено' : 'Купить'}
            </button>
        `;
        const buyBtn = card.querySelector('button');
        buyBtn.addEventListener('click', () => {
            if (score >= item.price && !acquiredItems.includes(item.id)) {
                score -= item.price;
                acquiredItems.push(item.id);
                updateUI();
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

shopBtn.addEventListener('click', () => {
    shopModal.style.display = 'block';
    renderShop();
});

acquisitionsBtn.addEventListener('click', () => {
    acquisitionsModal.style.display = 'block';
    renderAcquisitions();
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        shopModal.style.display = 'none';
        acquisitionsModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === shopModal) shopModal.style.display = 'none';
    if (event.target === acquisitionsModal) acquisitionsModal.style.display = 'none';
});

gameButton.addEventListener('click', handleTap);
updateUI();


