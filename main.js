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
            genre: 'Genre',
            playtime: 'Avg. Playtime',
            // Existing games
            baldursGate3Desc: 'An epic RPG with unparalleled freedom and storytelling, set in the rich world of Dungeons & Dragons.',
            eldenRingDesc: 'A vast, challenging open-world action RPG from FromSoftware, where you explore the Lands Between.',
            cyberpunk2077Desc: 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.',
            lethalCompanyDesc: 'A co-op horror game about scavenging abandoned industrial moons. Work with your crew to survive and meet the Company\'s profit quota.',
            helldivers2Desc: 'A fast-paced, chaotic third-person co-op shooter. Join the Helldivers to fight for freedom across a hostile galaxy.',
            palworldDesc: 'An open-world survival crafting game with creature collection. Befriend mysterious creatures known as \'Pals\' or fight back against a ruthless poaching syndicate.',
            // New games
            gta5Desc: 'Experience the interwoven stories of Franklin, Michael, and Trevor in the sprawling sun-soaked metropolis of Los Santos.',
            rdr2Desc: 'A sweeping tale of honor and loyalty at the dawn of the modern age. Live the life of an outlaw in a vast, atmospheric world.',
            witcher3Desc: 'A story-driven, open-world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.',
            cs2Desc: 'The latest evolution of the world’s most iconic tactical shooter, delivering new features and updated content for years to come.',
            dota2Desc: 'A competitive game of action and strategy, played by millions of fans daily. Choose from a roster of over a hundred heroes.',
            pubgDesc: 'Land, loot, and outwit your opponents to become the last player left standing in a variety of thrilling battlegrounds.',
            apexLegendsDesc: 'A free-to-play hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.',
            valheimDesc: 'A brutal exploration and survival game for 1-10 players, set in a procedurally-generated purgatory inspired by viking culture.',
            rustDesc: 'The only aim in Rust is to survive. To do this you will need to overcome struggles such as hunger, thirst and cold. Build a fire. Build a shelter.',
            terrariaDesc: 'Dig, fight, explore, build! The very world is at your fingertips as you fight for survival, fortune, and glory.',
            fallout4Desc: 'As the sole survivor of Vault 111, you enter a world destroyed by nuclear war. Every second is a fight for survival, and every choice is yours.',
            skyrimDesc: 'Winner of more than 200 Game of the Year Awards, Skyrim Special Edition brings the epic fantasy to life in stunning detail.',
            amongUsDesc: 'An online and local party game of teamwork and betrayal for 4-15 players...in space!',
            stardewValleyDesc: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.',
            hollowKnightDesc: 'Explore a vast, ruined kingdom of insects and heroes. A challenging 2D action-adventure with a beautiful, haunting world.',
            factorioDesc: 'A game about building and creating automated factories to produce items of increasing complexity, within an infinite 2D world.',
            satisfactoryDesc: 'A first-person open-world factory building game with a dash of exploration and combat. Play alone or with friends!',
            deadbyDaylightDesc: 'A multiplayer (4vs1) horror game where one player takes on the role of the savage Killer, and the other four players play as Survivors.',
            warframeDesc: 'A free-to-play, co-op, third-person, looter shooter with a deep and evolving story, set in a sci-fi universe.',
            finalFantasyXIVDesc: 'Take part in an epic and ever-changing Final Fantasy as you adventure and explore with friends from around the world.',
            seaofThievesDesc: 'The essential pirate experience, from sailing and fighting to exploring and looting – everything you need to live the pirate life.',
            noMansSkyDesc: 'Explore a galaxy of unique planets and lifeforms, and constant danger and action. Your voyage will be yours alone.',
            deepRockGalacticDesc: 'A 1-4 player co-op FPS featuring badass space Dwarves, 100% destructible environments, procedurally-generated caves, and endless hordes of alien monsters.',
            subnauticaDesc: 'Descend into the depths of an alien underwater world filled with wonder and peril. Craft equipment, pilot submarines, and out-smart wildlife.',
            arkDesc: 'Stranded on the shores of a mysterious island, you must learn to survive. Use your cunning to kill or tame the primeval creatures roaming the land.',
            rimworldDesc: 'A sci-fi colony sim driven by an intelligent AI storyteller. Generates stories by simulating psychology, ecology, gunplay, melee combat, climate, and more.',
            monsterHunterWorldDesc: 'As a hunter, you\'ll take on quests to hunt monsters in a variety of habitats. Take down these monsters and receive materials that you can use to create stronger weapons and armor.',
            left4Dead2Desc: 'This co-operative action horror FPS takes you and your friends through the cities, swamps and cemeteries of the Deep South, from Savannah to New Orleans.',
            portal2Desc: 'The \"Portal 2\" Perpetual Testing Initiative has been expanded to allow you to design and build puzzles for yourself and your friends!'
        },
        ko: {
            title: '스팀 게임 리뷰',
            searchPlaceholder: '게임을 검색하세요...',
            genre: '장르',
            playtime: '평균 플레이 시간',
            baldursGate3Desc: 'Dungeons & Dragons의 풍부한 세계를 배경으로, 비교할 수 없는 자유와 스토리텔링을 갖춘 대서사시 RPG입니다.',
            eldenRingDesc: 'FromSoftware에서 제작한 광활하고 도전적인 오픈월드 액션 RPG로, \'틈새의 땅\'을 탐험하게 됩니다.',
            cyberpunk2077Desc: '권력, 매력, 신체 개조에 집착하는 거대 도시 나이트 시티를 배경으로 한 오픈월드 액션 어드벤처 스토리입니다.',
            lethalCompanyDesc: '버려진 산업 위성에서 폐물을 수집하는 협동 공포 게임입니다. 동료와 협력하여 생존하고 회사의 이익 할당량을 맞추세요.',
            helldivers2Desc: '빠르고 혼란스러운 3인칭 협동 슈팅 게임입니다. 헬다이버가 되어 적대적인 은하계에서 자유를 위해 싸우세요.',
            palworldDesc: '생물 수집이 가능한 오픈월드 생존 제작 게임입니다. \'팰\'로 알려진 신비한 생물과 친구가 되거나, 무자비한 밀렵 신디케이트에 맞서 싸우세요.',
            gta5Desc: '광활하고 햇살이 내리쬐는 대도시 로스 산토스에서 프랭클린, 마이클, 트레버의 얽히고설킨 이야기를 경험해보세요.',
            rdr2Desc: '현대 시대의 여명기에 펼쳐지는 명예와 충성에 대한 광대한 이야기. 광활하고 분위기 있는 세계에서 무법자의 삶을 살아보세요.',
            witcher3Desc: '의미 있는 선택과 영향력 있는 결과로 가득한, 시각적으로 놀라운 판타지 세계를 배경으로 한 스토리 중심의 오픈월드 RPG입니다.',
            cs2Desc: '세계에서 가장 상징적인 전술 슈팅 게임의 최신 진화 버전으로, 앞으로 몇 년 동안 새로운 기능과 업데이트된 콘텐츠를 제공합니다.',
            dota2Desc: '수백만 명의 팬들이 매일 플레이하는 액션과 전략이 어우러진 경쟁 게임입니다. 100명이 넘는 영웅들 중에서 선택하세요.',
            pubgDesc: '다양하고 스릴 넘치는 전장에서 착륙하고, 약탈하고, 상대를 제압하여 마지막 생존자가 되십시오.',
            apexLegendsDesc: '전설적인 캐릭터들이 강력한 능력을 가지고 팀을 이루어 프론티어의 가장자리에서 명성과 부를 위해 싸우는 무료 플레이 영웅 슈팅 게임입니다.',
            valheimDesc: '바이킹 문화에서 영감을 받은 절차적으로 생성된 연옥을 배경으로 한, 1-10인용 잔혹한 탐험 및 생존 게임입니다.',
            rustDesc: 'Rust의 유일한 목표는 생존입니다. 이를 위해서는 배고픔, 갈증, 추위와 같은 어려움을 극복해야 합니다. 불을 피우고, 쉼터를 건설하세요.',
            terrariaDesc: '파고, 싸우고, 탐험하고, 건설하세요! 생존, 행운, 영광을 위해 싸우는 동안 바로 당신의 손끝에 세상이 있습니다.',
            fallout4Desc: '볼트 111의 유일한 생존자인 당신은 핵전쟁으로 파괴된 세상에 들어갑니다. 매 순간이 생존을 위한 싸움이며, 모든 선택은 당신의 몫입니다.',
            skyrimDesc: '200개 이상의 올해의 게임 상을 수상한 Skyrim Special Edition은 놀라운 디테일로 장대한 판타지에 생명을 불어넣습니다.',
            amongUsDesc: '4-15명의 플레이어를 위한 팀워크와 배신의 온라인 및 로컬 파티 게임... 우주에서!',
            stardewValleyDesc: '당신은 스타듀 밸리에 있는 할아버지의 오래된 농장을 물려받았습니다. 물려받은 도구와 약간의 동전을 가지고 새로운 삶을 시작합니다.',
            hollowKnightDesc: '광대하고 폐허가 된 곤충과 영웅의 왕국을 탐험하세요. 아름답고 잊혀지지 않는 세계를 배경으로 한 도전적인 2D 액션 어드벤처입니다.',
            factorioDesc: '무한한 2D 세계 내에서 점점 더 복잡해지는 아이템을 생산하기 위해 자동화된 공장을 건설하고 만드는 게임입니다.',
            satisfactoryDesc: '탐험과 전투가 가미된 1인칭 오픈월드 공장 건설 게임입니다. 혼자 또는 친구와 함께 플레이하세요!',
            deadbyDaylightDesc: '한 명의 플레이어가 잔인한 살인마 역할을 하고 다른 네 명의 플레이어가 생존자 역할을 하는 멀티플레이어(4vs1) 공포 게임입니다.',
            warframeDesc: '깊고 진화하는 스토리를 가진 공상 과학 세계를 배경으로 한 무료 플레이, 협동, 3인칭, 루트 슈터 게임입니다.',
            finalFantasyXIVDesc: '전 세계의 친구들과 함께 모험하고 탐험하면서 장대하고 끊임없이 변화하는 파이널 판타지에 참여하세요.',
            seaofThievesDesc: '항해와 전투에서 탐험과 약탈에 이르기까지 필수적인 해적 경험 – 해적 생활에 필요한 모든 것.',
            noMansSkyDesc: '독특한 행성과 생명체, 끊임없는 위험과 행동의 은하계를 탐험하세요. 당신의 항해는 당신 혼자만의 것이 될 것입니다.',
            deepRockGalacticDesc: '강력한 우주 드워프, 100% 파괴 가능한 환경, 절차적으로 생성된 동굴, 끝없는 외계 괴물 무리가 등장하는 1-4인용 협동 FPS입니다.',
            subnauticaDesc: '경이로움과 위험으로 가득 찬 외계 수중 세계의 깊은 곳으로 내려가세요. 장비를 제작하고, 잠수함을 조종하고, 야생 동물을 따돌리세요.',
            arkDesc: '신비한 섬의 해안에 좌초된 당신은 생존하는 법을 배워야 합니다. 교활함을 사용하여 땅을 배회하는 원시 생물을 죽이거나 길들이세요.',
            rimworldDesc: '지능적인 AI 스토리텔러가 주도하는 공상 과학 식민지 시뮬레이션. 심리학, 생태학, 총격전, 근접 전투, 기후 등을 시뮬레이션하여 이야기를 생성합니다.',
            monsterHunterWorldDesc: '사냥꾼으로서 당신은 다양한 서식지에서 몬스터를 사냥하는 퀘스트를 수행하게 됩니다. 이 몬스터들을 쓰러뜨리고 더 강한 무기와 갑옷을 만드는 데 사용할 수 있는 재료를 받으세요.',
            left4Dead2Desc: '이 협동 액션 공포 FPS는 당신과 당신의 친구들을 서배너에서 뉴올리언스까지 딥 사우스의 도시, 늪, 묘지를 통과하게 합니다.',
            portal2Desc: '\"Portal 2\" 영구 테스트 이니셔티브가 확장되어 자신과 친구들을 위한 퍼즐을 디자인하고 만들 수 있습니다!'
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
        // Top Sellers & Popular
        { name: 'Counter-Strike 2', descriptionKey: 'cs2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg', genre: 'Tactical Shooter', playtime: '900+ Hours' },
        { name: 'Dota 2', descriptionKey: 'dota2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg', genre: 'MOBA', playtime: '800+ Hours' },
        { name: 'Baldur\'s Gate 3', descriptionKey: 'baldursGate3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', genre: 'RPG', playtime: '100+ Hours' },
        { name: 'Helldivers 2', descriptionKey: 'helldivers2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg', genre: 'Co-op Shooter', playtime: '30-50 Hours' },
        { name: 'Apex Legends', descriptionKey: 'apexLegendsDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg', genre: 'Hero Shooter', playtime: '400+ Hours' },
        { name: 'PUBG: BATTLEGROUNDS', descriptionKey: 'pubgDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg', genre: 'Battle Royale', playtime: '500+ Hours' },
        { name: 'Grand Theft Auto V', descriptionKey: 'gta5Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg', genre: 'Action-Adventure', playtime: '80-150 Hours' },
        { name: 'Rust', descriptionKey: 'rustDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg', genre: 'Survival', playtime: '300+ Hours' },
        { name: 'Warframe', descriptionKey: 'warframeDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg', genre: 'Looter Shooter', playtime: '250+ Hours' },
        { name: 'Red Dead Redemption 2', descriptionKey: 'rdr2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg', genre: 'Action-Adventure', playtime: '60-100 Hours' },
        
        // Critically Acclaimed & Fan Favorites
        { name: 'Elden Ring', descriptionKey: 'eldenRingDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', genre: 'Action RPG', playtime: '80-120 Hours' },
        { name: 'The Witcher 3: Wild Hunt', descriptionKey: 'witcher3Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg', genre: 'Action RPG', playtime: '100-150 Hours' },
        { name: 'Hollow Knight', descriptionKey: 'hollowKnightDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg', genre: 'Metroidvania', playtime: '30-40 Hours' },
        { name: 'Stardew Valley', descriptionKey: 'stardewValleyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg', genre: 'Farming Sim', playtime: '60-100 Hours' },
        { name: 'Terraria', descriptionKey: 'terrariaDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg', genre: 'Sandbox', playtime: '80-120 Hours' },
        { name: 'Portal 2', descriptionKey: 'portal2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg', genre: 'Puzzle-Platformer', playtime: '8-12 Hours' },
        { name: 'The Elder Scrolls V: Skyrim', descriptionKey: 'skyrimDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/489830/header.jpg', genre: 'Action RPG', playtime: '100-200 Hours' },
        
        // Co-op & Survival
        { name: 'Valheim', descriptionKey: 'valheimDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg', genre: 'Survival', playtime: '70-100 Hours' },
        { name: 'Lethal Company', descriptionKey: 'lethalCompanyDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg', genre: 'Co-op Horror', playtime: '10-20 Hours' },
        { name: 'Deep Rock Galactic', descriptionKey: 'deepRockGalacticDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/548430/header.jpg', genre: 'Co-op FPS', playtime: '50-80 Hours' },
        { name: 'Sea of Thieves', descriptionKey: 'seaofThievesDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg', genre: 'Action-Adventure', playtime: '40-70 Hours' },
        { name: 'Among Us', descriptionKey: 'amongUsDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg', genre: 'Social Deduction', playtime: '10+ Hours' },
        { name: 'Dead by Daylight', descriptionKey: 'deadbyDaylightDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg', genre: 'Asymmetrical Horror', playtime: '200+ Hours' },
        { name: 'Left 4 Dead 2', descriptionKey: 'left4Dead2Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg', genre: 'Co-op FPS', playtime: '20-30 Hours' },
        
        // Niche & Strategy
        { name: 'Factorio', descriptionKey: 'factorioDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/427520/header.jpg', genre: 'Automation Sim', playtime: '150+ Hours' },
        { name: 'RimWorld', descriptionKey: 'rimworldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg', genre: 'Colony Sim', playtime: '100-300 Hours' },
        { name: 'Satisfactory', descriptionKey: 'satisfactoryDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/526870/header.jpg', genre: 'Factory Sim', playtime: '80-120 Hours' },
        
        // Other Popular Titles
        { name: 'Cyberpunk 2077', descriptionKey: 'cyberpunk2077Desc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', genre: 'Action RPG', playtime: '50-80 Hours' },
        { name: 'Palworld', descriptionKey: 'palworldDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg', genre: 'Survival Crafting', playtime: '40-60 Hours' },
        { name: 'Final Fantasy XIV Online', descriptionKey: 'finalFantasyXIVDesc', image: 'https://cdn.akamai.steamstatic.com/steam/apps/39210/header.jpg', genre: 'MMORPG', playtime: '500+ Hours' },
    ];

    const gameReviewsContainer = document.getElementById('gameReviews');
    const modal = document.getElementById('game-modal');
    const closeModal = document.querySelector('.close-button');
    const searchInput = document.getElementById('searchInput');

    function renderGameReviews(lang, filter = '') {
        gameReviewsContainer.innerHTML = '';
        const filteredGames = games.filter(game => game.name.toLowerCase().includes(filter.toLowerCase()));

        filteredGames.forEach(game => {
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <div class="review-card-content">
                    <h2>${game.name}</h2>
                </div>
            `;
            card.addEventListener('click', () => showGameDetails(game, lang));
            gameReviewsContainer.appendChild(card);
        });
    }

    function showGameDetails(game, lang) {
        const currentLang = localStorage.getItem('language') || 'en';
        document.getElementById('modal-game-image').src = game.image;
        document.getElementById('modal-game-title').textContent = game.name;
        document.getElementById('modal-game-description').textContent = translations[currentLang][game.descriptionKey] || 'Description not available.';
        document.getElementById('modal-game-genre').textContent = `${translations[currentLang].genre}: ${game.genre}`;
        document.getElementById('modal-game-playtime').textContent = `${translations[currentLang].playtime}: ${game.playtime}`;
        modal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', (e) => {
        const currentLang = localStorage.getItem('language') || 'en';
        renderGameReviews(currentLang, e.target.value);
    });

    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
});
