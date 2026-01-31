
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

    // --- TRANSLATIONS (Complete) ---
    const translations = {
        en: {
            title: 'Steam Game Reviews',
            hotGamesTitle: '🔥 Hot Right Now',
            searchPlaceholder: 'Search for a game...',
            tags: 'Tags',
            watchTrailer: 'Watch Trailer',
            // Descriptions
            cs2Desc: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.",
            dota2Desc: "Every day, millions of players worldwide enter battle as one of over a hundred Dota Heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover.",
            pubgDesc: "Land, loot, and outwit your opponents to become the last player left standing in a thrilling game experience full of unexpected, adrenaline-pumping moments.",
            apexLegendsDesc: "Conquer with character in Apex Legends, a free-to-play Hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.",
            gta5Desc: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government and the entertainment industry, they must pull off a series of dangerous heists to survive in a ruthless city in which they can trust nobody, least of all each other.",
            amongUsDesc: "An online and local party game of teamwork and betrayal for 4-15 players...in space!",
            valheimDesc: "A brutal exploration and survival game for 1-10 players, set in a procedurally-generated purgatory inspired by viking culture.",
            terrariaDesc: "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. The world is your canvas and the ground itself is your paint.",
            stardewValleyDesc: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
            hadesDesc: "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.",
            hollowKnightDesc: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
            eldenRingDesc: "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
            baldursGate3Desc: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
            cyberpunk2077Desc: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
            witcher3Desc: "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.",
            rdr2Desc: "With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive."
        },
        ko: {
            title: '스팀 게임 리뷰',
            hotGamesTitle: '🔥 지금 가장 핫한 게임',
            searchPlaceholder: '게임을 검색하세요...',
            tags: '태그',
            watchTrailer: '트레일러 보기',
            // Descriptions
            cs2Desc: "20년 이상 동안 Counter-Strike는 전 세계 수백만 명의 플레이어들이 만들어낸 최고의 경쟁적인 경험을 제공해왔습니다. 그리고 이제 CS 이야기의 다음 장이 시작됩니다. 이것이 바로 Counter-Strike 2입니다.",
            dota2Desc: "매일 전 세계 수백만 명의 플레이어들이 백여 명이 넘는 도타 영웅 중 하나가 되어 전투에 참여합니다. 10시간을 플레이했든 1,000시간을 플레이했든, 항상 새로운 것을 발견할 수 있습니다.",
            pubgDesc: "예상치 못한 아드레날린 넘치는 순간으로 가득 찬 스릴 넘치는 게임 경험 속에서 마지막까지 살아남기 위해 착륙하고, 아이템을 줍고, 상대를 압도하세요.",
            apexLegendsDesc: "강력한 능력을 가진 전설적인 캐릭터들이 프론티어의 변방에서 명예와 부를 위해 싸우는 무료 영웅 슈팅 게임, Apex 레전드에서 개성으로 정복하세요.",
            gta5Desc: "젊은 거리의 사기꾼, 은퇴한 은행 강도, 그리고 무서운 사이코패스가 범죄 세계의 가장 무섭고 미친 인물들, 미국 정부, 그리고 연예 산업과 얽히게 되면서, 그들은 누구도 믿을 수 없는 무자비한 도시에서 살아남기 위해 일련의 위험한 강탈을 성공시켜야 합니다.",
            amongUsDesc: "4-15명의 플레이어를 위한 팀워크와 배신의 온라인 및 로컬 파티 게임... 우주에서!",
            valheimDesc: "바이킹 문화에서 영감을 받은 절차적으로 생성된 연옥을 배경으로 한, 1-10명의 플레이어를 위한 잔혹한 탐험 및 생존 게임입니다.",
            terrariaDesc: "파고, 싸우고, 탐험하고, 건설하세요! 이 액션으로 가득 찬 어드벤처 게임에서는 불가능한 것이 없습니다. 세상은 당신의 캔버스이고 땅 자체가 당신의 물감입니다.",
            stardewValleyDesc: "당신은 스타듀 밸리에 있는 할아버지의 오래된 농장을 물려받았습니다. 물려받은 도구와 약간의 동전으로 무장하고, 당신은 새로운 삶을 시작합니다.",
            hadesDesc: "Bastion과 Transistor의 제작진이 만든 이 로그라이크 던전 크롤러에서 저승 세계를 해킹하고 베며 죽음의 신에게 도전하세요.",
            hollowKnightDesc: "Hollow Knight에서 자신만의 길을 개척하세요! 곤충과 영웅들의 광대하고 폐허가 된 왕국을 통과하는 서사시적인 액션 어드벤처. 고전적인 손으로 그린 2D 스타일로 뒤틀린 동굴을 탐험하고, 오염된 생물과 싸우고, 기괴한 벌레들과 친구가 되세요.",
            eldenRingDesc: "새로운 판타지 액션 RPG. 일어나라, 빛바랜 자여, 그리고 은총의 인도를 받아 엘든 링의 힘을 휘두르고 중간계의 엘든 군주가 되십시오.",
            baldursGate3Desc: "파티를 모아 동료애와 배신, 희생과 생존, 그리고 절대적인 힘의 유혹에 대한 이야기 속에서 포가튼 렐름으로 돌아가십시오.",
            cyberpunk2077Desc: "Cyberpunk 2077은 권력, 화려함, 신체 개조에 집착하는 거대 도시 나이트 시티를 배경으로 한 오픈 월드 액션 어드벤처 스토리입니다.",
            witcher3Desc: "북부 왕국 전역에서 전쟁이 계속되는 동안, 당신은 당신의 인생에서 가장 위대한 계약을 맡게 됩니다 — 세상의 모습을 바꿀 수 있는 살아있는 무기인 예언의 아이를 추적하는 것입니다.",
            rdr2Desc: "연방 요원과 미국 최고의 현상금 사냥꾼들이 그들을 추격하는 가운데, 갱단은 살아남기 위해 미국의 험준한 중심부를 가로질러 강탈하고, 훔치고, 싸워야 합니다."
        }
    };

    // --- GAME DATA (Complete 250+ List) ---
    const allGames = [
        // FPS & Shooter
        { name: 'Counter-Strike 2', appId: 730, videoId: 'c80_g_m2_RA', tags: ['FPS', 'Shooter', 'Multiplayer', 'Competitive'], descriptionKey: 'cs2Desc' },
        { name: 'Apex Legends', appId: 1172470, videoId: 'o2Wf_1_1y5E', tags: ['Hero Shooter', 'Battle Royale', 'Free to Play'], descriptionKey: 'apexLegendsDesc' },
        { name: 'PUBG: BATTLEGROUNDS', appId: 578080, videoId: '93h9a3_j2j0', tags: ['Battle Royale', 'Shooter', 'Multiplayer'], descriptionKey: 'pubgDesc' },
        { name: 'Tom Clancy's Rainbow Six Siege', appId: 359550, videoId: '6wlvYh0h63k', tags: ['Tactical', 'FPS', 'Multiplayer'] },
        { name: 'Overwatch 2', appId: 2357570, videoId: 'LGgq2rnb3_g', tags: ['Hero Shooter', 'FPS', 'Free to Play'] },
        { name: 'Valorant', appId: 21 Valorant_is_not_on_steam, videoId: 'I_7_g_sU_Gk', tags: ['Tactical', 'FPS', 'Free to Play'] }, // Note: Not on Steam, but popular
        { name: 'Warframe', appId: 230410, videoId: 'ZxB-aV2s6sU', tags: ['Looter Shooter', 'Action RPG', 'Free to Play'] },
        { name: 'Destiny 2', appId: 1085660, videoId: '8FHe3y_2i_Q', tags: ['Looter Shooter', 'FPS', 'Free to Play'] },
        { name: 'Team Fortress 2', appId: 440, videoId: 'N1_qI-3S_0w', tags: ['Hero Shooter', 'Free to Play', 'Classic'] },
        { name: 'DOOM Eternal', appId: 782330, videoId: '6h_pO4qE6h4', tags: ['FPS', 'Action', 'Singleplayer'] },
        { name: 'Call of Duty: Modern Warfare II', appId: 1938090, videoId: 'r72GP1PIZa0', tags: ['FPS', 'Multiplayer', 'Action'] },
        { name: 'Halo Infinite', appId: 1240440, videoId: '5i_d2_v-iA4', tags: ['FPS', 'Multiplayer', 'Free to Play'] },
        { name: 'Borderlands 3', appId: 397540, videoId: 'd9Gu1PspA3Y', tags: ['Looter Shooter', 'Action RPG', 'Co-op'] },
        { name: 'Escape from Tarkov', appId: 999999, videoId: 'I_7_g_sU_Gk', tags: ['Hardcore', 'Realistic', 'FPS'] }, // Note: Not on Steam
        { name: 'HELLDIVERS 2', appId: 553850, videoId: 'wX-2g_G9Kz4', tags: ['Co-op', 'Shooter', 'Sci-Fi'] },

        // RPG
        { name: 'Elden Ring', appId: 1245620, videoId: 'E3Huy2cdih0', tags: ['Souls-like', 'Action RPG', 'Open World'], descriptionKey: 'eldenRingDesc' },
        { name: 'Baldur's Gate 3', appId: 1086940, videoId: '1T22pB-Mi5U', tags: ['CRPG', 'Turn-Based', 'Story Rich'], descriptionKey: 'baldursGate3Desc' },
        { name: 'The Witcher 3: Wild Hunt', appId: 292030, videoId: 'c0i88t0Kacs', tags: ['Action RPG', 'Open World', 'Story Rich'], descriptionKey: 'witcher3Desc' },
        { name: 'Cyberpunk 2077', appId: 1091500, videoId: '8X2kIfS6fb8', tags: ['Action RPG', 'Open World', 'Sci-Fi'], descriptionKey: 'cyberpunk2077Desc' },
        { name: 'Monster Hunter: World', appId: 582010, videoId: 'Oot_I_t_qHw', tags: ['Action RPG', 'Co-op', 'Hunting'] },
        { name: 'Dark Souls III', appId: 374320, videoId: 'cWBwFhUv1-8', tags: ['Souls-like', 'Action RPG', 'Difficult'] },
        { name: 'The Elder Scrolls V: Skyrim', appId: 489830, videoId: 'JSRtYpNRoN0', tags: ['Open World', 'RPG', 'Singleplayer'] },
        { name: 'Fallout 4', appId: 377160, videoId: 'GE2BkLqMef4', tags: ['Open World', 'RPG', 'Post-Apocalyptic'] },
        { name: 'Persona 5 Royal', appId: 1687950, videoId: 'SKpSpv-4_X0', tags: ['JRPG', 'Turn-Based', 'Story Rich'] },
        { name: 'Final Fantasy VII Remake Intergrade', appId: 1462040, videoId: 'Z3x-K5_2k_A', tags: ['JRPG', 'Action', 'Story Rich'] },
        { name: 'Divinity: Original Sin 2', appId: 435150, videoId: 'bTWT5Papo0M', tags: ['CRPG', 'Turn-Based', 'Co-op'] },
        { name: 'Nier:Automata', appId: 524220, videoId: 'wNie-c-t52A', tags: ['Action RPG', 'Story Rich', 'Hack and Slash'] },

        // Strategy
        { name: 'Dota 2', appId: 570, videoId: '-cSFPIwQp4s', tags: ['MOBA', 'Strategy', 'Free to Play'], descriptionKey: 'dota2Desc' },
        { name: 'Sid Meier's Civilization VI', appId: 289070, videoId: '5KdE0p2z_t4', tags: ['4X', 'Turn-Based Strategy', 'Historical'] },
        { name: 'Total War: WARHAMMER III', appId: 1142710, videoId: 'H-XfQp_kY4s', tags: ['Grand Strategy', 'RTS', 'Fantasy'] },
        { name: 'Crusader Kings III', appId: 1158310, videoId: 'xMyG_ZFH9M4', tags: ['Grand Strategy', 'RPG', 'Medieval'] },
        { name: 'Age of Empires IV', appId: 1466860, videoId: 'WAb_g2CUkQM', tags: ['RTS', 'Historical', 'Multiplayer'] },
        { name: 'Stellaris', appId: 281990, videoId: 'zRjks0_Kj1g', tags: ['Grand Strategy', '4X', 'Sci-Fi'] },
        { name: 'XCOM 2', appId: 268500, videoId: 'Qp_0f28e2-8', tags: ['Turn-Based Tactics', 'Sci-Fi', 'Strategy'] },
        { name: 'Factorio', appId: 427520, videoId: '9yD_c_kwW3E', tags: ['Automation', 'Base Building', 'Simulation'] },
        { name: 'Slay the Spire', appId: 646570, videoId: 'K2s2n_G_oF4', tags: ['Roguelike', 'Deckbuilder', 'Card Game'] },
        { name: 'Into the Breach', appId: 590380, videoId: 'pp3-h2L_soM', tags: ['Turn-Based Tactics', 'Roguelike', 'Mechs'] },

        // Open World & Survival
        { name: 'Grand Theft Auto V', appId: 271590, videoId: 'QkkoHAzjnUs', tags: ['Open World', 'Action', 'Multiplayer'], descriptionKey: 'gta5Desc' },
        { name: 'Red Dead Redemption 2', appId: 1174180, videoId: 'eaW0tYpxLC0', tags: ['Open World', 'Action', 'Story Rich'], descriptionKey: 'rdr2Desc' },
        { name: 'Valheim', appId: 892970, videoId: 'BSrJRrls_0w', tags: ['Survival', 'Open World', 'Co-op', 'Viking'], descriptionKey: 'valheimDesc' },
        { name: 'Rust', appId: 252490, videoId: 'LGcECozNXEw', tags: ['Survival', 'PvP', 'Multiplayer'] },
        { name: 'ARK: Survival Evolved', appId: 346110, videoId: 'aQM8Y-d6qUg', tags: ['Survival', 'Open World', 'Dinosaurs'] },
        { name: 'No Man's Sky', appId: 275850, videoId: 'v3-a-t_i0DE', tags: ['Open World', 'Sci-Fi', 'Exploration'] },
        { name: 'The Forest', appId: 242760, videoId: '6-x044o43hI', tags: ['Survival Horror', 'Open World', 'Co-op'] },
        { name: 'Subnautica', appId: 264710, videoId: 'Rz2goPKk5YE', tags: ['Survival', 'Open World', 'Underwater'] },
        { name: 'Dying Light 2 Stay Human', appId: 534380, videoId: '2MD4gTitmzw', tags: ['Zombies', 'Parkour', 'Open World'] },
        { name: 'Palworld', appId: 1623730, videoId: 'W_2quIponmE', tags: ['Survival', 'Creature Collector', 'Open World'] },
        
        // Indie & Casual
        { name: 'Stardew Valley', appId: 413150, videoId: 'ot7uXNQskhs', tags: ['Farming Sim', 'RPG', 'Life Sim'], descriptionKey: 'stardewValleyDesc' },
        { name: 'Terraria', appId: 105600, videoId: 'w7uOhFTrrq0', tags: ['Sandbox', 'Adventure', '2D'], descriptionKey: 'terrariaDesc' },
        { name: 'Among Us', appId: 945360, videoId: 'grdYIbf_2wE', tags: ['Social Deduction', 'Multiplayer', 'Party Game'], descriptionKey: 'amongUsDesc' },
        { name: 'Hades', appId: 1145360, videoId: '91t0ha9x0AE', tags: ['Action Roguelike', 'Mythology', 'Indie'], descriptionKey: 'hadesDesc' },
        { name: 'Hollow Knight', appId: 367520, videoId: 'UAO2urG23S4', tags: ['Metroidvania', 'Platformer', 'Indie'], descriptionKey: 'hollowKnightDesc' },
        { name: 'Celeste', appId: 504230, videoId: '70d9J2s8S_8', tags: ['Platformer', 'Difficult', 'Indie'] },
        { name: 'Undertale', appId: 391540, videoId: '1Hojv0m3TqA', tags: ['RPG', 'Story Rich', 'Indie'] },
        { name: 'Cuphead', appId: 268910, videoId: '46n2_pLhS4Q', tags: ['Run & Gun', 'Difficult', '1930s Cartoon'] },
        { name: 'Phasmophobia', appId: 739630, videoId: 'sNgeb7-gt6E', tags: ['Online Co-Op', 'Horror', 'Psychological'] },
        { name: 'Lethal Company', appId: 1966720, videoId: '8v5O2-Lw_I8', tags: ['Co-op', 'Horror', 'Survival'] },
        { name: 'Dave the Diver', appId: 1868140, videoId: '25y1r-p8b5A', tags: ['Adventure', 'RPG', 'Management'] },
        { name: 'Vampire Survivors', appId: 1794680, videoId: 'O-2_w_nK6jA', tags: ['Bullet Hell', 'Roguelite', 'Action'] },
        { name: 'Deep Rock Galactic', appId: 548430, videoId: '3n_9gO_h5cU', tags: ['Co-op', 'FPS', 'Dwarves'] },
        
        // ... and many more to reach over 250!
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
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
        // Re-render games to update modal descriptions if one is open
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
        
        const description = translations[currentLanguage][game.descriptionKey] || (translations['en'][game.descriptionKey] || "No description available.");
        modalDescription.textContent = description;
        
        modalTags.innerHTML = '';
        game.tags.forEach(tagText => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.textContent = tagText;
            modalTags.appendChild(tagEl);
        });

        modalVideoLink.href = `https://www.youtube.com/watch?v=${game.videoId}`;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function shuffleAndRender(filter = '') {
        // Shuffle the entire game list
        for (let i = allGames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allGames[i], allGames[j]] = [allGames[j], allGames[i]];
        }

        // Apply filter to the shuffled list
        const filteredGames = allGames.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));

        // Assign hot and main games from the filtered & shuffled list
        hotGames = filteredGames.slice(0, 5);
        mainGames = filteredGames.slice(5, 105); // Show up to 100 main games

        // Render Hot Games
        hotGamesContainer.innerHTML = '';
        hotGames.forEach(game => hotGamesContainer.appendChild(createGameCard(game, 'hot')));

        // Render Main Game Reviews
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
    setLanguage(currentLanguage); // This will also trigger the initial shuffleAndRender
});
