extends RefCounted
## Game data: palette, balls, upgrades, round curves and shop odds.
## Stats are plain additive numbers keyed by name; "<ball>.<key>" keys belong to one ball type.

const PALETTE_HEX := [
	"#07060d", "#12101f", "#1f1b38", "#2e2a52", "#47407a", "#6b62a8", "#9a93d1", "#d2cdf2",
	"#f4f1ff", "#3b1d3f", "#7a2f55", "#c9476a", "#f07a6a", "#f5b85a", "#2a6f73", "#55c2b0",
	"#8fd14f", "#4f8ff7", "#b46cf0",
]

const START_BALLS := ["basic", "basic", "basic", "basic", "basic"]
const START_GOLD := 4
const BALL_SLOTS := 8
const ROUND_TIME := 40.0          # seconds; the timer starts with the first drop
const WIN_ROUND := 15             # clearing it wins the run; endless after that
const INTEREST_PER := 5           # $1 per $5 held
const INTEREST_CAP := 5
const REROLL_COST := 2

const RARITIES := ["C", "R", "E", "L"]
const RARITY_NAME := {"C": "커먼", "R": "레어", "E": "에픽", "L": "레전더리"}
const RARITY_COLOR := {"C": 6, "R": 17, "E": 18, "L": 13}

## Score needed to clear a round, and the block hp scale for it
## Targets can't outgrow the field (about 27,000 blocks), so later rounds get harder mostly through hp
static func target(r: int) -> int:
	return int(round(160.0 * pow(1.2, r - 1) / 5.0)) * 5


static func hp_scale(r: int) -> float:
	return pow(1.16, r - 1) * pow(1.01, (r - 1) * (r - 1))


## Shop odds per rarity for a round; luck shifts weight from Common to the rest
static func rarity_weights(r: int, luck: float) -> Dictionary:
	var c := maxf(60.0 - 3.0 * r - 8.0 * luck, 15.0)
	return {"C": c, "R": 28.0 + 1.5 * r + 4.0 * luck, "E": 9.0 + 1.0 * r + 3.0 * luck, "L": 3.0 + 0.5 * r + 1.0 * luck}


