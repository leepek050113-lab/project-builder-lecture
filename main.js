
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

    // --- TRANSLATIONS ---
    const translations = {
        en: {
            title: 'Steam Game Reviews',
            hotGamesTitle: '🔥 Hot Right Now',
            searchPlaceholder: 'Search for a game...',
            tags: 'Tags',
            watchTrailer: 'Watch Trailer',
            cs2Desc: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.",
            dota2Desc: "Every day, millions of players worldwide enter battle as one of over a hundred Dota Heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover.",
            pubgDesc: "Land, loot, and outwit your opponents to become the last player left standing in a thrilling game experience full of unexpected, adrenaline-pumping moments.",
            apexLegendsDesc: "Conquer with character in Apex Legends, a free-to-play Hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.",
            gta5Desc: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government and the entertainment industry, they must pull off a series of dangerous heists to survive in a ruthless city in which they can trust nobody, least of all each other.",
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
            pubgDesc: "예상치 못한 아드레날린 넘치는 순간으로 가득 찬 스릴 넘치는 게임 경험 속에서 마지막까지 살아남기 위해 착륙하고, 아이템을 줍고, 상대를 압도하세요.",
            apexLegendsDesc: "강력한 능력을 가진 전설적인 캐릭터들이 프론티어의 변방에서 명예와 부를 위해 싸우는 무료 영웅 슈팅 게임, Apex 레전드에서 개성으로 정복하세요.",
            gta5Desc: "젊은 거리의 사기꾼, 은퇴한 은행 강도, 그리고 무서운 사이코패스가 범죄 세계의 가장 무섭고 미친 인물들, 미국 정부, 그리고 연예 산업과 얽히게 되면서, 그들은 누구도 믿을 수 없는 무자비한 도시에서 살아남기 위해 일련의 위험한 강탈을 성공시켜야 합니다.",
            stardewValleyDesc: "당신은 스타듀 밸리에 있는 할아버지의 오래된 농장을 물려받았습니다. 물려받은 도구와 약간의 동전으로 무장하고, 당신은 새로운 삶을 시작합니다."
        }
    };

    // --- GAME DATA (Full & Corrected) ---
    const allGames = [
        { name: 'Counter-Strike 2', appId: 730, videoId: 'c80_g_m2_RA', tags: ['FPS', 'Shooter', 'Multiplayer', 'Competitive'], descriptionKey: 'cs2Desc' },
        { name: 'Dota 2', appId: 570, videoId: '-cSFPIwQp4s', tags: ['MOBA', 'Strategy', 'Free to Play'], descriptionKey: 'dota2Desc' },
        { name: 'PUBG: BATTLEGROUNDS', appId: 578080, videoId: '93h9a3_j2j0', tags: ['Battle Royale', 'Shooter', 'Multiplayer'], descriptionKey: 'pubgDesc' },
        { name: 'Apex Legends', appId: 1172470, videoId: 'o2Wf_1_1y5E', tags: ['Hero Shooter', 'Battle Royale', 'Free to Play'], descriptionKey: 'apexLegendsDesc' },
        { name: 'Grand Theft Auto V', appId: 271590, videoId: 'QkkoHAzjnUs', tags: ['Open World', 'Action', 'Multiplayer'], descriptionKey: 'gta5Desc' },
        { name: 'Stardew Valley', appId: 413150, videoId: 'ot7uXNQskhs', tags: ['Farming Sim', 'RPG', 'Life Sim'], descriptionKey: 'stardewValleyDesc' },
        { name: "Tom Clancy's Rainbow Six Siege", appId: 359550, videoId: '6wlvYh0h63k', tags: ['Tactical', 'FPS', 'Multiplayer'] },
        { name: 'Rust', appId: 252490, videoId: 'LGcECozNXEw', tags: ['Survival', 'PvP', 'Multiplayer'] },
        { name: 'Warframe', appId: 230410, videoId: 'ZxB-aV2s6sU', tags: ['Looter Shooter', 'Action RPG', 'Free to Play'] },
        { name: 'Destiny 2', appId: 1085660, videoId: '8FHe3y_2i_Q', tags: ['Looter Shooter', 'FPS', 'Free to Play'] },
        { name: 'Team Fortress 2', appId: 440, videoId: 'N1_qI-3S_0w', tags: ['Hero Shooter', 'Free to Play', 'Classic'] },
        { name: "Sid Meier's Civilization VI", appId: 289070, videoId: '5KdE0p2z_t4', tags: ['4X', 'Turn-Based Strategy', 'Historical'] },
        { name: 'The Witcher 3: Wild Hunt', appId: 292030, videoId: 'c0i88t0Kacs', tags: ['Action RPG', 'Open World', 'Story Rich'] },
        { name: 'Terraria', appId: 105600, videoId: 'w7uOhFTrrq0', tags: ['Sandbox', 'Adventure', '2D'] },
        { name: "Garry's Mod", appId: 4000, videoId: 'hpjV962DLws', tags: ['Sandbox', 'Physics', 'Multiplayer'] },
        { name: 'ARK: Survival Evolved', appId: 346110, videoId: 'aQM8Y-d6qUg', tags: ['Survival', 'Open World', 'Dinosaurs'] },
        { name: 'Fallout 4', appId: 377160, videoId: 'GE2BkLqMef4', tags: ['Open World', 'RPG', 'Post-Apocalyptic'] },
        { name: 'The Elder Scrolls V: Skyrim', appId: 489830, videoId: 'JSRtYpNRoN0', tags: ['Open World', 'RPG', 'Singleplayer'] },
        { name: 'Among Us', appId: 945360, videoId: 'grdYIbf_2wE', tags: ['Social Deduction', 'Multiplayer', 'Party Game'] },
        { name: 'Valheim', appId: 892970, videoId: 'BSrJRrls_0w', tags: ['Survival', 'Open World', 'Co-op', 'Viking'] },
        { name: 'Red Dead Redemption 2', appId: 1174180, videoId: 'eaW0tYpxLC0', tags: ['Open World', 'Action', 'Story Rich'] },
        { name: 'Cyberpunk 2077', appId: 1091500, videoId: '8X2kIfS6fb8', tags: ['Action RPG', 'Open World', 'Sci-Fi'] },
        { name: 'Elden Ring', appId: 1245620, videoId: 'E3Huy2cdih0', tags: ['Souls-like', 'Action RPG', 'Open World'] },
        { name: "Baldur's Gate 3", appId: 1086940, videoId: '1T22pB-Mi5U', tags: ['CRPG', 'Turn-Based', 'Story Rich'] },
        { name: 'HELLDIVERS 2', appId: 553850, videoId: 'wX-2g_G9Kz4', tags: ['Co-op', 'Shooter', 'Sci-Fi'] },
        { name: 'Lethal Company', appId: 1966720, videoId: '8v5O2-Lw_I8', tags: ['Co-op', 'Horror', 'Survival'] },
        { name: 'Palworld', appId: 1623730, videoId: 'W_2quIponmE', tags: ['Survival', 'Creature Collector', 'Open World'] }
    ];
    
    let hotGames = [];
    let mainGames = [];

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
        shuffleAndRender(searchInput.value);
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

    function shuffleAndRender(filter = '') {
        let gamesToShuffle = [...allGames];
        for (let i = gamesToShuffle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gamesToShuffle[i], gamesToShuffle[j]] = [gamesToShuffle[j], gamesToShuffle[i]];
        }

        const filteredGames = gamesToShuffle.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));

        hotGames = filteredGames.slice(0, 10);
        mainGames = filteredGames.slice(10, 260);

        hotGamesContainer.innerHTML = '';
        hotGames.forEach(game => hotGamesContainer.appendChild(createGameCard(game, 'hot')));

        gameReviewsContainer.innerHTML = '';
        mainGames.forEach(game => gameReviewsContainer.appendChild(createGameCard(game, 'main')));
    }

    // --- Event Listeners ---
    themeSwitcher.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
    });
    langKo.addEventListener('click', () => setLanguage('ko'));
    langEn.addEventListener('click', () => setLanguage('en'));
    searchInput.addEventListener('input', (e) => shuffleAndRender(e.target.value));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    refreshButton.addEventListener('click', () => shuffleAndRender(searchInput.value));

    // --- Initial Load ---
    applyTheme(currentTheme);
    setLanguage(currentLanguage);
});
