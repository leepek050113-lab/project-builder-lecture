extends Node2D
## The play field: a W x H grid of 2x2-pixel blocks around an empty square in the middle.
## Blocks live in packed arrays and are painted into one image (no node per block); balls move
## in sub-cell steps through the grid, so even fast ones never skip a 2px block.
## No gravity: balls fly straight and reflect off whatever they hit. Every hit (block or wall)
## spends one bounce; at zero the ball is gone.

const Data := preload("res://scripts/data.gd")
const W := 168
const H := 168
const CELL := 2
const HOLE := 14          # half the side of the empty square in the middle, in cells
const STEP := 0.45        # longest move between collision checks, in cells
const MAX_BALLS := 320
const MAX_PARTS := 500

class Ball:
	var type := "basic"
	var pos := Vector2.ZERO     # in cells
	var dir := Vector2.UP
	var speed := 70.0           # cells per second
	var bounces := 0
	var dmg := 1.0
	var hits := 0
	var color := Color.WHITE
	var outline := Color.BLACK
	var trail: Array[Vector2] = []
	var alive := true
	var mini := false           # copies and fragments: they never make copies of their own
	var gen := 0                # split fragments: how many more times they may split
	var entry: Dictionary = {}  # the queue entry it was dropped from

var pal: Array[Color] = []
var stats: Dictionary = {}
var sfx: Node
var hp := PackedFloat32Array()
var ore := PackedByteArray()
var ref_hp := 1.0
var img: Image
var tex: ImageTexture
var dirty := false
var balls: Array[Ball] = []
var parts: Array = []         # [pos px, vel px/s, life, color]
var rings: Array = []         # [center px, radius px, life, color]
var beams: Array = []         # [from px, to px, life, color]
var rng := RandomNumberGenerator.new()
var running := false
var score := 0.0
var gold := 0
var broken := 0
var shake := 0.0
var aim_dir := Vector2.UP
var show_aim := false
var _chain_depth := 0
var _block_cols: Array[Color] = []
var _block_dots: Array[Color] = []


func setup(palette: Array[Color], round_no: int, st: Dictionary, seed_value := 0) -> void:
	pal = palette
	stats = st
	rng.seed = seed_value if seed_value != 0 else randi()
	_block_cols = [pal[0], pal[1], pal[2], pal[3], pal[4]]
	_block_dots = [pal[2], pal[0], pal[0], pal[1], pal[3]]
	balls.clear()
	parts.clear()
	rings.clear()
	beams.clear()
	score = 0.0
	gold = 0
	broken = 0
	ref_hp = Data.hp_scale(round_no) * (1.0 - minf(st.get("hp_pct", 0.0), 60.0) / 100.0)
	hp.resize(W * H)
	ore.resize(W * H)
	var ore_chance: float = 0.004 * (1.0 + st.get("ore", 0.0) / 100.0)
	var c := Vector2(W, H) / 2.0
	var far := c.length()
	# hard veins: a few random walks of tougher blocks
	var vein := PackedByteArray()
	vein.resize(W * H)
	for v in 10 + round_no:
		var p := Vector2(rng.randi_range(0, W - 1), rng.randi_range(0, H - 1))
		var d := Vector2.RIGHT.rotated(rng.randf() * TAU)
		for k in rng.randi_range(30, 90):
			p += d
			d = d.rotated(rng.randf_range(-0.5, 0.5))
			for o in [Vector2i(0, 0), Vector2i(1, 0), Vector2i(0, 1)]:
				var q: Vector2i = Vector2i(p) + o
				if q.x >= 0 and q.y >= 0 and q.x < W and q.y < H:
					vein[q.y * W + q.x] = 1
	for y in H:
		for x in W:
			var i := y * W + x
			ore[i] = 0
			if absi(x - W / 2) < HOLE and absi(y - H / 2) < HOLE:
				hp[i] = 0.0
				continue
			# tougher toward the edge, much tougher in veins
			var t := Vector2(x + 0.5, y + 0.5).distance_to(c) / far
			var h := ref_hp * (0.5 + 0.7 * t)
			if vein[i]:
				h *= 2.5
			hp[i] = maxf(1.0, h)
			if rng.randf() < ore_chance:
				ore[i] = 1
	img = Image.create(W * CELL, H * CELL, false, Image.FORMAT_RGBA8)
	for y in H:
		for x in W:
			_paint(x, y)
	tex = ImageTexture.create_from_image(img)
	queue_redraw()


