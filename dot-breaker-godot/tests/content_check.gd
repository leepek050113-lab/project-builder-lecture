extends SceneTree
## Data sanity: 100 upgrades with unique ids, known stats, existing glyphs and ball types,
## every ball type drawable, and an icon sheet of everything:
##   godot --headless --path . --script res://tests/content_check.gd -- [sheet.png]

const Data := preload("res://scripts/data.gd")
const Icons := preload("res://scripts/icons.gd")
# every stat the game reads (field.gd st()/bs(), main.gd stats.get())
const KNOWN := ["dmg", "dmg_pct", "crit", "crit_x", "splash", "bounce", "bounce_pct", "refund", "wall_free",
	"break_refund", "first_bonus", "last_bonus", "speed_pct", "pierce", "echo", "volley", "wait", "death_boom",
	"chain", "score_pct", "momentum", "hp_pct", "target_pct", "time", "interest_cap", "gold_round", "gold_block",
	"ore", "shop_pct", "free_reroll", "unused_gold", "time_gold", "luck", "slots"]
const BALL_KEYS := ["bounce", "dmg", "speed_pct", "count", "quake", "wide", "gold", "radius", "every", "bdmg",
	"sbounce", "again", "chance", "sdmg", "depth", "len", "width", "child", "cdmg", "refund", "copies", "size", "score"]

var fails := 0


func expect(ok: bool, what: String) -> void:
	if not ok:
		fails += 1
		print("FAIL ", what)


func _init() -> void:
	var pal: Array[Color] = []
	for h in Data.PALETTE_HEX:
		pal.append(Color(h))
	Icons.pal = pal
	expect(Data.UPGRADES.size() == 100, "100 upgrades (%d)" % Data.UPGRADES.size())
	var ids := {}
	var per_rarity := {}
	var dedicated := 0
	for u in Data.UPGRADES:
		expect(not ids.has(u.id), "unique id " + u.id)
		ids[u.id] = true
		per_rarity[u.rarity] = per_rarity.get(u.rarity, 0) + 1
		expect(u.rarity in Data.RARITIES, u.id + " rarity")
		expect(Icons.GLYPHS.has(u.glyph), u.id + " glyph " + u.glyph)
		expect(Icons.CHIP_COLORS.has(u.chip), u.id + " chip")
		if u.has("for"):
			dedicated += 1
			expect(Data.BALLS.has(u.for), u.id + " ball " + u.for)
		for k in u.mods:
			if "." in k:
				var parts: PackedStringArray = k.split(".")
				expect(Data.BALLS.has(parts[0]) and parts[1] in BALL_KEYS, u.id + " stat " + k)
				expect(not u.has("for") or parts[0] == u.for, u.id + " belongs to its ball")
			else:
				expect(k in KNOWN, u.id + " stat " + k)
	for b in Data.BALLS:
		var d: Dictionary = Data.BALLS[b]
		expect(d.rarity in Data.RARITIES and d.bounce > 0 and d.dmg > 0, b + " fields")
		expect(Data.UPGRADES.any(func(u): return u.get("for", "") == b), b + " has its own upgrades")
	print("upgrades: ", Data.UPGRADES.size(), " (", dedicated, " ball-specific) by rarity ", per_rarity, "  balls: ", Data.BALLS.size())
	for r in [1, 5, 10, 15]:
		print("round %d: target %d, block hp x%.1f" % [r, Data.target(r), Data.hp_scale(r)])
	# icon sheet
	var items := []
	for u in Data.UPGRADES:
		items.append(["upgrade", u.id])
	for b in Data.BALLS:
		items.append(["ball", b])
	var cols := 12
	var cell := 20
	var rows := ceili(items.size() / float(cols))
	var sheet := Image.create(cols * cell, rows * cell, false, Image.FORMAT_RGBA8)
	sheet.fill(pal[2])
	for i in items.size():
		var ic := Icons.draw(items[i][0], items[i][1])
		sheet.blend_rect(ic, Rect2i(0, 0, 16, 16), Vector2i((i % cols) * cell + 2, (i / cols) * cell + 2))
	sheet.resize(sheet.get_width() * 5, sheet.get_height() * 5, Image.INTERPOLATE_NEAREST)
	var args := OS.get_cmdline_user_args()
	if args.size() > 0:
		sheet.save_png(args[0])
	print("FAILURES: ", fails)
	quit(1 if fails > 0 else 0)
