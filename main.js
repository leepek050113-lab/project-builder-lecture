
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

    // --- Modal UI ---
    const modalTitle = document.getElementById('modal-game-title');
    const modalTags = document.getElementById('modal-game-tags');
    const modalDescription = document.getElementById('modal-game-description');
    const modalVideoLink = document.getElementById('modal-video-link');

    // --- App State ---
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentLanguage = localStorage.getItem('language') || 'en';

    // --- TRANSLATIONS (Simplified) ---
    const translations = {
        en: {
            title: 'Steam Game Reviews',
            hotGamesTitle: '🔥 Hot Right Now',
            searchPlaceholder: 'Search for a game...',
            tags: 'Tags',
            watchTrailer: 'Watch Trailer',
            cs2Desc: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.",
            dota2Desc: "Every day, millions of players worldwide enter battle as one of over a hundred Dota Heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover.",
            apexLegendsDesc: "Conquer with character in Apex Legends, a free-to-play Hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.",
            stardewValleyDesc: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life."
        },
        ko: {
            title: '스팀 게임 리뷰',
            hotGamesTitle: '🔥 지금 가장 핫한 게임',
            searchPlaceholder: '게임을 검색하세요...',
            tags: '태그',
            watchTrailer: '트레일러 보기',
            cs2Desc: "20년 이상 동안 Counter-Strike는 전 세계 수백만 명의 플레이어들이 만들어낸 최고의 경쟁적인 경험을 제공해왔습니다. 그리고 이제 CS 이야기의 다음 장이 시작됩니다. 이것이 바로 Counter-Strike 2입니다.",
            dota2Desc: "매일 전 세계 수백만 명의 플레이어들이 백여 명이 넘는 도타 영웅 중 하나가 되어 전투에 참여합니다. 10시간을 플레이했든 1,000시간을 플레이했든, 항상 새로운 것을 발견할 수 있습니다.",
            apexLegendsDesc: "강력한 능력을 가진 전설적인 캐릭터들이 프론티어의 변방에서 명예와 부를 위해 싸우는 무료 영웅 슈팅 게임, Apex 레전드에서 개성으로 정복하세요.",
            stardewValleyDesc: "당신은 스타듀 밸리에 있는 할아버지의 오래된 농장을 물려받았습니다. 물려받은 도구와 약간의 동전으로 무장하고, 당신은 새로운 삶을 시작합니다."
        }
    };

    // --- GAME DATA (Drastically Simplified for Debugging) ---
    const allGames = [
        { name: 'Counter-Strike 2', appId: 730, videoId: 'c80_g_m2_RA', tags: ['FPS', 'Shooter', 'Multiplayer', 'Competitive'], descriptionKey: 'cs2Desc' },
        { name: 'Apex Legends', appId: 1172470, videoId: 'o2Wf_1_1y5E', tags: ['Hero Shooter', 'Battle Royale', 'Free to Play'], descriptionKey: 'apexLegendsDesc' },
        { name: 'Dota 2', appId: 570, videoId: '-cSFPIwQp4s', tags: ['MOBA', 'Strategy', 'Free to Play'], descriptionKey: 'dota2Desc' },
        { name: 'Stardew Valley', appId: 413150, videoId: 'ot7uXNQskhs', tags: ['Farming Sim', 'RPG', 'Life Sim'], descriptionKey: 'stardewValleyDesc' }
    ];
    
    function applyTheme(theme) {
        document.body.className = theme + '-mode';
        themeSwitcher.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    }

    function setLanguage(lang) {
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

    function createGameCard(game, container) {
        const card = document.createElement('div');
        card.className = container === hotGamesContainer ? 'hot-game-card' : 'review-card';
        const imageUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appId}/header.jpg`;
        
        const img = new Image();
        img.src = imageUrl;
        img.alt = game.name;
        img.loading = 'lazy';
        
        img.onload = () => {
            card.innerHTML = `<img src="${imageUrl}" alt="${game.name}" loading="lazy"/><h3>${game.name}</h3>`;
            card.addEventListener('click', () => showGameDetails(game));
            container.appendChild(card);
        };
        
        img.onerror = () => {
            console.warn(`Image failed to load for ${game.name} (appId: ${game.appId}). Card not displayed.`);
        };
    }
    
    function showGameDetails(game) {
        modalTitle.textContent = game.name;
        
        const description = (translations[currentLanguage] && translations[currentLanguage][game.descriptionKey]) || (translations['en'][game.descriptionKey] || "No description available.");
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

    function renderGames(filter = '') {
        hotGamesContainer.innerHTML = '';
        gameReviewsContainer.innerHTML = '';

        const filteredGames = allGames.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));

        // For this debug version, show all games in the "hot" container.
        filteredGames.forEach(game => createGameCard(game, hotGamesContainer));
    }

    // --- Event Listeners ---
    themeSwitcher.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
    });
    langKo.addEventListener('click', () => setLanguage('ko'));
    langEn.addEventListener('click', () => setLanguage('en'));
    searchInput.addEventListener('input', (e) => renderGames(e.target.value));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    refreshButton.addEventListener('click', () => renderGames(searchInput.value));

    // --- Initial Load ---
    applyTheme(currentTheme);
    setLanguage(currentLanguage);
});