func solid(x: int, y: int) -> bool:
	return hp[y * W + x] > 0.0


func center() -> Vector2:
	return Vector2(W, H) / 2.0


## Colour of a block: darker the more hp it has left against the round's base hp
func _paint(x: int, y: int) -> void:
	var i := y * W + x
	var px := x * CELL
	var py := y * CELL
	var h := hp[i]
	var c: Color
	var dot: Color
	if h <= 0.0:
		c = pal[7]
		dot = pal[7]
	elif ore[i]:
		c = pal[13]
		dot = pal[12]
	else:
		var t := h / ref_hp
		var k := 0 if t > 2.0 else (1 if t > 1.2 else (2 if t > 0.75 else (3 if t > 0.4 else 4)))
		c = _block_cols[k]
		dot = _block_dots[k]
	img.set_pixel(px, py, c)
	img.set_pixel(px + 1, py, c)
	img.set_pixel(px, py + 1, c)
	img.set_pixel(px + 1, py + 1, dot)
	dirty = true


# ------------------------------------------------------------------ balls

func st(key: String) -> float:
	return float(stats.get(key, 0.0))


## A ball's own stat: its base value plus its dedicated upgrades
func bs(type: String, key: String) -> float:
	return float(Data.ball(type).get(key, 0.0)) + st(type + "." + key)


func make_ball(type: String, extra_bounce := 0, mini := false) -> Ball:
	var b := Ball.new()
	var def := Data.ball(type)
	b.type = type
	b.mini = mini
	b.bounces = maxi(1, int(round((bs(type, "bounce") + st("bounce") + extra_bounce) * (1.0 + st("bounce_pct") / 100.0))))
	b.dmg = (bs(type, "dmg") + st("dmg")) * (1.0 + st("dmg_pct") / 100.0)
	b.speed = minf(def.speed * (1.0 + (st("speed_pct") + st(type + ".speed_pct")) / 100.0), 320.0)
	b.color = pal[def.col[1]]
	b.outline = pal[18] if type == "void" else pal[1]
	b.pos = center()
	return b


## Launch a queue entry's ball(s) toward dir. Returns the balls made.
func drop(type: String, dir: Vector2, extra_bounce: int, entry: Dictionary) -> Array[Ball]:
	var made: Array[Ball] = []
	var n := maxi(1, int(bs(type, "count")))
	for k in n:
		var d := dir.rotated((k - (n - 1) / 2.0) * 0.22)
		var b := make_ball(type, extra_bounce)
		b.dir = _fix_dir(d)
		b.entry = entry
		_add(b)
		made.append(b)
	if rng.randf() * 100.0 < st("echo"):
		var e := make_ball(type, extra_bounce, true)
		e.bounces = maxi(1, e.bounces / 2)
		e.dir = _fix_dir(dir.rotated(rng.randf_range(-0.6, 0.6)))
		e.entry = entry
		_add(e)
		made.append(e)
		_ring(e.pos * CELL, 10.0, pal[6])
	_ring(center() * CELL, 8.0, pal[8])
	_play("whoosh", rng.randf_range(0.95, 1.15), -4.0)
	return made


func _add(b: Ball) -> void:
	if balls.size() < MAX_BALLS:
		balls.append(b)


func active_count() -> int:
	var n := 0
	for b in balls:
		if b.alive:
			n += 1
	return n


func clear_balls() -> void:
	for b in balls:
		if b.alive:
			_burst(b.pos * CELL, b.color, 4)
	balls.clear()


## Keep a direction away from the axes so a ball never gets stuck sliding along a row
func _fix_dir(d: Vector2) -> Vector2:
	d = d.normalized()
	if absf(d.x) < 0.2:
		d.x = 0.2 * (1.0 if d.x >= 0.0 else -1.0)
	if absf(d.y) < 0.2:
		d.y = 0.2 * (1.0 if d.y >= 0.0 else -1.0)
	return d.normalized()


func _physics_process(dt: float) -> void:
	if running:
		step(dt)


func _process(dt: float) -> void:
	for p in parts:
		p[0] += p[1] * dt
		p[1] *= 0.92
		p[2] -= dt
	parts = parts.filter(func(p): return p[2] > 0.0)
	for r in rings:
		r[2] -= dt
	rings = rings.filter(func(r): return r[2] > 0.0)
	for bm in beams:
		bm[2] -= dt
	beams = beams.filter(func(bm): return bm[2] > 0.0)
	shake = maxf(0.0, shake - dt * 12.0)
	position = Vector2(round(randf_range(-shake, shake)), round(randf_range(-shake, shake))) + get_meta("origin", Vector2.ZERO)
	if dirty and tex:
		tex.update(img)
		dirty = false
	queue_redraw()


