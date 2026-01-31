
const allGames = [
    // ... (existing games) ...
    { name: 'Monster Hunter: World', appId: 582010, videoId: 'XP-VqK6iS6s', tags: ['Action RPG', 'Co-op', 'Open World'], descriptionKey: 'monsterHunterWorldDesc' },
    { name: 'Left 4 Dead 2', appId: 550, videoId: 'g4D21G_2T1g', tags: ['Co-op', 'Zombies', 'FPS', 'Action'], descriptionKey: 'left4Dead2Desc' },
    { name: 'Hades', appId: 1145360, videoId: '91t0ha9x0AE', tags: ['Action Roguelike', 'Indie', 'Mythology'], descriptionKey: 'hadesDesc' },
    { name: 'The Binding of Isaac: Rebirth', appId: 250900, videoId: 'brh_iC2KQiQ', tags: ['Roguelike', 'Dungeon Crawler', 'Indie'], descriptionKey: 'bindingOfIsaacDesc' },
    { name: 'Hollow Knight', appId: 367520, videoId: 'UAO2urG23S4', tags: ['Metroidvania', 'Platformer', 'Indie', 'Souls-like'], descriptionKey: 'hollowKnightDesc' },
    { name: 'Dead by Daylight', appId: 381210, videoId: 'J_uF_OKI_4k', tags: ['Horror', 'Survival', 'Multiplayer', 'Asymmetrical'], descriptionKey: 'deadByDaylightDesc' },
    { name: 'Phasmophobia', appId: 739630, videoId: 'sN2-a4VfT1E', tags: ['Horror', 'Co-op', 'VR', 'Psychological Horror'], descriptionKey: 'phasmophobiaDesc' },
    { name: 'Don\'t Starve Together', appId: 322330, videoId: 'bV1HcOf_v2A', tags: ['Survival', 'Co-op', 'Crafting', 'Indie'], descriptionKey: 'dontStarveTogetherDesc' },
    { name: 'Factorio', appId: 427520, videoId: 'KVvXv1Z6rws', tags: ['Automation', 'Base Building', 'Simulation', 'Strategy'], descriptionKey: 'factorioDesc' },
    { name: 'Slay the Spire', appId: 646570, videoId: 'C9wMC-2P04c', tags: ['Deckbuilder', 'Roguelike', 'Card Game', 'Strategy'], descriptionKey: 'slayTheSpireDesc' },
    { name: 'RimWorld', appId: 294100, videoId: '3tDrxO-w_6w', tags: ['Colony Sim', 'Survival', 'Base Building', 'Strategy'], descriptionKey: 'rimworldDesc' },
    { name: 'Subnautica', appId: 264710, videoId: 'Rz2SNm8VguE', tags: ['Survival', 'Open World', 'Underwater', 'Exploration'], descriptionKey: 'subnauticaDesc' },
    { name: 'Human: Fall Flat', appId: 477160, videoId: 'S_YQ_v-sX_A', tags: ['Physics', 'Puzzle', 'Co-op', 'Funny'], descriptionKey: 'humanFallFlatDesc' },
    { name: 'Euro Truck Simulator 2', appId: 227300, videoId: 'xlTuC18xVII', tags: ['Simulation', 'Driving', 'Relaxing', 'Open World'], descriptionKey: 'euroTruckSimulator2Desc' },
    { name: 'Cities: Skylines', appId: 255710, videoId: '0gI2N1Iejww', tags: ['City Builder', 'Simulation', 'Strategy', 'Management'], descriptionKey: 'citiesSkylinesDesc' }
];

