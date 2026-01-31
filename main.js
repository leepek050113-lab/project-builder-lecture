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
            celesteReview: 'A challenging platformer with a touching narrative.'
        },
        ko: {
            title: '스팀 게임 리뷰',
            searchPlaceholder: '게임을 검색하세요...',
            stardewValleyReview: '편안한 농장 시뮬레이션 게임입니다.',
            hadesReview: '훌륭한 스토리를 가진 액션 로그라이크 게임입니다.',
            celesteReview: '감동적인 서사를 가진 도전적인 플랫포머 게임입니다.'
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
        renderGameReviews(lang); // Re-render reviews with the selected language
    }

    const games = [
        { name: 'Stardew Valley', reviewKey: 'stardewValleyReview', image: 'https://via.placeholder.com/300x150.png?text=Stardew+Valley' },
        { name: 'Hades', reviewKey: 'hadesReview', image: 'https://via.placeholder.com/300x150.png?text=Hades' },
        { name: 'Celeste', reviewKey: 'celesteReview', image: 'https://via.placeholder.com/300x150.png?text=Celeste' }
    ];

    const gameReviewsContainer = document.getElementById('gameReviews');

    function renderGameReviews(lang) {
        gameReviewsContainer.innerHTML = ''; // Clear existing reviews
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