func step(dt: float) -> void:
	var list := balls.duplicate()
	for b in list:
		if b.alive:
			_move(b, dt)
			b.trail.push_front(b.pos)
			if b.trail.size() > 9:
				b.trail.pop_back()
	balls.assign(balls.filter(func(b): return b.alive))


func _move(b: Ball, dt: float) -> void:
	var dist := b.speed * dt
	while dist > 0.0 and b.alive:
		var s := minf(dist, STEP)
		dist -= s
		var np := b.pos + b.dir * s
		var cx := int(floor(b.pos.x))
		var cy := int(floor(b.pos.y))
		var nx := int(floor(np.x))
		var ny := int(floor(np.y))
		if nx == cx and ny == cy:
			b.pos = np
			continue
		var wall_x := nx < 0 or nx >= W
		var wall_y := ny < 0 or ny >= H
		var hit_x := nx != cx and (wall_x or solid(nx, cy))
		var hit_y := ny != cy and (wall_y or solid(cx, ny))
		var hit_d := false
		if not hit_x and not hit_y and nx != cx and ny != cy and solid(nx, ny):
			hit_d = true
		if not (hit_x or hit_y or hit_d):
			b.pos = np
			continue
		var wall := (hit_x and wall_x) or (hit_y and wall_y)
		var broke_all := true
		if hit_x and not wall_x:
			broke_all = _hit(b, nx, cy) and broke_all
		if hit_y and not wall_y:
			broke_all = _hit(b, cx, ny) and broke_all
		if hit_d:
			broke_all = _hit(b, nx, ny) and broke_all
		var pierce := not wall and broke_all and (b.type in Data.PIERCE_TYPES or rng.randf() * 100.0 < st("pierce"))
		if pierce:
			b.pos = np
		else:
			if hit_x or hit_d:
				b.dir.x = -b.dir.x
			if hit_y or hit_d:
				b.dir.y = -b.dir.y
			b.dir = _fix_dir(b.dir.rotated(rng.randf_range(-0.07, 0.07)))
		# the bounce cost
		var free := (wall and st("wall_free") > 0.0) or rng.randf() * 100.0 < st("refund")
		if not free:
			b.bounces -= 1
		if wall:
			_play("land", rng.randf_range(0.9, 1.1), -10.0)
		if b.bounces <= 0:
			_die(b)


## One block hit by a ball, with every on-hit effect. True if the block broke.
func _hit(b: Ball, x: int, y: int) -> bool:
	b.hits += 1
	var d := b.dmg
	if rng.randf() * 100.0 < st("crit"):
		d *= 3.0 + st("crit_x")
		_burst(Vector2(x, y) * CELL, pal[13], 3)
	var broke := _damage(x, y, d, b)
	_play("hit", rng.randf_range(0.85, 1.25), -8.0)
	if rng.randf() * 100.0 < st("splash"):
		var o: Vector2i = [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)][rng.randi_range(0, 3)]
		_damage(x + o.x, y + o.y, d, b)
	match b.type:
		"heavy":
			if st("heavy.quake") > 0.0:
				for o in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
					_damage(x + o.x, y + o.y, d * 0.5, b)
		"drill":
			if st("drill.wide") > 0.0:
				var side := Vector2i(Vector2(-b.dir.y, b.dir.x).round())
				_damage(x + side.x, y + side.y, d, b)
				_damage(x - side.x, y - side.y, d, b)
		"ghost":
			var from := Vector2(x + 0.5, y + 0.5)
			for k in range(1, int(bs("ghost", "depth")) + 1):
				var q := Vector2i((from + b.dir * k).floor())
				_damage(q.x, q.y, d, b)
		"spark":
			if rng.randf() * 100.0 < bs("spark", "chance"):
				_zap(b, x, y)
		"bomb":
			if b.hits % maxi(2, int(bs("bomb", "every"))) == 0:
				explode(x, y, int(bs("bomb", "radius")), d * bs("bomb", "bdmg"), b, pal[12])
		"laser":
			if b.hits % maxi(3, int(bs("laser", "every"))) == 0:
				_laser(b)
		"prism":
			if not b.mini and b.hits % maxi(4, int(bs("prism", "every"))) == 0:
				for k in int(bs("prism", "copies")):
					var c := make_ball("prism", 0, true)
					c.bounces = maxi(1, c.bounces / 2)
					c.pos = b.pos
					c.dir = _fix_dir(b.dir.rotated(rng.randf_range(-1.2, 1.2)))
					_add(c)
				_ring(b.pos * CELL, 6.0, pal[15])
		"void":
			var s := int(bs("void", "size"))
			for oy in range(-s, s + 1):
				for ox in range(-s, s + 1):
					if ox != 0 or oy != 0:
						_damage(x + ox, y + oy, d, b)
		"nova":
			explode(x, y, int(bs("nova", "radius")), d, b, pal[13], false)
	return broke


