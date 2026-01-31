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

    // --- TRANSLATIONS (ABBREVIATED FOR BREVITY) --- //
    const translations = {
        en: {
            title: 'Steam Game Reviews', searchPlaceholder: 'Search for a game...', genre: 'Genre', playtime: 'Avg. Playtime', hotGamesTitle: '🔥 Hot Right Now',
            // Descriptions...
            cs2Desc: 'The latest evolution of the world’s most iconic tactical shooter.', helldivers2Desc: 'A fast-paced, chaotic third-person co-op shooter.', 
            dota2Desc: 'A competitive game of action and strategy, played by millions.', pubgDesc: 'Land, loot, and outwit your opponents to become the last player left standing.',
            apexLegendsDesc: 'A free-to-play hero shooter with legendary characters.', baldursGate3Desc: 'An epic RPG with unparalleled freedom.', eldenRingDesc: 'A vast, challenging open-world action RPG.', cyberpunk2077Desc: 'An open-world, action-adventure story set in Night City.', lethalCompanyDesc: 'A co-op horror game about scavenging abandoned industrial moons.', palworldDesc: 'An open-world survival crafting game with creature collection.', gta5Desc: 'Experience the interwoven stories of Franklin, Michael, and Trevor.', rdr2Desc: 'A sweeping tale of honor and loyalty at the dawn of the modern age.', witcher3Desc: 'A story-driven, open-world RPG set in a visually stunning fantasy universe.', valheimDesc: 'A brutal exploration and survival game inspired by viking culture.', rustDesc: 'The only aim in Rust is to survive.', terrariaDesc: 'Dig, fight, explore, build!', fallout4Desc: 'As the sole survivor of Vault 111, you enter a world destroyed by nuclear war.', skyrimDesc: 'Skyrim Special Edition brings the epic fantasy to life in stunning detail.', amongUsDesc: 'An online party game of teamwork and betrayal.', stardewValleyDesc: 'Inherit your grandfather\'s old farm plot and start a new life.', hollowKnightDesc: 'Explore a vast, ruined kingdom of insects and heroes.', factorioDesc: 'Build and create automated factories.', satisfactoryDesc: 'A first-person open-world factory building game.', deadbyDaylightDesc: 'A multiplayer (4vs1) horror game.', warframeDesc: 'A free-to-play, co-op, third-person, looter shooter.', finalFantasyXIVDesc: 'Take part in an epic and ever-changing Final Fantasy.', seaofThievesDesc: 'The essential pirate experience.', noMansSkyDesc: 'Explore a galaxy of unique planets and lifeforms.', deepRockGalacticDesc: 'A 1-4 player co-op FPS featuring badass space Dwarves.', subnauticaDesc: 'Descend into the depths of an alien underwater world.', arkDesc: 'Stranded on the shores of a mysterious island, you must learn to survive.', rimworldDesc: 'A sci-fi colony sim driven by an intelligent AI storyteller.', monsterHunterWorldDesc: 'Hunt monsters and create stronger weapons and armor.', left4Dead2Desc: 'This co-operative action horror FPS takes you through the cities, swamps and cemeteries of the Deep South.', portal2Desc: 'Design and build puzzles for yourself and your friends!', doomEternalDesc: 'Hell\'s armies have invaded Earth. Become the Slayer in an epic single-player campaign.', hadesDesc: 'Defy the god of the dead as you hack and slash out of the Underworld of Greek myth.',
        },
        ko: {
            title: '스팀 게임 리뷰', searchPlaceholder: '게임을 검색하세요...', genre: '장르', playtime: '평균 플레이 시간', hotGamesTitle: '🔥 지금 가장 핫한 게임',
            // Descriptions...
            cs2Desc: '세계에서 가장 상징적인 전술 슈팅 게임의 최신 진화 버전입니다.', helldivers2Desc: '빠르고 혼란스러운 3인칭 협동 슈팅 게임입니다.', 
            dota2Desc: '수백만 명의 팬들이 매일 플레이하는 액션과 전략이 어우러진 경쟁 게임입니다.', pubgDesc: '다양하고 스릴 넘치는 전장에서 착륙하고, 약탈하고, 상대를 제압하여 마지막 생존자가 되십시오.',
            apexLegendsDesc: '전설적인 캐릭터들이 등장하는 무료 플레이 영웅 슈팅 게임입니다.', baldursGate3Desc: '비교할 수 없는 자유와 스토리텔링을 갖춘 대서사시 RPG입니다.', eldenRingDesc: 'FromSoftware에서 제작한 광활하고 도전적인 오픈월드 액션 RPG입니다.', cyberpunk2077Desc: '권력, 매력, 신체 개조에 집착하는 거대 도시 나이트 시티를 배경으로 한 오픈월드 액션 어드벤처입니다.', lethalCompanyDesc: '버려진 산업 위성에서 폐물을 수집하는 협동 공포 게임입니다.', palworldDesc: '생물 수집이 가능한 오픈월드 생존 제작 게임입니다.', gta5Desc: '로스 산토스에서 프랭클린, 마이클, 트레버의 얽히고설킨 이야기를 경험해보세요.', rdr2Desc: '현대 시대의 여명기에 펼쳐지는 명예와 충성에 대한 광대한 이야기.', witcher3Desc: '시각적으로 놀라운 판타지 세계를 배경으로 한 스토리 중심의 오픈월드 RPG입니다.', valheimDesc: '바이킹 문화에서 영감을 받은 잔혹한 탐험 및 생존 게임입니다.', rustDesc: 'Rust의 유일한 목표는 생존입니다.', terrariaDesc: '파고, 싸우고, 탐험하고, 건설하세요!', fallout4Desc: '볼트 111의 유일한 생존자인 당신은 핵전쟁으로 파괴된 세상에 들어갑니다.', skyrimDesc: 'Skyrim Special Edition은 장대한 판타지에 생명을 불어넣습니다.', amongUsDesc: '팀워크와 배신을 다루는 온라인 파티 게임.', stardewValleyDesc: '할아버지의 오래된 농장을 물려받아 새로운 삶을 시작하세요.', hollowKnightDesc: '광대하고 폐허가 된 곤충과 영웅의 왕국을 탐험하세요.', factorioDesc: '자동화된 공장을 건설하고 만드세요.', satisfactoryDesc: '1인칭 오픈월드 공장 건설 게임입니다.', deadbyDaylightDesc: '멀티플레이어(4vs1) 공포 게임입니다.', warframeDesc: '무료 플레이, 협동, 3인칭, 루트 슈터 게임입니다.', finalFantasyXIVDesc: '끊임없이 변화하는 파이널 판타지에 참여하세요.', seaofThievesDesc: '필수적인 해적 경험.', noMansSkyDesc: '독특한 행성과 생명체의 은하계를 탐험하세요.', deepRockGalacticDesc: '강력한 우주 드워프가 등장하는 1-4인용 협동 FPS입니다.', subnauticaDesc: '외계 수중 세계의 깊은 곳으로 내려가세요.', arkDesc: '신비한 섬의 해안에 좌초된 당신은 생존하는 법을 배워야 합니다.', rimworldDesc: '지능적인 AI 스토리텔러가 주도하는 공상 과학 식민지 시뮬레이션.', monsterHunterWorldDesc: '몬스터를 사냥하고 더 강한 무기와 갑옷을 만드세요.', left4Dead2Desc: '이 협동 액션 공포 FPS는 당신과 당신의 친구들을 딥 사우스의 도시, 늪, 묘지를 통과하게 합니다.', portal2Desc: '자신과 친구들을 위한 퍼즐을 디자인하고 만드세요!', doomEternalDesc: '지옥의 군대가 지구를 침공했습니다. 장대한 싱글 플레이어 캠페인에서 슬레이어가 되십시오.', hadesDesc: '그리스 신화의 지하 세계에서 빠져나오면서 죽음의 신에게 도전하세요.',
        }
    };

    // --- GAME DATA (50 Games) --- //
    const allGames = [
        // Add 50 game objects here... (Sample below)
        { name: 'Counter-Strike 2', descriptionKey: 'cs2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg', genre: 'Tactical Shooter', playtime: '900+ Hours' },
        { name: 'Helldivers 2', descriptionKey: 'helldivers2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg', genre: 'Co-op Shooter', playtime: '30-50 Hours' },
        { name: 'Dota 2', descriptionKey: 'dota2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg', genre: 'MOBA', playtime: '800+ Hours' },
        { name: 'PUBG: BATTLEGROUNDS', descriptionKey: 'pubgDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg', genre: 'Battle Royale', playtime: '500+ Hours' },
        { name: 'Apex Legends', descriptionKey: 'apexLegendsDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg', genre: 'Hero Shooter', playtime: '400+ Hours' },
        { name: 'Baldur\'s Gate 3', descriptionKey: 'baldursGate3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', genre: 'RPG', playtime: '100+ Hours' },
        { name: 'Elden Ring', descriptionKey: 'eldenRingDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', genre: 'Action RPG', playtime: '80-120 Hours' },
        { name: 'Cyberpunk 2077', descriptionKey: 'cyberpunk2077Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', genre: 'Action RPG', playtime: '50-80 Hours' },
        { name: 'Lethal Company', descriptionKey: 'lethalCompanyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg', genre: 'Co-op Horror', playtime: '10-20 Hours' },
        { name: 'Palworld', descriptionKey: 'palworldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg', genre: 'Survival Crafting', playtime: '40-60 Hours' },
        { name: 'Grand Theft Auto V', descriptionKey: 'gta5Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg', genre: 'Action-Adventure', playtime: '80-150 Hours' },
        { name: 'Red Dead Redemption 2', descriptionKey: 'rdr2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg', genre: 'Action-Adventure', playtime: '60-100 Hours' },
        { name: 'The Witcher 3: Wild Hunt', descriptionKey: 'witcher3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg', genre: 'Action RPG', playtime: '100-150 Hours' },
        { name: 'Valheim', descriptionKey: 'valheimDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg', genre: 'Survival', playtime: '70-100 Hours' },
        { name: 'Rust', descriptionKey: 'rustDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg', genre: 'Survival', playtime: '300+ Hours' },
        { name: 'Terraria', descriptionKey: 'terrariaDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg', genre: 'Sandbox', playtime: '80-120 Hours' },
        { name: 'Fallout 4', descriptionKey: 'fallout4Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/377160/header.jpg', genre: 'Action RPG', playtime: '80-130 Hours' },
        { name: 'The Elder Scrolls V: Skyrim', descriptionKey: 'skyrimDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/489830/header.jpg', genre: 'Action RPG', playtime: '100-200 Hours' },
        { name: 'Among Us', descriptionKey: 'amongUsDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg', genre: 'Social Deduction', playtime: '10+ Hours' },
        { name: 'Stardew Valley', descriptionKey: 'stardewValleyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg', genre: 'Farming Sim', playtime: '60-100 Hours' },
        { name: 'Hollow Knight', descriptionKey: 'hollowKnightDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg', genre: 'Metroidvania', playtime: '30-40 Hours' },
        { name: 'Factorio', descriptionKey: 'factorioDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/427520/header.jpg', genre: 'Automation Sim', playtime: '150+ Hours' },
        { name: 'Satisfactory', descriptionKey: 'satisfactoryDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/526870/header.jpg', genre: 'Factory Sim', playtime: '80-120 Hours' },
        { name: 'Dead by Daylight', descriptionKey: 'deadbyDaylightDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg', genre: 'Asymmetrical Horror', playtime: '200+ Hours' },
        { name: 'Warframe', descriptionKey: 'warframeDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg', genre: 'Looter Shooter', playtime: '250+ Hours' },
        { name: 'Final Fantasy XIV Online', descriptionKey: 'finalFantasyXIVDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/39210/header.jpg', genre: 'MMORPG', playtime: '500+ Hours' },
        { name: 'Sea of Thieves', descriptionKey: 'seaofThievesDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg', genre: 'Action-Adventure', playtime: '40-70 Hours' },
        { name: 'No Man\'s Sky', descriptionKey: 'noMansSkyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg', genre: 'Survival', playtime: '60-100 Hours' },
        { name: 'Deep Rock Galactic', descriptionKey: 'deepRockGalacticDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/548430/header.jpg', genre: 'Co-op FPS', playtime: '50-80 Hours' },
        { name: 'Subnautica', descriptionKey: 'subnauticaDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/264710/header.jpg', genre: 'Survival', playtime: '30-50 Hours' },
        { name: 'ARK: Survival Evolved', descriptionKey: 'arkDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg', genre: 'Survival', playtime: '150+ Hours' },
        { name: 'RimWorld', descriptionKey: 'rimworldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg', genre: 'Colony Sim', playtime: '100-300 Hours' },
        { name: 'Monster Hunter: World', descriptionKey: 'monsterHunterWorldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg', genre: 'Action RPG', playtime: '100-200 Hours' },
        { name: 'Left 4 Dead 2', descriptionKey: 'left4Dead2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg', genre: 'Co-op FPS', playtime: '20-30 Hours' },
        { name: 'Portal 2', descriptionKey: 'portal2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg', genre: 'Puzzle-Platformer', playtime: '8-12 Hours' },
        { name: 'DOOM Eternal', descriptionKey: 'doomEternalDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/782330/header.jpg', genre: 'FPS', playtime: '15-20 Hours' },
        { name: 'Hades', descriptionKey: 'hadesDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg', genre: 'Action Roguelike', playtime: '20-30 Hours' }
        // ... and so on for 50 games
    ];

    const hotGames = allGames.slice(0, 5);
    let mainGames = allGames.slice(5);

    // --- DOM ELEMENTS --- //
    const hotGamesContainer = document.getElementById('hotGamesContainer');
    const gameReviewsContainer = document.getElementById('gameReviews');
    const modal = document.getElementById('game-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const searchInput = document.getElementById('searchInput');

    // --- RENDER FUNCTIONS --- //
    function renderHotGames(lang) {
        hotGamesContainer.innerHTML = '';
        hotGames.forEach(game => {
            const card = document.createElement('div');
            card.className = 'hot-game-card';
            card.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <h3>${game.name}</h3>
            `;
            card.addEventListener('click', () => showGameDetails(game, lang));
            hotGamesContainer.appendChild(card);
        });
    }

    function renderMainGames(lang, filter = '') {
        gameReviewsContainer.innerHTML = '';
        const filteredGames = mainGames.filter(game => game.name.toLowerCase().includes(filter.toLowerCase()));
        
        filteredGames.forEach(game => {
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <div class="review-card-content"><h2>${game.name}</h2></div>
            `;
            card.addEventListener('click', () => showGameDetails(game, lang));
            gameReviewsContainer.appendChild(card);
        });
    }

    function setLanguage(lang) {
        document.querySelectorAll('[data-lang-key]').forEach(elem => {
            const key = elem.getAttribute('data-lang-key');
            const translation = translations[lang]?.[key];
            if (translation) {
                if (elem.tagName === 'INPUT') elem.placeholder = translation;
                else elem.textContent = translation;
            }
        });
        localStorage.setItem('language', lang);
        renderHotGames(lang);
        renderMainGames(lang, searchInput.value);
    }

    // --- MODAL LOGIC --- //
    function showGameDetails(game, lang) {
        const currentLang = localStorage.getItem('language') || 'en';
        document.getElementById('modal-game-image').src = game.image;
        document.getElementById('modal-game-title').textContent = game.name;
        document.getElementById('modal-game-description').textContent = translations[currentLang][game.descriptionKey] || 'Description not available.';
        document.getElementById('modal-game-genre').textContent = `${translations[currentLang].genre}: ${game.genre}`;
        document.getElementById('modal-game-playtime').textContent = `${translations[currentLang].playtime}: ${game.playtime}`;
        modal.style.display = 'block';
    }

    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) modal.style.display = 'none';
    });

    // --- SEARCH & AUTO-REFRESH --- //
    searchInput.addEventListener('input', (e) => {
        const currentLang = localStorage.getItem('language') || 'en';
        renderMainGames(currentLang, e.target.value);
    });

    function shuffleAndRefresh() {
        // Fisher-Yates shuffle algorithm
        for (let i = mainGames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mainGames[i], mainGames[j]] = [mainGames[j], mainGames[i]];
        }
        const currentLang = localStorage.getItem('language') || 'en';
        renderMainGames(currentLang, searchInput.value);
    }

    // --- INITIAL LOAD --- //
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    setInterval(shuffleAndRefresh, 60000); // Refresh every 60 seconds
});