# ------------------------------------------------------------------ balls
# col: [light, base, dark] palette indices. bounce = hits before it vanishes (each block or wall hit costs 1)
const BALLS := {
	"basic":   {"name": "기본공", "rarity": "C", "cost": 3, "col": [8, 12, 11], "bounce": 58, "dmg": 1.0, "speed": 70.0,
		"desc": "평범한 공\n한 번에 1칸씩"},
	"heavy":   {"name": "쇳덩이", "rarity": "C", "cost": 4, "col": [7, 5, 3], "bounce": 34, "dmg": 3.0, "speed": 55.0,
		"desc": "느리지만 한 방이\n강하다"},
	"swift":   {"name": "날쌘공", "rarity": "C", "cost": 4, "col": [8, 15, 14], "bounce": 64, "dmg": 1.0, "speed": 125.0,
		"desc": "아주 빠르게 튕긴다"},
	"twin":    {"name": "쌍둥이", "rarity": "C", "cost": 4, "col": [8, 16, 14], "bounce": 34, "dmg": 1.0, "speed": 70.0, "count": 2,
		"desc": "발사하면 공 2개가\n나란히 나간다"},
	"lucky":   {"name": "행운공", "rarity": "C", "cost": 4, "col": [8, 13, 12], "bounce": 50, "dmg": 1.0, "speed": 70.0, "gold": 6,
		"desc": "블록을 부수면\n6% 확률로 $1"},
	"drill":   {"name": "드릴", "rarity": "R", "cost": 6, "col": [8, 17, 4], "bounce": 42, "dmg": 2.0, "speed": 75.0,
		"desc": "부순 블록을\n뚫고 지나간다"},
	"bomb":    {"name": "폭탄", "rarity": "R", "cost": 6, "col": [12, 11, 10], "bounce": 46, "dmg": 1.0, "speed": 70.0, "every": 8, "radius": 3, "bdmg": 2.0,
		"desc": "8번 칠 때마다\n반경 3 폭발"},
	"split":   {"name": "분열공", "rarity": "R", "cost": 6, "col": [13, 16, 14], "bounce": 38, "dmg": 1.0, "speed": 70.0, "count": 3, "sbounce": 18,
		"desc": "사라질 때\n작은 공 3개로 분열"},
	"spark":   {"name": "스파크", "rarity": "R", "cost": 6, "col": [8, 7, 13], "bounce": 50, "dmg": 1.0, "speed": 75.0, "chance": 35, "count": 3, "sdmg": 1.0,
		"desc": "칠 때 35% 확률로\n근처 3칸에 번개"},
	"ghost":   {"name": "유령공", "rarity": "R", "cost": 6, "col": [8, 6, 5], "bounce": 46, "dmg": 1.0, "speed": 70.0, "depth": 2,
		"desc": "칠 때 뒤쪽 2칸까지\n같이 부순다"},
	"laser":   {"name": "레이저", "rarity": "E", "cost": 9, "col": [8, 18, 10], "bounce": 50, "dmg": 1.0, "speed": 70.0, "every": 10, "len": 26, "width": 0,
		"desc": "10번 칠 때마다\n앞으로 26칸 레이저"},
	"cluster": {"name": "집속탄", "rarity": "E", "cost": 9, "col": [13, 12, 10], "bounce": 42, "dmg": 2.0, "speed": 65.0, "radius": 7, "cdmg": 3.0, "child": 0,
		"desc": "사라질 때 반경 7\n대폭발"},
	"vampire": {"name": "흡혈공", "rarity": "E", "cost": 9, "col": [11, 10, 9], "bounce": 38, "dmg": 2.0, "speed": 70.0, "refund": 30,
		"desc": "블록을 부수면\n30% 확률로 튕김+1"},
	"prism":   {"name": "프리즘", "rarity": "E", "cost": 9, "col": [8, 15, 17], "bounce": 46, "dmg": 1.0, "speed": 75.0, "every": 16, "copies": 1,
		"desc": "16번 칠 때마다\n복제 공을 만든다"},
	"void":    {"name": "공허", "rarity": "L", "cost": 14, "col": [5, 2, 0], "bounce": 42, "dmg": 2.0, "speed": 70.0, "size": 1,
		"desc": "칠 때마다\n3x3 범위를 지운다"},
	"nova":    {"name": "노바", "rarity": "L", "cost": 14, "col": [8, 13, 11], "bounce": 54, "dmg": 2.0, "speed": 70.0, "radius": 2,
		"desc": "칠 때마다 반경 2\n폭발"},
	"comet":   {"name": "혜성", "rarity": "L", "cost": 14, "col": [8, 17, 18], "bounce": 76, "dmg": 6.0, "speed": 165.0,
		"desc": "엄청 빠르고\n부순 블록을 관통"},
	"midas":   {"name": "미다스", "rarity": "L", "cost": 14, "col": [8, 13, 12], "bounce": 54, "dmg": 2.0, "speed": 70.0, "gold": 8, "score": 100,
		"desc": "부순 블록 점수 2배,\n8% 확률로 $1"},
}
const PIERCE_TYPES := ["drill", "comet"]


static func ball(id: String) -> Dictionary:
	return BALLS[id]