## Damage one cell; returns true when this broke it
func _damage(x: int, y: int, d: float, b: Ball) -> bool:
	if x < 0 or y < 0 or x >= W or y >= H:
		return false
	var i := y * W + x
	if hp[i] <= 0.0:
		return false
	hp[i] -= d
	if hp[i] > 0.0:
		_paint(x, y)
		return false
	hp[i] = 0.0
	_break(x, y, i, b)
	return true


func _break(x: int, y: int, i: int, b: Ball) -> void:
	broken += 1
	var mul := 1.0 + st("score_pct") / 100.0 + st("momentum") * floorf(broken / 25.0) / 100.0
	if b.type == "midas":
		mul *= 1.0 + bs("midas", "score") / 100.0
	score += mul
	var gc := st("gold_block")
	if b.type == "lucky" or b.type == "midas":
		gc += bs(b.type, "gold")
	if ore[i]:
		ore[i] = 0
		gold += 1
		_burst(Vector2(x, y) * CELL, pal[13], 6)
		_play("blip", rng.randf_range(1.2, 1.4), -6.0)
	elif gc > 0.0 and rng.randf() * 100.0 < gc:
		gold += 1
		_burst(Vector2(x, y) * CELL, pal[13], 4)
		_play("blip", rng.randf_range(1.2, 1.4), -8.0)
	if rng.randf() * 100.0 < st("break_refund"):
		b.bounces += 1
	if b.type == "vampire" and rng.randf() * 100.0 < bs("vampire", "refund"):
		b.bounces += 1
	_paint(x, y)
	if rng.randf() < 0.35 and parts.size() < MAX_PARTS:
		var a := rng.randf() * TAU
		parts.append([Vector2(x, y) * CELL + Vector2.ONE, Vector2.RIGHT.rotated(a) * rng.randf_range(20, 70), rng.randf_range(0.25, 0.5), pal[rng.randi_range(2, 4)]])
	if _chain_depth < 3 and rng.randf() * 100.0 < st("chain"):
		_chain_depth += 1
		for o in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
			_damage(x + o.x, y + o.y, b.dmg, b)
		_chain_depth -= 1


func explode(x: int, y: int, r: int, d: float, b: Ball, col: Color, loud := true) -> void:
	for oy in range(-r, r + 1):
		for ox in range(-r, r + 1):
			if ox * ox + oy * oy <= r * r + r:
				_damage(x + ox, y + oy, d, b)
	_ring(Vector2(x, y) * CELL + Vector2.ONE, r * CELL + 2.0, col)
	if loud:
		shake = minf(shake + 0.6 + r * 0.2, 3.0)
		_burst(Vector2(x, y) * CELL, col, 4 + r)
		_play("boom", rng.randf_range(0.8, 1.1), -6.0)


func _zap(b: Ball, x: int, y: int) -> void:
	var hits := 0
	for k in 24:
		if hits >= int(bs("spark", "count")):
			break
		var q := Vector2i(x + rng.randi_range(-5, 5), y + rng.randi_range(-5, 5))
		if q.x < 0 or q.y < 0 or q.x >= W or q.y >= H or not solid(q.x, q.y):
			continue
		_damage(q.x, q.y, bs("spark", "sdmg") + st("dmg"), b)
		beams.append([Vector2(x, y) * CELL + Vector2.ONE, Vector2(q) * CELL + Vector2.ONE, 0.12, pal[13]])
		hits += 1


func _laser(b: Ball) -> void:
	var w := int(bs("laser", "width"))
	var side := Vector2(-b.dir.y, b.dir.x)
	var n := int(bs("laser", "len"))
	for k in range(1, n + 1):
		for o in range(-w, w + 1):
			var q := Vector2i((b.pos + b.dir * k + side * o).floor())
			_damage(q.x, q.y, b.dmg, b)
	beams.append([b.pos * CELL, (b.pos + b.dir * n) * CELL, 0.22, pal[18]])
	_play("tear", rng.randf_range(1.1, 1.3), -8.0)


