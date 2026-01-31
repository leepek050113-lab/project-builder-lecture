document.addEventListener('DOMContentLoaded', () => {
    // --- THEME & LANGUAGE --- //
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

    const langKo = document.getElementById('lang-ko');
    const langEn = document.getElementById('lang-en');
    langKo.addEventListener('click', () => setLanguage('ko'));
    langEn.addEventListener('click', () => setLanguage('en'));

    // --- TRANSLATIONS --- //
    const translations = {
        en: {
            title: 'Steam Game Reviews', searchPlaceholder: 'Search for a game...', hotGamesTitle: '🔥 Hot Right Now', tags: 'Tags',
            // ... (rest of the descriptions)
        },
        ko: {
            title: '스팀 게임 리뷰', searchPlaceholder: '게임을 검색하세요...', hotGamesTitle: '🔥 지금 가장 핫한 게임', tags: '태그',
            // ... (rest of the descriptions)
        }
    };

    // --- GAME DATA with TAGS and VIDEO IDs --- //
    const allGames = [
        { name: 'Counter-Strike 2', descriptionKey: 'cs2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg', tags: ['FPS', 'Shooter', 'Multiplayer', 'Competitive'], videoId: 'c80_g_m2_RA' },
        { name: 'Helldivers 2', descriptionKey: 'helldivers2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg', tags: ['Co-op', 'Online Co-Op', 'Shooter', 'Action'], videoId: 'w_3_OMp_H-g' },
        { name: 'Dota 2', descriptionKey: 'dota2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg', tags: ['MOBA', 'Multiplayer', 'Strategy', 'Free to Play'], videoId: '-cSFPIwQp4s' },
        { name: 'Baldur\'s Gate 3', descriptionKey: 'baldursGate3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', tags: ['RPG', 'Story Rich', 'Fantasy', 'Turn-Based'], videoId: '1T22pB-Mi5Y' },
        { name: 'PUBG: BATTLEGROUNDS', descriptionKey: 'pubgDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg', tags: ['Battle Royale', 'Shooter', 'Multiplayer', 'Survival'], videoId: '93h9a3_j2j0' },
        // ... (and so on for the other 45 games, adding tags and videoId)
    ];

    const hotGames = allGames.slice(0, 5);
    let mainGames = allGames.slice(5);

    // --- DOM ELEMENTS --- //
    const hotGamesContainer = document.getElementById('hotGamesContainer');
    const gameReviewsContainer = document.getElementById('gameReviews');
    const modal = document.getElementById('game-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const searchInput = document.getElementById('searchInput');
    const modalVideo = document.getElementById('modal-game-video');
    const modalTags = document.getElementById('modal-game-tags');

    // --- RENDER FUNCTIONS --- //
    function renderHotGames(lang) {
        // ... (same as before)
    }

    function renderMainGames(lang, filter = '') {
        // ... (same as before)
    }

    function setLanguage(lang) {
        // ... (same as before)
    }

    // --- MODAL LOGIC --- //
    function showGameDetails(game, lang) {
        const currentLang = localStorage.getItem('language') || 'en';

        document.getElementById('modal-game-title').textContent = game.name;
        document.getElementById('modal-game-description').textContent = translations[currentLang][game.descriptionKey] || '';

        // Set YouTube video
        modalVideo.src = `https://www.youtube.com/embed/${game.videoId}`;

        // Render tags
        modalTags.innerHTML = ''; // Clear previous tags
        game.tags.forEach(tagText => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tagText;
            modalTags.appendChild(tagElement);
        });

        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        // Stop the video when the modal is closed
        modalVideo.src = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // --- SEARCH & AUTO-REFRESH --- //
    // ... (same as before)

    // --- INITIAL LOAD --- //
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    setInterval(() => {
        // Fisher-Yates shuffle algorithm
        for (let i = mainGames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mainGames[i], mainGames[j]] = [mainGames[j], mainGames[i]];
        }
        const currentLang = localStorage.getItem('language') || 'en';
        renderMainGames(currentLang, searchInput.value);
    }, 60000); // Refresh every 60 seconds
});
