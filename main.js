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
    let displayedGames = []; // The current pool of 50 games (hot + main)
    let seenGameAppIds = new Set(); // Tracks all games shown to the user in the session
    let timerInterval;

    const TOTAL_SAMPLE_SIZE = 50; 
    const HOT_GAME_COUNT = 10;
    const MAIN_GAME_COUNT = TOTAL_SAMPLE_SIZE - HOT_GAME_COUNT;

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
        if (modal.style.display === 'block') {
            const gameId = modal.dataset.gameId;
            if (gameId) {
                const game = [...hotGames, ...mainGames].find(g => g.appId == gameId);
                if (game) showGameDetails(game);
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
        modal.dataset.gameId = game.appId;
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
        modal.dataset.gameId = '';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function renderGames(filter = '') {
        const lowerFilter = filter.toLowerCase();

        hotGamesContainer.innerHTML = '';
        hotGames.filter(g => g.name.toLowerCase().includes(lowerFilter))
                .forEach(game => hotGamesContainer.appendChild(createGameCard(game, 'hot')));

        gameReviewsContainer.innerHTML = '';
        mainGames.filter(g => g.name.toLowerCase().includes(lowerFilter))
                 .forEach(game => gameReviewsContainer.appendChild(createGameCard(game, 'main')));
    }
    
    function loadNewMainGames() {
        console.log("Loading new main games, keeping hot games.");

        let unseenGames = allGames.filter(game => !seenGameAppIds.has(game.appId));

        if (unseenGames.length < MAIN_GAME_COUNT) {
            console.log("Not enough unseen games. Resetting seen list.");
            // Reset seen list, but keep current games from being immediately reshown
            seenGameAppIds = new Set([...hotGames, ...mainGames].map(g => g.appId));
            unseenGames = allGames.filter(game => !seenGameAppIds.has(game.appId));
            // If still not enough, it means we have less than 100 games total. Just use what we have.
            if(unseenGames.length === 0) {
                console.log("All games have been displayed.");
                return; // or show a message to the user
            }
        }

        shuffleArray(unseenGames);
        const newMainGames = unseenGames.slice(0, MAIN_GAME_COUNT);

        newMainGames.forEach(game => seenGameAppIds.add(game.appId));

        mainGames = newMainGames;
        displayedGames = [...hotGames, ...mainGames]; // Update the total displayed pool

        renderGames(searchInput.value);
    }

    function reshuffleHotGames() {
        console.log("Reshuffling hot games from the current display pool.");
        
        // The pool is the currently displayed 50 games
        let currentPool = [...hotGames, ...mainGames];
        shuffleArray(currentPool);

        hotGames = currentPool.slice(0, HOT_GAME_COUNT);
        mainGames = currentPool.slice(HOT_GAME_COUNT);

        renderGames(searchInput.value);
    }

    function startHotGameTimer() {
        clearInterval(timerInterval);
        let duration = 600; // 10 minutes

        const updateTimer = () => {
            const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
            const seconds = (duration % 60).toString().padStart(2, '0');
            hotGamesTimer.textContent = `${minutes}:${seconds}`;
        };

        updateTimer(); 

        timerInterval = setInterval(() => {
            duration--;
            updateTimer();
            if (duration < 0) {
                reshuffleHotGames();
                duration = 600; // Reset timer
            }
        }, 1000);
    }

    function initialLoad() {
        if (typeof allGames === 'undefined' || typeof translations === 'undefined') {
            setTimeout(initialLoad, 100);
            return;
        }
        
        shuffleArray(allGames);
        displayedGames = allGames.slice(0, TOTAL_SAMPLE_SIZE);
        
        displayedGames.forEach(game => seenGameAppIds.add(game.appId));

        hotGames = displayedGames.slice(0, HOT_GAME_COUNT);
        mainGames = displayedGames.slice(HOT_GAME_COUNT);
        
        applyTheme(currentTheme);
        applyLanguage(currentLanguage);
        renderGames();
        startHotGameTimer();
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

    // Refresh button now only loads new MAIN games, keeping HOT games stable.
    refreshButton.addEventListener('click', loadNewMainGames);

    // --- Initial Load ---
    initialLoad();
});
