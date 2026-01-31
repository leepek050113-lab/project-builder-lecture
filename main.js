document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const langKo = document.getElementById('lang-ko');
    const langEn = document.getElementById('lang-en');
    const searchInput = document.getElementById('searchInput');
    const hotGamesContainer = document.getElementById('hotGamesContainer');
    const gameReviewsContainer = document.getElementById('gameReviews');
    const modal = document.getElementById('game-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const refreshButton = document.getElementById('refresh-button');
    const hotGamesTimer = document.getElementById('hot-games-timer');

    // --- Modal UI ---
    const modalTitle = document.getElementById('modal-game-title');
    const modalTags = document.getElementById('modal-game-tags');
    const modalDescription = document.getElementById('modal-game-description');
    const modalVideoLink = document.getElementById('modal-video-link');

    // --- App State ---
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentLanguage = localStorage.getItem('language') || 'en';
    let hotGames = [];
    let mainGames = [];
    let displayedGames = []; // Currently displayed subset of allGames
    let timerInterval;
    const SAMPLE_SIZE = 50; // Show 50 games at a time
    const HOT_GAME_COUNT = 10;

    // --- Functions ---

    function applyTheme(theme) {
        document.body.className = theme + '-mode';
        themeSwitcher.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    }

    function applyLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                const value = translations[lang][key];
                if (el.tagName === 'INPUT') el.placeholder = value;
                else el.textContent = value;
            }
        });
        // Re-render descriptions if modal is open
        if (modal.style.display === 'block') {
            const gameId = modal.dataset.gameId;
            if (gameId) {
                const game = displayedGames.find(g => g.appId == gameId);
                if (game) showGameDetails(game); // Refresh description
            }
        }
        renderGames(searchInput.value);
    }

    function createGameCard(game, type) {
        const card = document.createElement('div');
        card.className = type === 'hot' ? 'hot-game-card' : 'review-card';
        const imageUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appId}/header.jpg`;
        card.innerHTML = `<img src="${imageUrl}" alt="${game.name}" loading="lazy" onerror="this.parentElement.style.display='none'"/><h3>${game.name}</h3>`;
        card.addEventListener('click', () => showGameDetails(game));
        return card;
    }

    function showGameDetails(game) {
        modal.dataset.gameId = game.appId; // Store appId for language change
        modalTitle.textContent = game.name;
        const description = (translations[currentLanguage] && translations[currentLanguage][game.descriptionKey]) || (translations['en'][game.descriptionKey] || "Description not available.");
        modalDescription.textContent = description;

        modalTags.innerHTML = '';
        if (game.tags) {
            game.tags.forEach(tagText => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag';
                tagEl.textContent = tagText;
                modalTags.appendChild(tagEl);
            });
        }

        modalVideoLink.href = game.videoId ? `https://www.youtube.com/watch?v=${game.videoId}` : '#';
        modalVideoLink.style.display = game.videoId ? 'inline-block' : 'none';
        
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.dataset.gameId = ''; // Clear stored appId
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function renderGames(filter = '') {
        const lowerFilter = filter.toLowerCase();

        const filteredHot = hotGames.filter(g => g.name.toLowerCase().includes(lowerFilter));
        const filteredMain = mainGames.filter(g => g.name.toLowerCase().includes(lowerFilter));

        hotGamesContainer.innerHTML = '';
        filteredHot.forEach(game => hotGamesContainer.appendChild(createGameCard(game, 'hot')));

        gameReviewsContainer.innerHTML = '';
        filteredMain.forEach(game => gameReviewsContainer.appendChild(createGameCard(game, 'main')));
    }
    
    function reshuffleDisplayedGames() {
        shuffleArray(allGames);
        displayedGames = allGames.slice(0, SAMPLE_SIZE);
        hotGames = displayedGames.slice(0, HOT_GAME_COUNT);
        mainGames = displayedGames.slice(HOT_GAME_COUNT);
        renderGames(searchInput.value);
        // Restart the timer since we are reshuffling everything
        startHotGameTimer(); 
    }

    function startHotGameTimer() {
        clearInterval(timerInterval);
        let duration = 600; // 10 minutes

        const updateTimer = () => {
            const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
            const seconds = (duration % 60).toString().padStart(2, '0');
            hotGamesTimer.textContent = `${minutes}:${seconds}`;
        };

        updateTimer(); // Initial display

        timerInterval = setInterval(() => {
            duration--;
            updateTimer();
            if (duration < 0) {
                // When timer ends, only reshuffle the hot games from the currently displayed set
                shuffleArray(displayedGames);
                hotGames = displayedGames.slice(0, HOT_GAME_COUNT);
                mainGames = displayedGames.slice(HOT_GAME_COUNT);
                renderGames(searchInput.value);
                duration = 600; // Reset timer
            }
        }, 1000);
    }

    function initialLoad() {
        if (typeof allGames === 'undefined' || typeof translations === 'undefined') {
            console.error('Game data is not loaded yet! Retrying in 100ms...');
            setTimeout(initialLoad, 100);
            return;
        }
        
        applyTheme(currentTheme);
        reshuffleDisplayedGames(); // This now handles the initial game selection and rendering
        applyLanguage(currentLanguage); // Apply language translations
    }

    // --- Event Listeners ---
    themeSwitcher.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
    });
    langKo.addEventListener('click', () => applyLanguage('ko'));
    langEn.addEventListener('click', () => applyLanguage('en'));
    searchInput.addEventListener('input', (e) => renderGames(e.target.value));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    // Refresh button now re-samples the entire game list
    refreshButton.addEventListener('click', () => {
        console.log("Full reshuffle requested!");
        reshuffleDisplayedGames();
    });

    // --- Initial Load ---
    initialLoad();
});
