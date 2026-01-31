
document.addEventListener('DOMContentLoaded', () => {
    // --- THEME & LANGUAGE SWITCHER ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const langKo = document.getElementById('lang-ko');
    const langEn = document.getElementById('lang-en');

    // Load saved theme and language or set defaults
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentLanguage = localStorage.getItem('language') || 'en';

    function applyTheme(theme) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme + '-mode');
        themeSwitcher.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    }

    themeSwitcher.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
    });

    langKo.addEventListener('click', () => setLanguage('ko'));
    langEn.addEventListener('click', () => setLanguage('en'));

    // --- TRANSLATIONS ---
    const translations = {
        en: {
            title: 'Steam Game Reviews',
            hotGamesTitle: '🔥 Hot Right Now',
            searchPlaceholder: 'Search for a game...',
            tags: 'Tags',
            cs2Desc: 'The latest evolution of the world’s most iconic tactical shooter.',
            helldivers2Desc: 'A fast-paced, chaotic third-person co-op shooter.',
            dota2Desc: 'A competitive game of action and strategy, played by millions.',
            pubgDesc: 'Land, loot, and outwit your opponents to become the last player left standing.',
            apexLegendsDesc: 'A free-to-play hero shooter with legendary characters.',
            baldursGate3Desc: 'An epic RPG with unparalleled freedom.',
            eldenRingDesc: 'A vast, challenging open-world action RPG.',
            cyberpunk2077Desc: 'An open-world, action-adventure story set in Night City.',
            lethalCompanyDesc: 'A co-op horror game about scavenging abandoned industrial moons.',
            palworldDesc: 'An open-world survival crafting game with creature collection.',
            gta5Desc: 'Experience the interwoven stories of Franklin, Michael, and Trevor.',
            rdr2Desc: 'A sweeping tale of honor and loyalty at the dawn of the modern age.',
            witcher3Desc: 'A story-driven, open-world RPG set in a visually stunning fantasy universe.',
            valheimDesc: 'A brutal exploration and survival game inspired by viking culture.',
            rustDesc: 'The only aim in Rust is to survive.',
            terrariaDesc: 'Dig, fight, explore, build!',
            fallout4Desc: 'As the sole survivor of Vault 111, you enter a world destroyed by nuclear war.',
            skyrimDesc: 'Skyrim Special Edition brings the epic fantasy to life in stunning detail.',
            amongUsDesc: 'An online party game of teamwork and betrayal.',
            stardewValleyDesc: 'Inherit your grandfather\'s old farm plot and start a new life.',
            hollowKnightDesc: 'Explore a vast, ruined kingdom of insects and heroes.',
            factorioDesc: 'Build and create automated factories.',
            satisfactoryDesc: 'A first-person open-world factory building game.',
            deadbyDaylightDesc: 'A multiplayer (4vs1) horror game.',
            warframeDesc: 'A free-to-play, co-op, third-person, looter shooter.',
            finalFantasyXIVDesc: 'Take part in an epic and ever-changing Final Fantasy.',
            seaofThievesDesc: 'The essential pirate experience.',
            noMansSkyDesc: 'Explore a galaxy of unique planets and lifeforms.',
            deepRockGalacticDesc: 'A 1-4 player co-op FPS featuring badass space Dwarves.',
            subnauticaDesc: 'Descend into the depths of an alien underwater world.',
            arkDesc: 'Stranded on the shores of a mysterious island, you must learn to survive.',
            rimworldDesc: 'A sci-fi colony sim driven by an intelligent AI storyteller.',
            monsterHunterWorldDesc: 'Hunt monsters and create stronger weapons and armor.',
            left4Dead2Desc: 'This co-operative action horror FPS takes you through the cities, swamps and cemeteries of the Deep South.',
            portal2Desc: 'Design and build puzzles for yourself and your friends!',
            doomEternalDesc: 'Hell\'s armies have invaded Earth. Become the Slayer in an epic single-player campaign.',
            hadesDesc: 'Defy the god of the dead as you hack and slash out of the Underworld of Greek myth.',
        },
        ko: {
            title: '스팀 게임 리뷰',
            hotGamesTitle: '🔥 지금 가장 핫한 게임',
            searchPlaceholder: '게임을 검색하세요...',
            tags: '태그',
            cs2Desc: '세계에서 가장 상징적인 전술 슈팅 게임의 최신 진화 버전입니다.',
            helldivers2Desc: '빠르고 혼란스러운 3인칭 협동 슈팅 게임입니다.',
            dota2Desc: '수백만 명의 팬들이 매일 플레이하는 액션과 전략이 어우러진 경쟁 게임입니다.',
            pubgDesc: '다양하고 스릴 넘치는 전장에서 착륙하고, 약탈하고, 상대를 제압하여 마지막 생존자가 되십시오.',
            apexLegendsDesc: '전설적인 캐릭터들이 등장하는 무료 플레이 영웅 슈팅 게임입니다.',
            baldursGate3Desc: '비교할 수 없는 자유와 스토리텔링을 갖춘 대서사시 RPG입니다.',
            eldenRingDesc: 'FromSoftware에서 제작한 광활하고 도전적인 오픈월드 액션 RPG입니다.',
            cyberpunk2077Desc: '권력, 매력, 신체 개조에 집착하는 거대 도시 나이트 시티를 배경으로 한 오픈월드 액션 어드벤처입니다.',
            lethalCompanyDesc: '버려진 산업 위성에서 폐물을 수집하는 협동 공포 게임입니다.',
            palworldDesc: '생물 수집이 가능한 오픈월드 생존 제작 게임입니다.',
            gta5Desc: '로스 산토스에서 프랭클린, 마이클, 트레버의 얽히고설킨 이야기를 경험해보세요.',
            rdr2Desc: '현대 시대의 여명기에 펼쳐지는 명예와 충성에 대한 광대한 이야기.',
            witcher3Desc: '시각적으로 놀라운 판타지 세계를 배경으로 한 스토리 중심의 오픈월드 RPG입니다.',
            valheimDesc: '바이킹 문화에서 영감을 받은 잔혹한 탐험 및 생존 게임입니다.',
            rustDesc: 'Rust의 유일한 목표는 생존입니다.',
            terrariaDesc: '파고, 싸우고, 탐험하고, 건설하세요!',
            fallout4Desc: '볼트 111의 유일한 생존자인 당신은 핵전쟁으로 파괴된 세상에 들어갑니다.',
            skyrimDesc: 'Skyrim Special Edition은 장대한 판타지에 생명을 불어넣습니다.',
            amongUsDesc: '팀워크와 배신을 다루는 온라인 파티 게임.',
            stardewValleyDesc: '할아버지의 오래된 농장을 물려받아 새로운 삶을 시작하세요.',
            hollowKnightDesc: '광대하고 폐허가 된 곤충과 영웅의 왕국을 탐험하세요.',
            factorioDesc: '자동화된 공장을 건설하고 만드세요.',
            satisfactoryDesc: '1인칭 오픈월드 공장 건설 게임입니다.',
            deadbyDaylightDesc: '멀티플레이어(4vs1) 공포 게임입니다.',
            warframeDesc: '무료 플레이, 협동, 3인칭, 루트 슈터 게임입니다.',
            finalFantasyXIVDesc: '끊임없이 변화하는 파이널 판타지에 참여하세요.',
            seaofThievesDesc: '필수적인 해적 경험.',
            noMansSkyDesc: '독특한 행성과 생명체의 은하계를 탐험하세요.',
            deepRockGalacticDesc: '강력한 우주 드워프가 등장하는 1-4인용 협동 FPS입니다.',
            subnauticaDesc: '외계 수중 세계의 깊은 곳으로 내려가세요.',
            arkDesc: '신비한 섬의 해안에 좌초된 당신은 생존하는 법을 배워야 합니다.',
            rimworldDesc: '지능적인 AI 스토리텔러가 주도하는 공상 과학 식민지 시뮬레이션.',
            monsterHunterWorldDesc: '몬스터를 사냥하고 더 강한 무기와 갑옷을 만드세요.',
            left4Dead2Desc: '이 협동 액션 공포 FPS는 당신과 당신의 친구들을 딥 사우스의 도시, 늪, 묘지를 통과하게 합니다.',
            portal2Desc: '자신과 친구들을 위한 퍼즐을 디자인하고 만드세요!',
            doomEternalDesc: '지옥의 군대가 지구를 침공했습니다. 장대한 싱글 플레이어 캠페인에서 슬레이어가 되십시오.',
            hadesDesc: '그리스 신화의 지하 세계에서 빠져나오면서 죽음의 신에게 도전하세요.',
        }
    };
    
    // --- COMPLETE GAME DATA ---
    const allGames = [
        { name: 'Counter-Strike 2', descriptionKey: 'cs2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg', tags: ['FPS', 'Shooter', 'Multiplayer', 'Competitive', 'Tactical'], videoId: 'c80_g_m2_RA' },
        { name: 'Helldivers 2', descriptionKey: 'helldivers2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg', tags: ['Co-op', 'Online Co-Op', 'Third-Person Shooter', 'Action', 'Sci-fi'], videoId: 'w_3_OMp_H-g' },
        { name: 'Dota 2', descriptionKey: 'dota2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg', tags: ['MOBA', 'Multiplayer', 'Strategy', 'Free to Play', 'e-sports'], videoId: '-cSFPIwQp4s' },
        { name: 'PUBG: BATTLEGROUNDS', descriptionKey: 'pubgDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg', tags: ['Battle Royale', 'Shooter', 'Multiplayer', 'Survival', 'Online'], videoId: '93h9a3_j2j0' },
        { name: 'Apex Legends', descriptionKey: 'apexLegendsDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg', tags: ['Hero Shooter', 'Battle Royale', 'Multiplayer', 'Free to Play', 'Sci-fi'], videoId: 'o2Wf_1_1y5E' },
        { name: 'Baldur\'s Gate 3', descriptionKey: 'baldursGate3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', tags: ['RPG', 'Story Rich', 'Fantasy', 'Turn-Based Combat', 'Choices Matter'], videoId: '1T22pB-Mi5Y' },
        { name: 'Elden Ring', descriptionKey: 'eldenRingDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', tags: ['Souls-like', 'Action RPG', 'Dark Fantasy', 'Open World', 'Difficult'], videoId: 'E3Huy2cdih0' },
        { name: 'Cyberpunk 2077', descriptionKey: 'cyberpunk2077Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', tags: ['Cyberpunk', 'RPG', 'Open World', 'Sci-fi', 'First-Person'], videoId: '8X2kIfS6fb8' },
        { name: 'Lethal Company', descriptionKey: 'lethalCompanyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg', tags: ['Online Co-Op', 'Horror', 'First-Person', 'Indie', 'Psychological Horror'], videoId: '1h-Sj8T-h2A' },
        { name: 'Palworld', descriptionKey: 'palworldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg', tags: ['Creature Collector', 'Open World', 'Survival', 'Crafting', 'Multiplayer'], videoId: 'TechnologyLS_z-2o' },
        { name: 'Grand Theft Auto V', descriptionKey: 'gta5Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg', tags: ['Open World', 'Action', 'Multiplayer', 'Crime', 'Third Person'], videoId: 'QkkoHAzjnUs' },
        { name: 'Red Dead Redemption 2', descriptionKey: 'rdr2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg', tags: ['Open World', 'Story Rich', 'Action', 'Western', 'Adventure'], videoId: 'eaW0tYpxyp0' },
        { name: 'The Witcher 3: Wild Hunt', descriptionKey: 'witcher3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg', tags: ['RPG', 'Open World', 'Story Rich', 'Fantasy', 'Action RPG'], videoId: 'c0i88t0Kacs' },
        { name: 'Valheim', descriptionKey: 'valheimDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg', tags: ['Survival', 'Open World', 'Crafting', 'Online Co-Op', 'Building'], videoId: 'BSrJRrls_0w' },
        { name: 'Rust', descriptionKey: 'rustDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg', tags: ['Survival', 'Crafting', 'Multiplayer', 'Open World', 'PvP'], videoId: 'LGcECozNXEw' },
        { name: 'Terraria', descriptionKey: 'terrariaDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg', tags: ['Sandbox', 'Survival', '2D', 'Crafting', 'Adventure'], videoId: 'w7uOhFTrrq0' },
        { name: 'Fallout 4', descriptionKey: 'fallout4Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/377160/header.jpg', tags: ['Open World', 'Post-apocalyptic', 'RPG', 'Singleplayer', 'Sci-fi'], videoId: 'GE2BkLqMef4' },
        { name: 'The Elder Scrolls V: Skyrim', descriptionKey: 'skyrimDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/489830/header.jpg', tags: ['RPG', 'Open World', 'Fantasy', 'Adventure', 'Singleplayer'], videoId: 'JSRtYpNRoN0' },
        { name: 'Among Us', descriptionKey: 'amongUsDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg', tags: ['Social Deduction', 'Multiplayer', 'Online Co-Op', 'Party Game', 'Space'], videoId: 'grdYIbf_2wE' },
        { name: 'Stardew Valley', descriptionKey: 'stardewValleyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg', tags: ['Farming Sim', 'Life Sim', 'Pixel Graphics', 'RPG', 'Relaxing'], videoId: 'ot7uXNQskhs' },
        { name: 'Hollow Knight', descriptionKey: 'hollowKnightDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg', tags: ['Metroidvania', 'Souls-like', '2D', 'Platformer', 'Atmospheric'], videoId: 'UAO2urG23S4' },
        { name: 'Factorio', descriptionKey: 'factorioDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/427520/header.jpg', tags: ['Automation', 'Factory', 'Resource Management', 'Base Building', 'Simulation'], videoId: 'DR01YdFtW-w' },
        { name: 'Satisfactory', descriptionKey: 'satisfactoryDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/526870/header.jpg', tags: ['Factory', 'Automation', 'Open World', 'First-Person', 'Building'], videoId: 'W_lmP8jY6Lg' },
        { name: 'Dead by Daylight', descriptionKey: 'deadbyDaylightDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg', tags: ['Asymmetrical', 'Horror', 'Multiplayer', 'Survival Horror', 'Online'], videoId: 'JGhIXlo_10w' },
        { name: 'Warframe', descriptionKey: 'warframeDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg', tags: ['Looter Shooter', 'Action RPG', 'Free to Play', 'Sci-fi', 'Co-op'], videoId: 'Runa53_agI' },
        { name: 'Final Fantasy XIV Online', descriptionKey: 'finalFantasyXIVDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/39210/header.jpg', tags: ['MMORPG', 'RPG', 'Fantasy', 'Multiplayer', 'Story Rich'], videoId: 'FtuwltEGjE4' },
        { name: 'Sea of Thieves', descriptionKey: 'seaofThievesDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg', tags: ['Pirates', 'Adventure', 'Open World', 'Multiplayer', 'Co-op'], videoId: 'r5JIBaNgW5o' },
        { name: 'No Man\'s Sky', descriptionKey: 'noMansSkyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg', tags: ['Space', 'Open World', 'Survival', 'Exploration', 'Sci-fi'], videoId: 'nLtmEjqjpkk' },
        { name: 'Deep Rock Galactic', descriptionKey: 'deepRockGalacticDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/548430/header.jpg', tags: ['Co-op', 'FPS', 'Dwarves', 'Online Co-Op', 'Procedural Generation'], videoId: '3m4t573R1p4' },
        { name: 'Subnautica', descriptionKey: 'subnauticaDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/264710/header.jpg', tags: ['Survival', 'Open World', 'Underwater', 'Exploration', 'Crafting'], videoId: 'R3shr-H4S_I' },
        { name: 'ARK: Survival Evolved', descriptionKey: 'arkDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg', tags: ['Survival', 'Open World', 'Dinosaurs', 'Crafting', 'Multiplayer'], videoId: 'FW9vsrPWujI' },
        { name: 'RimWorld', descriptionKey: 'rimworldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg', tags: ['Colony Sim', 'Base Building', 'Survival', 'Strategy', 'Simulation'], videoId: '3tDrxOASUog' },
        { name: 'Monster Hunter: World', descriptionKey: 'monsterHunterWorldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg', tags: ['Action', 'RPG', 'Co-op', 'Multiplayer', 'Hunting'], videoId: 'RoY7s1Mnvv4' },
        { name: 'Left 4 Dead 2', descriptionKey: 'left4Dead2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg', tags: ['Zombies', 'Co-op', 'FPS', 'Shooter', 'Action'], videoId: '0-hR-3bXg2k' },
        { name: 'Portal 2', descriptionKey: 'portal2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg', tags: ['Puzzle', 'Platformer', 'First-Person', 'Sci-fi', 'Co-op'], videoId: 'tax4e4hBBZc' },
        { name: 'DOOM Eternal', descriptionKey: 'doomEternalDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/782330/header.jpg', tags: ['FPS', 'Action', 'Shooter', 'Demons', 'Gore'], videoId: '6h_n0-Y38b0' },
        { name: 'Hades', descriptionKey: 'hadesDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg', tags: ['Action Roguelike', 'Indie', 'Mythology', 'Dungeon Crawler', 'Hack and Slash'], videoId: '91t0ha9x0AE' }
    ];

    const hotGames = allGames.slice(0, 5);
    let mainGames = allGames.slice(5);

    // --- DOM ELEMENTS ---
    const hotGamesContainer = document.getElementById('hotGamesContainer');
    const gameReviewsContainer = document.getElementById('gameReviews');
    const modal = document.getElementById('game-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const searchInput = document.getElementById('searchInput');
    const modalVideo = document.getElementById('modal-game-video');
    const modalTitle = document.getElementById('modal-game-title');
    const modalTags = document.getElementById('modal-game-tags');
    const modalDescription = document.getElementById('modal-game-description');
    
    // --- RENDER FUNCTIONS ---
    function createGameCard(game, containerType) {
        const card = document.createElement('div');
        card.className = containerType === 'hot' ? 'hot-game-card' : 'review-card';
        
        let content = `<img src="${game.image}" alt="${game.name}">`;
        if (containerType === 'hot') {
            content += `<h3>${game.name}</h3>`;
        } else {
            content += `<div class="review-card-content"><h2>${game.name}</h2></div>`;
        }
        card.innerHTML = content;
        
        card.addEventListener('click', () => showGameDetails(game));
        return card;
    }

    function renderHotGames() {
        hotGamesContainer.innerHTML = '';
        hotGames.forEach(game => {
            hotGamesContainer.appendChild(createGameCard(game, 'hot'));
        });
    }

    function renderMainGames(filter = '') {
        gameReviewsContainer.innerHTML = '';
        const filteredGames = mainGames.filter(game => game.name.toLowerCase().includes(filter.toLowerCase()));
        
        filteredGames.forEach(game => {
            gameReviewsContainer.appendChild(createGameCard(game, 'main'));
        });
    }
    
    // --- MODAL LOGIC ---
    function showGameDetails(game) {
        modalTitle.textContent = game.name;
        modalVideo.src = `https://www.youtube.com/embed/${game.videoId}?autoplay=1&mute=1`;

        modalDescription.textContent = translations[currentLanguage][game.descriptionKey] || 'Description not found.';

        modalTags.innerHTML = '';
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
        modalVideo.src = ''; // Stop video playback
    }

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- LANGUAGE & CONTENT UPDATE ---
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        document.querySelectorAll('[data-lang-key]').forEach(elem => {
            const key = elem.getAttribute('data-lang-key');
            const translation = translations[lang][key];
            if (translation) {
                if (elem.tagName === 'INPUT') elem.placeholder = translation;
                else elem.textContent = translation;
            }
        });

        // Re-render content with the new language. We don't need to re-shuffle.
        renderHotGames();
        renderMainGames(searchInput.value);
    }

    // --- SEARCH & AUTO-REFRESH ---
    searchInput.addEventListener('input', (e) => {
        renderMainGames(e.target.value);
    });

    function shuffleAndRefresh() {
        for (let i = mainGames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mainGames[i], mainGames[j]] = [mainGames[j], mainGames[i]];
        }
        renderMainGames(searchInput.value);
    }

    // --- INITIAL LOAD ---
    applyTheme(currentTheme);
    setLanguage(currentLanguage);
    
    // Initial shuffle
    shuffleAndRefresh(); 

    // Set auto-refresh interval
    setInterval(shuffleAndRefresh, 60000);
});
