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
            stardewValleyReview: 'A relaxing farming simulation game.',
            hadesReview: 'An action-packed roguelike with a great story.',
            celesteReview: 'A challenging platformer with a touching narrative.',
            baldursGate3Review: 'An epic RPG with unparalleled freedom and storytelling.',
            eldenRingReview: 'A vast, challenging open-world action RPG from FromSoftware.',
            cyberpunk2077Review: 'An open-world, action-adventure story set in Night City.',
            lethalCompanyReview: 'A co-op horror game about scavenging abandoned moons.',
            helldivers2Review: 'A fast-paced, chaotic third-person co-op shooter.',
            palworldReview: 'An open-world survival crafting game with creature collection.'
        },
        ko: {
            title: '스팀 게임 리뷰',
            searchPlaceholder: '게임을 검색하세요...',
            stardewValleyReview: '편안한 농장 시뮬레이션 게임입니다.',
            hadesReview: '훌륭한 스토리를 가진 액션 로그라이크 게임입니다.',
            celesteReview: '감동적인 서사를 가진 도전적인 플랫포머 게임입니다.',
            baldursGate3Review: '비교할 수 없는 자유도와 스토리텔링을 갖춘 대서사시 RPG.',
            eldenRingReview: 'FromSoftware에서 제작한 광활하고 도전적인 오픈월드 액션 RPG.',
            cyberpunk2077Review: '나이트 시티를 배경으로 한 오픈월드 액션 어드벤처 스토리.',
            lethalCompanyReview: '버려진 달에서 폐물을 수집하는 협동 공포 게임.',
            helldivers2Review: '빠르고 혼란스러운 3인칭 협동 슈팅 게임.',
            palworldReview: '생물 수집이 가미된 오픈월드 생존 제작 게임.'
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
        { name: 'Baldur\'s Gate 3', reviewKey: 'baldursGate3Review', image: 'https://via.placeholder.com/300x150.png?text=Baldur\'s+Gate+3' },
        { name: 'Elden Ring', reviewKey: 'eldenRingReview', image: 'https://via.placeholder.com/300x150.png?text=Elden+Ring' },
        { name: 'Cyberpunk 2077', reviewKey: 'cyberpunk2077Review', image: 'https://via.placeholder.com/300x150.png?text=Cyberpunk+2077' },
        { name: 'Lethal Company', reviewKey: 'lethalCompanyReview', image: 'https://via.placeholder.com/300x150.png?text=Lethal+Company' },
        { name: 'Helldivers 2', reviewKey: 'helldivers2Review', image: 'https://via.placeholder.com/300x150.png?text=Helldivers+2' },
        { name: 'Palworld', reviewKey: 'palworldReview', image: 'https://via.placeholder.com/300x150.png?text=Palworld' },
        { name: 'Stardew Valley', reviewKey: 'stardewValleyReview', image: 'https://via.placeholder.com/300x150.png?text=Stardew+Valley' },
        { name: 'Hades', reviewKey: 'hadesReview', image: 'https://via.placeholder.com/300x150.png?text=Hades' },
        { name: 'Celeste', reviewKey: 'celesteReview', image: 'https://via.placeholder.com/300x150.png?text=Celeste' }
    ];

    const gameReviewsContainer = document.getElementById('gameReviews');

    function renderGameReviews(lang) {
        gameReviewsContainer.innerHTML = '';
        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'review-card';
            const reviewText = (translations[lang] && translations[lang][game.reviewKey]) || '';
            card.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <h2>${game.name}</h2>
                <p>${reviewText}</p>
            `;
            gameReviewsContainer.appendChild(card);
        });
    }

    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
});
