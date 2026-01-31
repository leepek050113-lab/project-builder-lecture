document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.body.classList.add(currentTheme + '-mode');
    themeSwitcher.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    themeSwitcher.addEventListener('click', () => {
        let theme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme + '-mode');
        themeSwitcher.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    });

    const translations = {
        en: {
            title: 'Steam Game Reviews',
            searchPlaceholder: 'Search for a game...',
            genre: 'Genre',
            playtime: 'Avg. Playtime',
            // ... other translations
            baldursGate3Desc: 'An epic RPG with unparalleled freedom and storytelling, set in the rich world of Dungeons & Dragons.',
            eldenRingDesc: 'A vast, challenging open-world action RPG from FromSoftware, where you explore the Lands Between.',
            cyberpunk2077Desc: 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.',
            lethalCompanyDesc: 'A co-op horror game about scavenging abandoned industrial moons. Work with your crew to survive and meet the Company\'s profit quota.',
            helldivers2Desc: 'A fast-paced, chaotic third-person co-op shooter. Join the Helldivers to fight for freedom across a hostile galaxy.',
            palworldDesc: 'An open-world survival crafting game with creature collection. Befriend mysterious creatures known as \'Pals\' or fight back against a ruthless poaching syndicate.'
        },
        ko: {
            title: '스팀 게임 리뷰',
            searchPlaceholder: '게임을 검색하세요...',
            genre: '장르',
            playtime: '평균 플레이 시간',
            // ... other translations
            baldursGate3Desc: 'Dungeons & Dragons의 풍부한 세계를 배경으로, 비교할 수 없는 자유와 스토리텔링을 갖춘 대서사시 RPG입니다.',
            eldenRingDesc: 'FromSoftware에서 제작한 광활하고 도전적인 오픈월드 액션 RPG로, \'틈새의 땅\'을 탐험하게 됩니다.',
            cyberpunk2077Desc: '권력, 매력, 신체 개조에 집착하는 거대 도시 나이트 시티를 배경으로 한 오픈월드 액션 어드벤처 스토리입니다.',
            lethalCompanyDesc: '버려진 산업 위성에서 폐물을 수집하는 협동 공포 게임입니다. 동료와 협력하여 생존하고 회사의 이익 할당량을 맞추세요.',
            helldivers2Desc: '빠르고 혼란스러운 3인칭 협동 슈팅 게임입니다. 헬다이버가 되어 적대적인 은하계에서 자유를 위해 싸우세요.',
            palworldDesc: '생물 수집이 가능한 오픈월드 생존 제작 게임입니다. \'팰\'로 알려진 신비한 생물과 친구가 되거나, 무자비한 밀렵 신디케이트에 맞서 싸우세요.'
        }
    };

    const langKo = document.getElementById('lang-ko');
    const langEn = document.getElementById('lang-en');

    langKo.addEventListener('click', () => setLanguage('ko'));
    langEn.addEventListener('click', () => setLanguage('en'));

    function setLanguage(lang) {
        document.querySelectorAll('[data-lang-key]').forEach(elem => {
            const key = elem.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                if (elem.tagName === 'INPUT') {
                    elem.placeholder = translations[lang][key];
                } else {
                    elem.textContent = translations[lang][key];
                }
            }
        });
        localStorage.setItem('language', lang);
        renderGameReviews(lang);
    }

    const games = [
        { name: 'Baldur\'s Gate 3', descriptionKey: 'baldursGate3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', genre: 'RPG', playtime: '100+ Hours' },
        { name: 'Elden Ring', descriptionKey: 'eldenRingDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', genre: 'Action RPG', playtime: '80-120 Hours' },
        { name: 'Cyberpunk 2077', descriptionKey: 'cyberpunk2077Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', genre: 'Action RPG', playtime: '50-80 Hours' },
        { name: 'Lethal Company', descriptionKey: 'lethalCompanyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg', genre: 'Co-op Horror', playtime: '10-20 Hours' },
        { name: 'Helldivers 2', descriptionKey: 'helldivers2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg', genre: 'Co-op Shooter', playtime: '30-50 Hours' },
        { name: 'Palworld', descriptionKey: 'palworldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg', genre: 'Survival Crafting', playtime: '40-60 Hours' },
    ];

    const gameReviewsContainer = document.getElementById('gameReviews');
    const modal = document.getElementById('game-modal');
    const closeModal = document.querySelector('.close-button');

    function renderGameReviews(lang) {
        gameReviewsContainer.innerHTML = '';
        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <div class="review-card-content">
                    <h2>${game.name}</h2>
                </div>
            `;
            card.addEventListener('click', () => showGameDetails(game, lang));
            gameReviewsContainer.appendChild(card);
        });
    }

    function showGameDetails(game, lang) {
        const currentLang = localStorage.getItem('language') || 'en';
        document.getElementById('modal-game-image').src = game.image;
        document.getElementById('modal-game-title').textContent = game.name;
        document.getElementById('modal-game-description').textContent = translations[currentLang][game.descriptionKey];
        document.getElementById('modal-game-genre').textContent = `${translations[currentLang].genre}: ${game.genre}`;
        document.getElementById('modal-game-playtime').textContent = `${translations[currentLang].playtime}: ${game.playtime}`;
        modal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
});
