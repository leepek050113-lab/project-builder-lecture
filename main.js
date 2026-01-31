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
    let timerInterval;

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
                if (el.tagName === 'INPUT') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
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

        if (game.videoId) {
            modalVideoLink.href = `https://www.youtube.com/watch?v=${game.videoId}`;
            modalVideoLink.style.display = 'inline-block';
        } else {
            modalVideoLink.style.display = 'none';
        }
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
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
    
    function reshuffleHotGames() {
        console.log("Reshuffling Hot Games...");
        let allCurrentGames = [...hotGames, ...mainGames];
        shuffleArray(allCurrentGames);
        hotGames = allCurrentGames.slice(0, 10);
        mainGames = allCurrentGames.slice(10);
        renderGames(searchInput.value);
    }

    function startHotGameTimer() {
        clearInterval(timerInterval); // Clear any existing timer
        let duration = 600; // 10 minutes in seconds

        timerInterval = setInterval(() => {
            const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
            const seconds = (duration % 60).toString().padStart(2, '0');
            hotGamesTimer.textContent = `${minutes}:${seconds}`;

            if (--duration < 0) {
                reshuffleHotGames();
                duration = 600; // Reset timer
            }
        }, 1000);
    }

    function initialLoad() {
        // Ensure gamedata.js is loaded and allGames is available
        if (typeof allGames === 'undefined' || typeof translations === 'undefined') {
            console.error('Game data is not loaded yet!');
            return;
        }

        let shuffledGames = [...allGames];
        shuffleArray(shuffledGames);
        hotGames = shuffledGames.slice(0, 10);
        mainGames = shuffledGames.slice(10);
        
        applyTheme(currentTheme);
        applyLanguage(currentLanguage); // This will also call renderGames
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
    refreshButton.addEventListener('click', () => {
        shuffleArray(mainGames);
        renderGames(searchInput.value);
    });

    // --- Initial Load ---
    initialLoad();
});
