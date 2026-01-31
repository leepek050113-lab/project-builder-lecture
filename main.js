
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
    let hotGames = [];
    let mainGames = [];

    // --- TRANSLATIONS (Now with all descriptions!) ---
    const translations = {
        en: {
            title: 'Steam Game Reviews',
            hotGamesTitle: '🔥 Hot Right Now',
            searchPlaceholder: 'Search for a game...',
            tags: 'Tags',
            watchTrailer: 'Watch Trailer',
            // Descriptions A-Z
            apexLegendsDesc: "Conquer with character in Apex Legends, a free-to-play Hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.",
            arkDesc: "Stranded on the shores of a mysterious island, you must learn to survive. Use your cunning to kill or tame the primeval creatures roaming the land, and encounter other players to survive, dominate... and escape!",
            amongUsDesc: "An online and local party game of teamwork and betrayal for 4-15 players...in space!",
            baldursGate3Desc: "Gather your party, and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
            cs2Desc: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.",
            cyberpunk2077Desc: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
            civ6Desc: "Build an empire to stand the test of time in the latest installment of the award-winning Civilization franchise. Choose a leader and pursue one of five ways to achieve victory.",
            destiny2Desc: "Dive into the world of Destiny 2 to explore the mysteries of the solar system and experience responsive first-person shooter combat. Unlock powerful elemental abilities and collect unique gear to customize your Guardian's look and playstyle.",
            dota2Desc: "Every day, millions of players worldwide enter battle as one of over a hundred Dota Heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover.",
            eldenRingDesc: "THE NEW FANTASY ACTION RPG. Arise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
            fallout4Desc: "As the sole survivor of Vault 111, you enter a world destroyed by nuclear war. Every second is a fight for survival, and every choice is yours. Only you can rebuild and determine the fate of the Wasteland.",
            gmodDesc: "Garry's Mod is a physics sandbox. There aren't any predefined aims or goals. We give you the tools and leave you to play.",
            gta5Desc: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, they must pull off a series of dangerous heists to survive.",
            helldivers2Desc: "The Galaxy’s Last Line of Offence. Enlist in the Helldivers and join the fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.",
            lethalCompanyDesc: "You are a contracted worker for the Company. Your job is to collect scrap from abandoned, industrialized moons to meet the Company's profit quota. You can use the cash you earn to travel to new moons with higher risks and rewards.",
            palworldDesc: "Fight, farm, build and work alongside mysterious creatures called \"Pals\" in this completely new multiplayer, open world survival and crafting game!",
            pubgDesc: "Land, loot, and outwit your opponents to become the last player left standing in a thrilling game experience full of unexpected, adrenaline-pumping moments.",
            rdr2Desc: "Winner of over 175 Game of the Year Awards, Red Dead Redemption 2 is an epic tale of honor and loyalty at the dawn of the modern age.",
            rainbowSixSiegeDesc: "Master the art of destruction and gadgetry in Tom Clancy's Rainbow Six Siege. Face intense close-quarters combat, high lethality, tactical decision making, team play, and explosive action within every moment.",
            rustDesc: "The only aim in Rust is to survive. To do this you will need to overcome struggles such as hunger, thirst and cold. Build a fire. Build a shelter. Kill animals. Protect yourself from other players.",
            skyrimDesc: "The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic.",
            stardewValleyDesc: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
            terrariaDesc: "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. The world is your canvas and the ground itself is your paint.",
            tf2Desc: "Nine distinct classes provide a broad range of tactical abilities and personalities. Constantly updated with new game modes, maps, equipment and, most importantly, hats!",
            valheimDesc: "A brutal exploration and survival game for 1-10 players, set in a procedurally-generated purgatory inspired by viking culture. Battle, build, and conquer your way to a saga worthy of Odin’s patronage!",
            warframeDesc: "Join the Tenno and defend an ever-expanding universe. Wield your Warframe's tactical abilities, craft a loadout of devastating weaponry and define your playstyle to become an unstoppable force in this genre-defining looter-shooter.",
            witcher3Desc: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy."
        },
        ko: {
            title: '스팀 게임 리뷰',
            hotGamesTitle: '🔥 지금 가장 핫한 게임',
            searchPlaceholder: '게임을 검색하세요...',
            tags: '태그',
            watchTrailer: '트레일러 보기',
            // Descriptions A-Z (Korean)
            apexLegendsDesc: "전설적인 캐릭터들이 강력한 능력을 사용하여 프론티어의 변방에서 명예와 부를 위해 싸우는 무료 영웅 슈팅 게임, Apex 레전드에서 개성으로 정복하세요.",
            arkDesc: "신비한 섬의 해안에 좌초된 당신은 생존하는 법을 배워야 합니다. 교활함을 사용하여 땅을 배회하는 원시 생물을 죽이거나 길들이고, 다른 플레이어와 만나 생존하고, 지배하고... 탈출하세요!",
            amongUsDesc: "4-15명의 플레이어를 위한 팀워크와 배신에 대한 온라인 및 로컬 파티 게임... 우주에서!",
            baldursGate3Desc: "파티를 모으고, 동료애와 배신, 희생과 생존, 그리고 절대적인 힘의 유혹에 대한 이야기 속에서 포가튼 릴름으로 돌아가세요.",
            cs2Desc: "20년 이상 동안 Counter-Strike는 전 세계 수백만 명의 플레이어들이 만들어낸 최고의 경쟁적인 경험을 제공해왔습니다. 그리고 이제 CS 이야기의 다음 장이 시작됩니다. 이것이 바로 Counter-Strike 2입니다.",
            cyberpunk2077Desc: "사이버펑크 2077은 권력, 매력, 신체 개조에 집착하는 거대 도시 나이트 시티를 배경으로 하는 오픈 월드, 액션 어드벤처 이야기입니다.",
            civ6Desc: "수상 경력에 빛나는 문명 프랜차이즈의 최신작에서 시간의 시험을 견딜 제국을 건설하세요. 지도자를 선택하고 승리를 달성하기 위한 다섯 가지 방법 중 하나를 추구하세요.",
            destiny2Desc: "데스티니 2의 세계로 뛰어들어 태양계의 미스터리를 탐험하고 반응이 빠른 1인칭 슈팅 전투를 경험하세요. 강력한 원소 능력을 잠금 해제하고 독특한 장비를 수집하여 수호자의 외모와 플레이 스타일을 맞춤 설정하세요.",
            dota2Desc: "매일 전 세계 수백만 명의 플레이어들이 백여 명이 넘는 도타 영웅 중 하나가 되어 전투에 참여합니다. 10시간을 플레이했든 1,000시간을 플레이했든, 항상 새로운 것을 발견할 수 있습니다.",
            eldenRingDesc: "새로운 판타지 액션 RPG. 일어나라, 빛바랜 자여, 그리고 은총에 의해 인도받아 엘든 링의 힘을 휘두르고 중간계의 엘든 로드가 되어라.",
            fallout4Desc: "볼트 111의 유일한 생존자인 당신은 핵전쟁으로 파괴된 세계로 들어갑니다. 매 순간이 생존을 위한 싸움이며, 모든 선택은 당신의 것입니다. 오직 당신만이 황무지를 재건하고 운명을 결정할 수 있습니다.",
            gmodDesc: "Garry's Mod는 물리 샌드박스입니다. 미리 정의된 목표나 목적은 없습니다. 우리는 당신에게 도구를 제공하고 당신이 놀도록 내버려 둡니다.",
            gta5Desc: "젊은 거리의 사기꾼, 은퇴한 은행 강도, 그리고 무서운 사이코패스가 범죄 세계의 가장 무섭고 미친 인물들, 미국 정부, 그리고 연예 산업과 얽히게 되면서, 그들은 살아남기 위해 위험한 강탈을 성공시켜야 합니다.",
            helldivers2Desc: "은하계의 마지막 방어선. 헬다이버에 입대하여 빠르고, 정신없고, 맹렬한 3인칭 슈팅 게임에서 적대적인 은하계를 가로질러 자유를 위한 싸움에 참여하세요.",
            lethalCompanyDesc: "당신은 회사의 계약직 노동자입니다. 당신의 임무는 버려진 산업화된 달에서 고철을 수집하여 회사의 이익 할당량을 맞추는 것입니다. 벌어들인 현금을 사용하여 더 높은 위험과 보상이 있는 새로운 달로 여행할 수 있습니다.",
            palworldDesc: "완전히 새로운 멀티플레이어, 오픈 월드 생존 및 제작 게임에서 \"팰\"이라고 불리는 신비한 생물과 함께 싸우고, 농사를 짓고, 건설하고, 일하세요!",
            pubgDesc: "예상치 못한 아드레날린 넘치는 순간으로 가득 찬 스릴 넘치는 게임 경험 속에서 마지막까지 살아남기 위해 착륙하고, 아이템을 줍고, 상대를 압도하세요.",
            rdr2Desc: "175개 이상의 올해의 게임 상을 수상한 Red Dead Redemption 2는 현대 시대의 여명기에 펼쳐지는 명예와 충성에 대한 장대한 이야기입니다.",
            rainbowSixSiegeDesc: "Tom Clancy's Rainbow Six Siege에서 파괴와 장비 기술의 대가가 되십시오. 매 순간 강렬한 근접 전투, 높은 치사율, 전술적 의사 결정, 팀 플레이 및 폭발적인 액션에 직면하십시오.",
            rustDesc: "Rust의 유일한 목표는 생존하는 것입니다. 이를 위해 배고픔, 갈증, 추위와 같은 어려움을 극복해야 합니다. 불을 피우고, 피난처를 짓고, 동물을 죽이고, 다른 플레이어로부터 자신을 보호하세요.",
            skyrimDesc: "높은 기대를 받는 Elder Scrolls 시리즈의 다음 장이 2006년과 2008년 올해의 게임을 만든 Bethesda Game Studios에서 도착했습니다. Skyrim은 오픈 월드 판타지 서사시를 재창조하고 혁신합니다.",
            stardewValleyDesc: "당신은 스타듀 밸리에 있는 할아버지의 오래된 농장을 물려받았습니다. 물려받은 도구와 약간의 동전으로 무장하고, 당신은 새로운 삶을 시작합니다.",
            terrariaDesc: "파고, 싸우고, 탐험하고, 건설하세요! 이 액션으로 가득 찬 어드벤처 게임에서는 불가능한 것이 없습니다. 세상은 당신의 캔버스이고 땅 자체가 당신의 물감입니다.",
            tf2Desc: "9개의 독특한 클래스는 광범위한 전술적 능력과 개성을 제공합니다. 새로운 게임 모드, 맵, 장비, 그리고 가장 중요하게는 모자로 계속 업데이트됩니다!",
            valheimDesc: "바이킹 문화에서 영감을 받은 절차적으로 생성된 연옥을 배경으로 하는 1-10인용 잔혹한 탐험 및 생존 게임. 오딘의 후원을 받을 만한 사가를 향해 전투하고, 건설하고, 정복하세요!",
            warframeDesc: "텐노에 합류하여 끊임없이 확장되는 우주를 방어하세요. 워프레임의 전술적 능력을 사용하고, 파괴적인 무기 로드아웃을 제작하고, 플레이 스타일을 정의하여 이 장르를 정의하는 루터 슈터에서 멈출 수 없는 힘이 되십시오.",
            witcher3Desc: "당신은 용병 몬스터 사냥꾼인 리비아의 게롤트입니다. 당신 앞에는 마음대로 탐험할 수 있는 전쟁으로 폐허가 되고 괴물들이 들끓는 대륙이 있습니다. 현재 계약은? 예언의 아이, 시리를 추적하는 것입니다."
        }
    };

    // --- GAME DATA (All games linked to a description) ---
    const allGames = [
        { name: 'Counter-Strike 2', appId: 730, videoId: 'c80_g_m2_RA', tags: ['FPS', 'Shooter', 'Multiplayer', 'Competitive'], descriptionKey: 'cs2Desc' },
        { name: 'Dota 2', appId: 570, videoId: '-cSFPIwQp4s', tags: ['MOBA', 'Strategy', 'Free to Play'], descriptionKey: 'dota2Desc' },
        { name: 'PUBG: BATTLEGROUNDS', appId: 578080, videoId: '93h9a3_j2j0', tags: ['Battle Royale', 'Shooter', 'Multiplayer'], descriptionKey: 'pubgDesc' },
        { name: 'Apex Legends', appId: 1172470, videoId: 'o2Wf_1_1y5E', tags: ['Hero Shooter', 'Battle Royale', 'Free to Play'], descriptionKey: 'apexLegendsDesc' },
        { name: 'Grand Theft Auto V', appId: 271590, videoId: 'QkkoHAzjnUs', tags: ['Open World', 'Action', 'Multiplayer'], descriptionKey: 'gta5Desc' },
        { name: 'Stardew Valley', appId: 413150, videoId: 'ot7uXNQskhs', tags: ['Farming Sim', 'RPG', 'Life Sim'], descriptionKey: 'stardewValleyDesc' },
        { name: 'Tom Clancy\'s Rainbow Six Siege', appId: 359550, videoId: '6wlvYh0h63k', tags: ['Tactical', 'FPS', 'Multiplayer'], descriptionKey: 'rainbowSixSiegeDesc' },
        { name: 'Rust', appId: 252490, videoId: 'LGcECozNXEw', tags: ['Survival', 'PvP', 'Multiplayer'], descriptionKey: 'rustDesc' },
        { name: 'Warframe', appId: 230410, videoId: 'ZxB-aV2s6sU', tags: ['Looter Shooter', 'Action RPG', 'Free to Play'], descriptionKey: 'warframeDesc' },
        { name: 'Destiny 2', appId: 1085660, videoId: '8FHe3y_2i_Q', tags: ['Looter Shooter', 'FPS', 'Free to Play'], descriptionKey: 'destiny2Desc' },
        { name: 'Team Fortress 2', appId: 440, videoId: 'N1_qI-3S_0w', tags: ['Hero Shooter', 'Free to Play', 'Classic'], descriptionKey: 'tf2Desc' },
        { name: 'Sid Meier\'s Civilization VI', appId: 289070, videoId: '5KdE0p2z_t4', tags: ['4X', 'Turn-Based Strategy', 'Historical'], descriptionKey: 'civ6Desc' },
        { name: 'The Witcher 3: Wild Hunt', appId: 292030, videoId: 'c0i88t0Kacs', tags: ['Action RPG', 'Open World', 'Story Rich'], descriptionKey: 'witcher3Desc' },
        { name: 'Terraria', appId: 105600, videoId: 'w7uOhFTrrq0', tags: ['Sandbox', 'Adventure', '2D'], descriptionKey: 'terrariaDesc' },
        { name: 'Garry\'s Mod', appId: 4000, videoId: 'hpjV962DLws', tags: ['Sandbox', 'Physics', 'Multiplayer'], descriptionKey: 'gmodDesc' },
        { name: 'ARK: Survival Evolved', appId: 346110, videoId: 'aQM8Y-d6qUg', tags: ['Survival', 'Open World', 'Dinosaurs'], descriptionKey: 'arkDesc' },
        { name: 'Fallout 4', appId: 377160, videoId: 'GE2BkLqMef4', tags: ['Open World', 'RPG', 'Post-Apocalyptic'], descriptionKey: 'fallout4Desc' },
        { name: 'The Elder Scrolls V: Skyrim', appId: 489830, videoId: 'JSRtYpNRoN0', tags: ['Open World', 'RPG', 'Singleplayer'], descriptionKey: 'skyrimDesc' },
        { name: 'Among Us', appId: 945360, videoId: 'grdYIbf_2wE', tags: ['Social Deduction', 'Multiplayer', 'Party Game'], descriptionKey: 'amongUsDesc' },
        { name: 'Valheim', appId: 892970, videoId: 'BSrJRrls_0w', tags: ['Survival', 'Open World', 'Co-op', 'Viking'], descriptionKey: 'valheimDesc' },
        { name: 'Red Dead Redemption 2', appId: 1174180, videoId: 'eaW0tYpxLC0', tags: ['Open World', 'Action', 'Story Rich'], descriptionKey: 'rdr2Desc' },
        { name: 'Cyberpunk 2077', appId: 1091500, videoId: '8X2kIfS6fb8', tags: ['Action RPG', 'Open World', 'Sci-Fi'], descriptionKey: 'cyberpunk2077Desc' },
        { name: 'Elden Ring', appId: 1245620, videoId: 'E3Huy2cdih0', tags: ['Souls-like', 'Action RPG', 'Open World'], descriptionKey: 'eldenRingDesc' },
        { name: 'Baldur\'s Gate 3', appId: 1086940, videoId: '1T22pB-Mi5U', tags: ['CRPG', 'Turn-Based', 'Story Rich'], descriptionKey: 'baldursGate3Desc' },
        { name: 'HELLDIVERS 2', appId: 553850, videoId: 'wX-2g_G9Kz4', tags: ['Co-op', 'Shooter', 'Sci-Fi'], descriptionKey: 'helldivers2Desc' },
        { name: 'Lethal Company', appId: 1966720, videoId: '8v5O2-Lw_I8', tags: ['Co-op', 'Horror', 'Survival'], descriptionKey: 'lethalCompanyDesc' },
        { name: 'Palworld', appId: 1623730, videoId: 'W_2quIponmE', tags: ['Survival', 'Creature Collector', 'Open World'], descriptionKey: 'palworldDesc' }
    ];
    
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
        // Re-render game cards to update any text if needed
        renderGames(); 
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
        
        const description = (translations[currentLanguage] && translations[currentLanguage][game.descriptionKey]) 
                            || (translations['en'][game.descriptionKey] 
                            || "Description not available.");
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
        
        // Render hot games (never changes after initial load)
        hotGamesContainer.innerHTML = '';
        hotGames.filter(g => g.name.toLowerCase().includes(lowerFilter))
                .forEach(game => hotGamesContainer.appendChild(createGameCard(game, 'hot')));

        // Render main games
        gameReviewsContainer.innerHTML = '';
        mainGames.filter(g => g.name.toLowerCase().includes(lowerFilter))
                 .forEach(game => gameReviewsContainer.appendChild(createGameCard(game, 'main')));
    }
    
    function initialLoad() {
        let shuffledGames = [...allGames];
        shuffleArray(shuffledGames);
        
        hotGames = shuffledGames.slice(0, 10);
        mainGames = shuffledGames.slice(10);
        
        applyTheme(currentTheme);
        applyLanguage(currentLanguage);
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