# ------------------------------------------------------------------ upgrades
# chip: icon color family (chips teal = bounce/speed, mult red = damage, xmult purple = score,
# money gold, rule grey = rules; a ball's own upgrades take that ball's colors)
# mods: stat -> amount added per copy. for: the ball type it belongs to (shop only offers it if you own one)
# once: can only be bought one time
const UPGRADES := [
	# ---- damage
	{"id": "sharp", "name": "날카로운 공", "rarity": "C", "cost": 5, "chip": "mult", "glyph": "up", "mods": {"dmg": 1}, "desc": "모든 공 데미지 +1"},
	{"id": "heavy_core", "name": "무거운 심", "rarity": "C", "cost": 4, "chip": "mult", "glyph": "weight", "mods": {"dmg_pct": 25}, "desc": "모든 공 데미지 +25%"},
	{"id": "tungsten", "name": "텅스텐", "rarity": "R", "cost": 8, "chip": "mult", "glyph": "stack", "mods": {"dmg": 2}, "desc": "모든 공 데미지 +2"},
	{"id": "crit_eye", "name": "약점 포착", "rarity": "C", "cost": 4, "chip": "mult", "glyph": "eye", "mods": {"crit": 10}, "desc": "치명타 확률 +10%\n(치명타: 데미지 3배)"},
	{"id": "crit_power", "name": "치명타 강화", "rarity": "R", "cost": 7, "chip": "mult", "glyph": "bang", "mods": {"crit_x": 1}, "desc": "치명타 배율 +1"},
	{"id": "headhunter", "name": "저격수", "rarity": "E", "cost": 11, "chip": "mult", "glyph": "target", "mods": {"crit": 20, "crit_x": 0.5}, "desc": "치명타 확률 +20%\n치명타 배율 +0.5"},
	{"id": "shatter", "name": "파쇄", "rarity": "R", "cost": 6, "chip": "mult", "glyph": "cross", "mods": {"splash": 15}, "desc": "칠 때 15% 확률로\n옆 블록도 친다"},
	{"id": "aftershock", "name": "여진", "rarity": "E", "cost": 10, "chip": "mult", "glyph": "wave", "mods": {"splash": 30}, "desc": "칠 때 30% 확률로\n옆 블록도 친다"},
	{"id": "demolisher", "name": "철거반", "rarity": "E", "cost": 12, "chip": "mult", "glyph": "boom", "mods": {"dmg_pct": 60}, "desc": "모든 공 데미지 +60%"},
	{"id": "titan_core", "name": "타이탄 심장", "rarity": "L", "cost": 18, "chip": "mult", "glyph": "heart", "mods": {"dmg": 4, "dmg_pct": 50}, "desc": "데미지 +4\n그리고 +50%"},
	# ---- bounces
	{"id": "rubber", "name": "고무 코팅", "rarity": "C", "cost": 4, "chip": "chips", "glyph": "plus", "mods": {"bounce": 8}, "desc": "모든 공 튕김 +8"},
	{"id": "springs", "name": "스프링", "rarity": "R", "cost": 7, "chip": "chips", "glyph": "ladder", "mods": {"bounce": 18}, "desc": "모든 공 튕김 +18"},
	{"id": "elastic", "name": "탄성 소재", "rarity": "C", "cost": 5, "chip": "chips", "glyph": "rise", "mods": {"bounce_pct": 20}, "desc": "모든 공 튕김 +20%"},
	{"id": "superball", "name": "슈퍼볼", "rarity": "E", "cost": 11, "chip": "chips", "glyph": "sun", "mods": {"bounce_pct": 50}, "desc": "모든 공 튕김 +50%"},
	{"id": "recoil", "name": "반동 흡수", "rarity": "C", "cost": 5, "chip": "chips", "glyph": "shield", "mods": {"refund": 8}, "desc": "칠 때 8% 확률로\n튕김을 쓰지 않음"},
	{"id": "perpetual", "name": "영구 기관", "rarity": "E", "cost": 12, "chip": "chips", "glyph": "infinity", "mods": {"refund": 20}, "desc": "칠 때 20% 확률로\n튕김을 쓰지 않음"},
	{"id": "wall_pad", "name": "쿠션 벽", "rarity": "R", "cost": 6, "chip": "chips", "glyph": "ends", "mods": {"wall_free": 1}, "once": true, "desc": "바깥 벽에 튕길 때는\n튕김을 쓰지 않음"},
	{"id": "recycler", "name": "재활용", "rarity": "R", "cost": 8, "chip": "chips", "glyph": "spiral", "mods": {"break_refund": 10}, "desc": "블록을 부수면\n10% 확률로\n튕김 +1"},
	{"id": "opener", "name": "선봉장", "rarity": "C", "cost": 4, "chip": "chips", "glyph": "flag", "mods": {"first_bonus": 30}, "desc": "라운드 첫 번째 공\n튕김 +30"},
	{"id": "closer", "name": "마무리 투수", "rarity": "C", "cost": 4, "chip": "chips", "glyph": "hand", "mods": {"last_bonus": 30}, "desc": "라운드 마지막 공\n튕김 +30"},
	# ---- speed
	{"id": "lubricant", "name": "윤활유", "rarity": "C", "cost": 3, "chip": "chips", "glyph": "feather", "mods": {"speed_pct": 20}, "desc": "모든 공 속도 +20%"},
	{"id": "rocket", "name": "로켓 추진", "rarity": "R", "cost": 6, "chip": "chips", "glyph": "right", "mods": {"speed_pct": 45}, "desc": "모든 공 속도 +45%"},
	# ---- rules
	{"id": "pierce_tip", "name": "관통 촉", "rarity": "R", "cost": 8, "chip": "rule", "glyph": "aim", "mods": {"pierce": 10}, "desc": "블록을 부수면\n10% 확률로\n뚫고 지나감"},
	{"id": "phase", "name": "위상 이동", "rarity": "E", "cost": 13, "chip": "rule", "glyph": "hole", "mods": {"pierce": 25}, "desc": "블록을 부수면\n25% 확률로\n뚫고 지나감"},
	{"id": "echo", "name": "메아리", "rarity": "R", "cost": 8, "chip": "rule", "glyph": "echo", "mods": {"echo": 15}, "desc": "발사할 때 15%\n확률로 튕김 절반\n복제 공 추가"},
	{"id": "mirror_drop", "name": "거울 발사", "rarity": "E", "cost": 14, "chip": "rule", "glyph": "bars", "mods": {"echo": 35}, "desc": "발사할 때 35%\n확률로 튕김 절반\n복제 공 추가"},
	{"id": "volley", "name": "일제 사격", "rarity": "R", "cost": 6, "chip": "rule", "glyph": "shower", "mods": {"volley": 12}, "desc": "전체 발사로 쏜 공\n튕김 +12"},
	{"id": "patience", "name": "인내", "rarity": "R", "cost": 7, "chip": "rule", "glyph": "hourglass", "mods": {"wait": 1}, "desc": "첫 발사 뒤 기다린\n공은 1초당 튕김+1\n(최대 +30)"},
	{"id": "fuse", "name": "도화선", "rarity": "R", "cost": 7, "chip": "rule", "glyph": "fire", "mods": {"death_boom": 2}, "desc": "모든 공이 사라질 때\n반경 2 폭발"},
	{"id": "big_bang", "name": "빅뱅", "rarity": "L", "cost": 16, "chip": "rule", "glyph": "star", "mods": {"death_boom": 5}, "desc": "모든 공이 사라질 때\n반경 5 폭발"},
	{"id": "chain", "name": "연쇄 반응", "rarity": "E", "cost": 12, "chip": "rule", "glyph": "chain", "mods": {"chain": 10}, "desc": "블록이 부서지면\n10% 확률로\n상하좌우도 친다"},
	# ---- score
	{"id": "tally", "name": "계수기", "rarity": "C", "cost": 4, "chip": "xmult", "glyph": "sigma", "mods": {"score_pct": 15}, "desc": "블록 점수 +15%"},
	{"id": "multiplier", "name": "배율기", "rarity": "R", "cost": 8, "chip": "xmult", "glyph": "cross", "mods": {"score_pct": 40}, "desc": "블록 점수 +40%"},
	{"id": "momentum", "name": "가속도", "rarity": "R", "cost": 7, "chip": "xmult", "glyph": "cresc", "mods": {"momentum": 1}, "desc": "25칸 부술 때마다\n블록 점수 +1%\n(이번 라운드)"},
	{"id": "jackpot", "name": "잭팟", "rarity": "L", "cost": 18, "chip": "xmult", "glyph": "seven", "mods": {"score_pct": 100}, "desc": "블록 점수 +100%"},
	{"id": "thin_walls", "name": "얇은 벽", "rarity": "R", "cost": 8, "chip": "xmult", "glyph": "half", "mods": {"hp_pct": 10}, "desc": "블록 체력 -10%"},
	{"id": "erosion", "name": "침식", "rarity": "E", "cost": 13, "chip": "xmult", "glyph": "tide", "mods": {"hp_pct": 20}, "desc": "블록 체력 -20%"},
	{"id": "lowball", "name": "하향 조정", "rarity": "R", "cost": 8, "chip": "xmult", "glyph": "down", "mods": {"target_pct": 8}, "desc": "목표 점수 -8%"},
	# ---- time
	{"id": "stopwatch", "name": "스톱워치", "rarity": "C", "cost": 4, "chip": "rule", "glyph": "hourglass", "mods": {"time": 8}, "desc": "제한 시간 +8초"},
	{"id": "overtime", "name": "연장전", "rarity": "R", "cost": 7, "chip": "rule", "glyph": "moon", "mods": {"time": 15}, "desc": "제한 시간 +15초"},
	# ---- money
	{"id": "piggy", "name": "돼지 저금통", "rarity": "C", "cost": 4, "chip": "money", "glyph": "bag", "mods": {"interest_cap": 3}, "desc": "이자 상한 +$3"},
	{"id": "bonus", "name": "보너스", "rarity": "C", "cost": 5, "chip": "money", "glyph": "coin", "mods": {"gold_round": 2}, "desc": "라운드 클리어 +$2"},
	{"id": "miner", "name": "광부", "rarity": "R", "cost": 6, "chip": "money", "glyph": "gem", "mods": {"gold_block": 2}, "desc": "블록을 부수면\n2% 확률로 $1"},
	{"id": "prospector", "name": "탐광꾼", "rarity": "R", "cost": 6, "chip": "money", "glyph": "scope", "mods": {"ore": 100}, "desc": "금광 블록이\n2배로 많아짐"},
	{"id": "coupon", "name": "쿠폰", "rarity": "R", "cost": 7, "chip": "money", "glyph": "cards", "mods": {"shop_pct": 15}, "once": true, "desc": "상점 가격 -15%"},
	{"id": "free_reroll", "name": "공짜 리롤", "rarity": "C", "cost": 5, "chip": "money", "glyph": "die", "mods": {"free_reroll": 1}, "desc": "상점마다\n리롤 1번 무료"},
	{"id": "thrift", "name": "절약가", "rarity": "C", "cost": 4, "chip": "money", "glyph": "lock", "mods": {"unused_gold": 2}, "desc": "클리어 때 안 쓴\n공마다 +$2 더"},
	{"id": "rush", "name": "속전속결", "rarity": "R", "cost": 6, "chip": "money", "glyph": "bolt", "mods": {"time_gold": 1}, "desc": "남은 시간\n보너스 2배"},
	{"id": "lucky_charm", "name": "행운의 부적", "rarity": "R", "cost": 7, "chip": "money", "glyph": "heart", "mods": {"luck": 1}, "desc": "상점에 높은 등급이\n더 자주 나옴"},
	{"id": "backpack", "name": "배낭", "rarity": "C", "cost": 5, "chip": "money", "glyph": "house", "mods": {"slots": 2}, "desc": "공 보관 칸 +2"},

	# ---- one ball's own upgrades (only offered while you own that ball)
	{"id": "basic_dmg", "for": "basic", "name": "기본기", "rarity": "C", "cost": 3, "chip": "scale", "glyph": "pip1", "mods": {"basic.dmg": 1}, "desc": "기본공 데미지 +1"},
	{"id": "basic_bounce", "for": "basic", "name": "대량 생산", "rarity": "C", "cost": 3, "chip": "scale", "glyph": "stack", "mods": {"basic.bounce": 16}, "desc": "기본공 튕김 +16"},
	{"id": "basic_count", "for": "basic", "name": "군단", "rarity": "R", "cost": 8, "chip": "scale", "glyph": "pip2", "mods": {"basic.count": 1}, "desc": "기본공을 쏘면\n1개 더 나감"},
	{"id": "heavy_dmg", "for": "heavy", "name": "납 추", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "weight", "mods": {"heavy.dmg": 3}, "desc": "쇳덩이 데미지 +3"},
	{"id": "heavy_quake", "for": "heavy", "name": "지진", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "wave", "mods": {"heavy.quake": 1}, "once": true, "desc": "쇳덩이가 칠 때\n상하좌우에\n절반 데미지"},
	{"id": "heavy_bounce", "for": "heavy", "name": "강철 체력", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "shield", "mods": {"heavy.bounce": 16}, "desc": "쇳덩이 튕김 +16"},
	{"id": "swift_speed", "for": "swift", "name": "순풍", "rarity": "C", "cost": 3, "chip": "scale", "glyph": "feather", "mods": {"swift.speed_pct": 40}, "desc": "날쌘공 속도 +40%"},
	{"id": "swift_dmg", "for": "swift", "name": "연타", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "echo", "mods": {"swift.dmg": 1}, "desc": "날쌘공 데미지 +1"},
	{"id": "swift_count", "for": "swift", "name": "분신", "rarity": "E", "cost": 10, "chip": "scale", "glyph": "duet", "mods": {"swift.count": 1}, "desc": "날쌘공을 쏘면\n1개 더 나감"},
	{"id": "twin_count", "for": "twin", "name": "삼둥이", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "pip3", "mods": {"twin.count": 1}, "desc": "쌍둥이가 1개 더 나감"},
	{"id": "twin_bounce", "for": "twin", "name": "유대감", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "joined", "mods": {"twin.bounce": 12}, "desc": "쌍둥이 튕김 +12"},
	{"id": "twin_dmg", "for": "twin", "name": "공명", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "pip2", "mods": {"twin.dmg": 1}, "desc": "쌍둥이 데미지 +1"},
	{"id": "lucky_gold", "for": "lucky", "name": "황금 손", "rarity": "R", "cost": 6, "chip": "scale", "glyph": "coin", "mods": {"lucky.gold": 8}, "desc": "행운공 $1 확률 +8%"},
	{"id": "lucky_bounce", "for": "lucky", "name": "네잎클로버", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "plus", "mods": {"lucky.bounce": 16}, "desc": "행운공 튕김 +16"},
	{"id": "drill_dmg", "for": "drill", "name": "다이아 비트", "rarity": "C", "cost": 5, "chip": "scale", "glyph": "gem", "mods": {"drill.dmg": 2}, "desc": "드릴 데미지 +2"},
	{"id": "drill_speed", "for": "drill", "name": "고속 회전", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "gear", "mods": {"drill.speed_pct": 35}, "desc": "드릴 속도 +35%"},
	{"id": "drill_wide", "for": "drill", "name": "굴착기", "rarity": "E", "cost": 11, "chip": "scale", "glyph": "triangle", "mods": {"drill.wide": 1}, "once": true, "desc": "드릴이 칠 때\n양옆 칸도 부순다"},
	{"id": "bomb_radius", "for": "bomb", "name": "화약 증량", "rarity": "R", "cost": 6, "chip": "scale", "glyph": "boom", "mods": {"bomb.radius": 1}, "desc": "폭탄 폭발 반경 +1"},
	{"id": "bomb_every", "for": "bomb", "name": "짧은 도화선", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "fire", "mods": {"bomb.every": -2}, "desc": "폭탄이 2번 더\n빨리 폭발 (최소 2)"},
	{"id": "bomb_dmg", "for": "bomb", "name": "고성능 폭약", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "up", "mods": {"bomb.bdmg": 2}, "desc": "폭탄 폭발 데미지 +2"},
	{"id": "split_count", "for": "split", "name": "세포 분열", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "pip5", "mods": {"split.count": 2}, "desc": "분열공 조각 +2"},
	{"id": "split_bounce", "for": "split", "name": "질긴 조각", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "piece", "mods": {"split.sbounce": 12}, "desc": "분열공 조각 튕김 +12"},
	{"id": "split_again", "for": "split", "name": "재분열", "rarity": "E", "cost": 13, "chip": "scale", "glyph": "four", "mods": {"split.again": 1}, "once": true, "desc": "조각도 사라질 때\n2개로 한 번 더\n갈라짐"},
	{"id": "spark_chance", "for": "spark", "name": "고전압", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "bolt", "mods": {"spark.chance": 20}, "desc": "스파크 번개\n확률 +20%"},
	{"id": "spark_count", "for": "spark", "name": "전류 증폭", "rarity": "R", "cost": 6, "chip": "scale", "glyph": "shower", "mods": {"spark.count": 2}, "desc": "스파크 번개 +2개"},
	{"id": "spark_dmg", "for": "spark", "name": "감전", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "bang", "mods": {"spark.sdmg": 2}, "desc": "스파크 번개\n데미지 +2"},
	{"id": "ghost_depth", "for": "ghost", "name": "심층 관통", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "down", "mods": {"ghost.depth": 2}, "desc": "유령공 관통\n깊이 +2칸"},
	{"id": "ghost_dmg", "for": "ghost", "name": "영혼 무게", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "skull", "mods": {"ghost.dmg": 1}, "desc": "유령공 데미지 +1"},
	{"id": "ghost_bounce", "for": "ghost", "name": "저승 연장", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "moon", "mods": {"ghost.bounce": 16}, "desc": "유령공 튕김 +16"},
	{"id": "laser_len", "for": "laser", "name": "집광 렌즈", "rarity": "C", "cost": 5, "chip": "scale", "glyph": "scope", "mods": {"laser.len": 15}, "desc": "레이저 길이 +15칸"},
	{"id": "laser_every", "for": "laser", "name": "과충전", "rarity": "R", "cost": 8, "chip": "scale", "glyph": "bolt", "mods": {"laser.every": -3}, "desc": "레이저가 3번 더\n빨리 발사 (최소 3)"},
	{"id": "laser_width", "for": "laser", "name": "광폭 빔", "rarity": "E", "cost": 12, "chip": "scale", "glyph": "bars", "mods": {"laser.width": 1}, "desc": "레이저 굵기 +2칸"},
	{"id": "cluster_radius", "for": "cluster", "name": "대형 탄두", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "boom", "mods": {"cluster.radius": 3}, "desc": "집속탄 폭발 반경 +3"},
	{"id": "cluster_child", "for": "cluster", "name": "자탄 분산", "rarity": "E", "cost": 12, "chip": "scale", "glyph": "shower", "mods": {"cluster.child": 3}, "desc": "집속탄이 터질 때\n작은 공 3개가\n튀어나옴"},
	{"id": "cluster_dmg", "for": "cluster", "name": "장약", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "up", "mods": {"cluster.cdmg": 3}, "desc": "집속탄 폭발\n데미지 +3"},
	{"id": "vampire_refund", "for": "vampire", "name": "갈증", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "heart", "mods": {"vampire.refund": 15}, "desc": "흡혈공 튕김 회복\n확률 +15%"},
	{"id": "vampire_dmg", "for": "vampire", "name": "송곳니", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "triangle", "mods": {"vampire.dmg": 2}, "desc": "흡혈공 데미지 +2"},
	{"id": "vampire_bounce", "for": "vampire", "name": "피의 축제", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "plus", "mods": {"vampire.bounce": 24}, "desc": "흡혈공 튕김 +24"},
	{"id": "prism_every", "for": "prism", "name": "굴절", "rarity": "R", "cost": 8, "chip": "scale", "glyph": "gem", "mods": {"prism.every": -4}, "desc": "프리즘이 4번 더\n빨리 복제 (최소 4)"},
	{"id": "prism_copies", "for": "prism", "name": "분광", "rarity": "E", "cost": 12, "chip": "scale", "glyph": "pip3", "mods": {"prism.copies": 1}, "desc": "프리즘 복제 공 +1개"},
	{"id": "prism_dmg", "for": "prism", "name": "결정 강화", "rarity": "C", "cost": 4, "chip": "scale", "glyph": "up", "mods": {"prism.dmg": 1}, "desc": "프리즘 데미지 +1"},
	{"id": "void_size", "for": "void", "name": "사건의 지평선", "rarity": "E", "cost": 14, "chip": "scale", "glyph": "hole", "mods": {"void.size": 1}, "once": true, "desc": "공허 범위\n3x3 → 5x5"},
	{"id": "void_bounce", "for": "void", "name": "공허 연장", "rarity": "R", "cost": 6, "chip": "scale", "glyph": "infinity", "mods": {"void.bounce": 16}, "desc": "공허 튕김 +16"},
	{"id": "void_dmg", "for": "void", "name": "무의 무게", "rarity": "R", "cost": 7, "chip": "scale", "glyph": "weight", "mods": {"void.dmg": 2}, "desc": "공허 데미지 +2"},
	{"id": "nova_radius", "for": "nova", "name": "초신성", "rarity": "E", "cost": 14, "chip": "scale", "glyph": "sun", "mods": {"nova.radius": 1}, "desc": "노바 폭발 반경 +1"},
	{"id": "nova_dmg", "for": "nova", "name": "핵융합", "rarity": "R", "cost": 8, "chip": "scale", "glyph": "fire", "mods": {"nova.dmg": 2}, "desc": "노바 데미지 +2"},
	{"id": "comet_bounce", "for": "comet", "name": "꼬리별", "rarity": "R", "cost": 8, "chip": "scale", "glyph": "star", "mods": {"comet.bounce": 30}, "desc": "혜성 튕김 +30"},
	{"id": "comet_dmg", "for": "comet", "name": "대기 진입", "rarity": "R", "cost": 8, "chip": "scale", "glyph": "fire", "mods": {"comet.dmg": 4}, "desc": "혜성 데미지 +4"},
	{"id": "midas_gold", "for": "midas", "name": "황금률", "rarity": "R", "cost": 8, "chip": "scale", "glyph": "coin", "mods": {"midas.gold": 6}, "desc": "미다스 $1 확률 +6%"},
	{"id": "midas_score", "for": "midas", "name": "왕관", "rarity": "E", "cost": 13, "chip": "scale", "glyph": "crown", "mods": {"midas.score": 100}, "desc": "미다스가 부순\n블록 점수 +100% 더"},
]


static func upgrade(id: String) -> Dictionary:
	for u in UPGRADES:
		if u.id == id:
			return u
	return {}


## Shop price after the coupon discount
static func price(base: int, stats: Dictionary) -> int:
	return maxi(1, int(round(base * (1.0 - stats.get("shop_pct", 0.0) / 100.0))))