func _die(b: Ball) -> void:
	b.alive = false
	var x := int(floor(b.pos.x))
	var y := int(floor(b.pos.y))
	_burst(b.pos * CELL, b.color, 5)
	var br := int(st("death_boom"))
	if br > 0:
		explode(x, y, br, b.dmg * 2.0, b, pal[12])
	match b.type:
		"cluster":
			explode(x, y, int(bs("cluster", "radius")), bs("cluster", "cdmg") + b.dmg, b, pal[13])
			for k in int(bs("cluster", "child")):
				var c := make_ball("basic", 0, true)
				c.bounces = 20
				c.color = pal[13]
				c.pos = b.pos
				c.dir = _fix_dir(Vector2.RIGHT.rotated(rng.randf() * TAU))
				_add(c)
		"split":
			if not b.mini or b.gen > 0:
				var n := int(bs("split", "count")) if not b.mini else 2
				for k in n:
					var c := make_ball("split", 0, true)
					c.bounces = int(bs("split", "sbounce"))
					c.gen = int(st("split.again")) if not b.mini else b.gen - 1
					c.pos = b.pos
					c.dir = _fix_dir(Vector2.RIGHT.rotated(TAU * k / n + rng.randf() * 0.5))
					_add(c)
				_ring(b.pos * CELL, 6.0, pal[16])


# ------------------------------------------------------------------ effects and drawing

func _ring(p: Vector2, r: float, col: Color) -> void:
	rings.append([p, r, 0.3, col])


func _burst(p: Vector2, col: Color, n: int) -> void:
	for k in n:
		if parts.size() >= MAX_PARTS:
			return
		var a := rng.randf() * TAU
		parts.append([p + Vector2.ONE, Vector2.RIGHT.rotated(a) * rng.randf_range(30, 90), rng.randf_range(0.2, 0.45), col])


func _play(s: String, pitch: float, db: float) -> void:
	if sfx:
		sfx.play(s, pitch, db)


func _draw() -> void:
	if tex == null:
		return
	draw_texture(tex, Vector2.ZERO)
	if show_aim:
		var c := center() * CELL
		for k in range(4, 46, 4):
			draw_rect(Rect2((c + aim_dir * k).floor(), Vector2(2, 2)), Color(pal[5], 1.0 - k / 50.0))
		var tip := (c + aim_dir * 48).floor()
		draw_rect(Rect2(tip - Vector2(1, 1), Vector2(4, 4)), pal[11])
	for bm in beams:
		draw_line(bm[0], bm[1], Color(bm[3], clampf(bm[2] * 6.0, 0, 1)), 2.0)
		draw_line(bm[0], bm[1], Color(pal[8], clampf(bm[2] * 6.0, 0, 1)), 1.0)
	for r in rings:
		var t: float = 1.0 - r[2] / 0.3
		_pixel_ring(r[0], r[1] * (0.4 + 0.6 * t), Color(r[3], 1.0 - t))
	for p in parts:
		draw_rect(Rect2(p[0].floor(), Vector2.ONE), Color(p[3], clampf(p[2] * 4.0, 0, 1)))
	for b in balls:
		for k in range(b.trail.size() - 1, 0, -1):
			draw_rect(Rect2((b.trail[k] * CELL).floor() - Vector2.ONE, Vector2(2, 2)), Color(b.color, 0.7 - k * 0.07))
	for b in balls:
		var p := (b.pos * CELL).floor()
		draw_rect(Rect2(p - Vector2(4, 4), Vector2(8, 8)), Color(b.color, 0.22))
		var blink := b.bounces <= 3 and int(Time.get_ticks_msec() / 90) % 2 == 0
		draw_rect(Rect2(p - Vector2(2, 2), Vector2(4, 4)), pal[8] if blink else b.outline)
		draw_rect(Rect2(p - Vector2(1, 1), Vector2(2, 2)), b.color)
		draw_rect(Rect2(p - Vector2(1, 1), Vector2.ONE), pal[8])


func _pixel_ring(c: Vector2, r: float, col: Color) -> void:
	var n := maxi(12, int(r * 4))
	for k in n:
		var a := TAU * k / n
		draw_rect(Rect2((c + Vector2(cos(a), sin(a)) * r).floor(), Vector2.ONE), col)