const translations = {
    en: {
        // ... (existing translations) ...
        monsterHunterWorldDesc: "Welcome to a new world! In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world teeming with surprises and excitement.",
        left4Dead2Desc: "Set in the zombie apocalypse, Left 4 Dead 2 (L4D2) is the highly anticipated sequel to the award-winning Left 4 Dead, the #1 co-op game of 2008. This co-operative action horror FPS takes you and your friends through the cities, swamps and cemeteries of the Deep South, from Savannah to New Orleans.",
        hadesDesc: "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.",
        bindingOfIsaacDesc: "The Binding of Isaac: Rebirth is a randomly generated action RPG shooter with heavy Rogue-like elements. Following Isaac on his journey players will find bizarre treasures that change Isaac’s form giving him super human abilities and enabling him to fight off droves of mysterious creatures.",
        hollowKnightDesc: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
        deadByDaylightDesc: "Dead by Daylight is a multiplayer (4vs1) horror game where one player takes on the role of the savage Killer, and the other four players play as Survivors, trying to escape the Killer and avoid being caught, tortured and killed.",
        phasmophobiaDesc: "Phasmophobia is a 4 player online co-op psychological horror where you and your team members of paranormal investigators will enter haunted locations filled with paranormal activity and gather as much evidence of the paranormal as you can.",
        dontStarveTogetherDesc: "A multiplayer expansion for the uncompromising wilderness survival game, Don't Starve. Cooperate with your friends in a private game, or take your chances with strangers online. Work with other players to survive the harsh environment, or strike out on your own.",
        factorioDesc: "Factorio is a game about building and creating automated factories to produce items of increasing complexity, within an infinite 2D world. Use your imagination to design your factory, combine simple elements into ingenious structures, and finally protect it from the creatures who don't really like you.",
        slayTheSpireDesc: "We fused card games and roguelikes together to make the best single player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!",
        rimworldDesc: "RimWorld is a sci-fi colony sim driven by an intelligent AI storyteller. Generates stories by simulating psychology, ecology, gunplay, melee combat, climate, biomes, diplomacy, interpersonal relationships, art, medicine, trade, and more.",
        subnauticaDesc: "Descend into the depths of an alien underwater world filled with wonder and peril. Craft equipment, pilot submarines and out-smart wildlife to explore lush coral reefs, volcanoes, cave systems, and more - all while trying to survive.",
        humanFallFlatDesc: "Human: Fall Flat is a hilarious, light-hearted physics platformer set in floating dreamscapes that can be played solo or with up to 8 players online. Free new levels keep its vibrant community rewarded.",
        euroTruckSimulator2Desc: "Travel across Europe as king of the road, a trucker who delivers important cargo across impressive distances! With dozens of cities to explore from the UK, Belgium, Germany, Italy, the Netherlands, Poland, and many more, your endurance, skill and speed will all be pushed to their limits.",
        citiesSkylinesDesc: "Cities: Skylines is a modern take on the classic city simulation. The game introduces new game play elements to realize the thrill and hardships of creating and maintaining a real city whilst expanding on some well-established tropes of the city building experience."
    },
    ko: {
        // ... (existing translations) ...
        monsterHunterWorldDesc: "새로운 세계에 오신 것을 환영합니다! 시리즈의 최신작인 Monster Hunter: World에서 당신은 놀라움과 흥분으로 가득한 새로운 세계에서 몬스터를 사냥하기 위해 모든 것을 사용할 수 있으며, 최고의 사냥 경험을 즐길 수 있습니다.",
        left4Dead2Desc: "좀비 대재앙을 배경으로 하는 Left 4 Dead 2(L4D2)는 2008년 최고의 협동 게임으로 선정된 수상 경력에 빛나는 Left 4 Dead의 속편입니다. 이 협동 액션 공포 FPS는 당신과 당신의 친구들을 서배너에서 뉴올리언스까지 남부 깊은 곳의 도시, 늪, 묘지를 통과하게 합니다.",
        hadesDesc: "Bastion, Transistor, Pyre의 제작진이 만든 이 로그라이크 던전 크롤러에서 지하 세계에서 탈출하면서 죽음의 신에게 도전하세요.",
        bindingOfIsaacDesc: "The Binding of Isaac: Rebirth는 무작위로 생성되는 액션 RPG 슈팅 게임으로, 로그라이크 요소가 강합니다. 아이작의 여정을 따라가면서 플레이어는 아이작의 형태를 바꾸는 기묘한 보물을 발견하여 초인적인 능력을 부여하고 신비한 생물 무리를 물리칠 수 있게 합니다.",
        hollowKnightDesc: "Hollow Knight에서 자신만의 길을 개척하세요! 곤충과 영웅의 광대하고 폐허가 된 왕국을 통과하는 장대한 액션 어드벤처. 고전적인 손으로 그린 2D 스타일로 뒤틀린 동굴을 탐험하고, 오염된 생물과 싸우고, 기괴한 벌레와 친구가 되세요.",
        deadByDaylightDesc: "Dead by Daylight는 한 명의 플레이어가 잔인한 살인마 역할을 하고 다른 네 명의 플레이어는 생존자 역할을 하여 살인마를 피하고 잡히거나, 고문당하거나, 살해당하지 않으려고 노력하는 멀티플레이어(4vs1) 공포 게임입니다.",
        phasmophobiaDesc: "Phasmophobia는 당신과 당신의 초자연적 조사관 팀원들이 초자연적 활동으로 가득 찬 유령이 나오는 장소에 들어가 가능한 한 많은 초자연적 현상의 증거를 수집하는 4인 온라인 협동 심리 공포 게임입니다.",
        dontStarveTogetherDesc: "타협 없는 황야 생존 게임 Don't Starve의 멀티플레이어 확장팩. 개인 게임에서 친구와 협력하거나 온라인에서 낯선 사람과 함께 위험을 감수하세요. 다른 플레이어와 협력하여 혹독한 환경에서 생존하거나 혼자 힘으로 나아가세요.",
        factorioDesc: "Factorio는 무한한 2D 세계에서 점점 더 복잡해지는 아이템을 생산하기 위해 자동화된 공장을 건설하고 만드는 게임입니다. 상상력을 발휘하여 공장을 설계하고, 간단한 요소를 독창적인 구조로 결합하고, 마지막으로 당신을 별로 좋아하지 않는 생물로부터 공장을 보호하세요.",
        slayTheSpireDesc: "우리는 카드 게임과 로그라이크를 융합하여 우리가 할 수 있는 최고의 싱글 플레이어 덱 빌더를 만들었습니다. 독특한 덱을 만들고, 기괴한 생물을 만나고, 엄청난 힘의 유물을 발견하고, 첨탑을 정복하세요!",
        rimworldDesc: "RimWorld는 지능적인 AI 스토리텔러가 주도하는 SF 식민지 시뮬레이션입니다. 심리학, 생태학, 총격전, 근접 전투, 기후, 생물 군계, 외교, 대인 관계, 예술, 의학, 무역 등을 시뮬레이션하여 이야기를 생성합니다.",
        subnauticaDesc: "경이로움과 위험으로 가득한 외계 수중 세계의 깊은 곳으로 내려가세요. 장비를 제작하고, 잠수함을 조종하고, 야생 동물을 능가하여 무성한 산호초, 화산, 동굴 시스템 등을 탐험하세요. 이 모든 것을 생존하려고 노력하면서 말입니다.",
        humanFallFlatDesc: "Human: Fall Flat는 혼자 또는 최대 8명의 플레이어와 온라인으로 플레이할 수 있는 떠다니는 꿈의 풍경을 배경으로 하는 재미있고 가벼운 물리 플랫폼 게임입니다. 무료 신규 레벨은 활기찬 커뮤니티에 보상을 제공합니다.",
        euroTruckSimulator2Desc: "인상적인 거리에 걸쳐 중요한 화물을 배달하는 트럭 운전사인 도로의 왕이 되어 유럽을 여행하세요! 영국, 벨기에, 독일, 이탈리아, 네덜란드, 폴란드 등 수십 개의 도시를 탐험하면서 지구력, 기술, 속도가 모두 한계에 부딪힐 것입니다.",
        citiesSkylinesDesc: "Cities: Skylines는 고전적인 도시 시뮬레이션에 대한 현대적인 해석입니다. 이 게임은 실제 도시를 만들고 유지하는 스릴과 어려움을 실현하는 새로운 게임 플레이 요소를 도입하는 동시에 도시 건설 경험의 잘 확립된 일부 비유를 확장합니다."
    }
}
