extends Node
## Run flow: title -> round (drop balls, beat the target before the timer) -> rewards ->
## iris out -> shop (3 upgrades on top, 3 balls below) -> iris -> next round ... -> game over.

const Data := preload("res://scripts/data.gd")
const Icons := preload("res://scripts/icons.gd")
const UI := preload("res://scripts/ui.gd")
const Field := preload("res://scripts/field.gd")
const Backdrop := preload("res://scripts/backdrop.gd")
const Sfx := preload("res://scripts/sfx.gd")

const FIELD_POS := Vector2(152, 12)
const SAVE_PATH := "user://save.cfg"

var pal: Array[Color] = []
var sfx: Node
var backdrop: Node2D
var field: Node2D
var ui: Control
var iris_rect: ColorRect
var iris_busy := false

# run state
var phase := "title"
var round_no := 1
var gold := 0
var stats := {}
var upgrades := {}                 # id -> copies bought
var owned: Array[String] = []      # ball types, in drop order
var queue: Array = []              # this round: {type, state ready/active/done, balls, waited}
var target := 0
var time_left := 0.0
var timer_on := false
var dropped_any := false
var field_gold_seen := 0
var total_broken := 0
var endless := false
var best_round := 0
var demo_t := 0.0

# shop state
var offers: Array = []             # {kind, id, price, sold}
var reroll_count := 0
var free_rerolls := 0

# widgets
var title_screen: Control
var hud: Control
var lbl_round: Label
var lbl_target: Label
var lbl_score: Label
var lbl_time: Label
var lbl_time_hint: Label
var lbl_gold: Label
var lbl_hp: Label
var score_bar: Control
var up_grid: GridContainer
var queue_box: VBoxContainer
var queue_rows: Array = []         # [entry, panel, bounce label, state label]
var shop_screen: Control
var popup_layer: Control
var stamp: Label
var toast: Label


func _ready() -> void:
	for h in Data.PALETTE_HEX:
		pal.append(Color(h))
	Icons.pal = pal
	randomize()
	_load()
	sfx = Sfx.new()
	add_child(sfx)
	backdrop = Backdrop.new()
	backdrop.setup(pal)
	add_child(backdrop)
	field = Field.new()
	field.set_meta("origin", FIELD_POS)
	field.position = FIELD_POS
	field.sfx = sfx
	add_child(field)
	var layer := CanvasLayer.new()
	layer.layer = 1
	add_child(layer)
	ui = Control.new()
	ui.set_anchors_preset(Control.PRESET_FULL_RECT)
	ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.theme = UI.setup(pal)
	layer.add_child(ui)
	_build_hud()
	_build_title()
	shop_screen = Control.new()
	shop_screen.set_anchors_preset(Control.PRESET_FULL_RECT)
	shop_screen.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.add_child(shop_screen)
	popup_layer = Control.new()
	popup_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	popup_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.add_child(popup_layer)
	stamp = UI.num("", pal[16], 32)
	stamp.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	stamp.position = Vector2(FIELD_POS.x, 150)
	stamp.size = Vector2(336, 40)
	stamp.pivot_offset = stamp.size / 2.0
	ui.add_child(stamp)
	toast = UI.label("", pal[8])
	toast.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	toast.position = Vector2(0, 336)
	toast.size = Vector2(640, 16)
	ui.add_child(toast)
	var iris_layer := CanvasLayer.new()
	iris_layer.layer = 10
	add_child(iris_layer)
	iris_rect = ColorRect.new()
	iris_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
	var mat := ShaderMaterial.new()
	mat.shader = load("res://shaders/iris.gdshader")
	mat.set_shader_parameter("radius", 800.0)
	mat.set_shader_parameter("dark", pal[0])
	mat.set_shader_parameter("ring", pal[18])
	iris_rect.material = mat
	iris_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	iris_layer.add_child(iris_rect)
	_open_title()


# ------------------------------------------------------------------ title

func _build_title() -> void:
	title_screen = Control.new()
	title_screen.set_anchors_preset(Control.PRESET_FULL_RECT)
	title_screen.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.add_child(title_screen)
	var p := UI.panel(pal[1], pal[5], Vector4(20, 14, 20, 14))
	p.position = Vector2(200, 92)
	p.custom_minimum_size = Vector2(240, 0)
	title_screen.add_child(p)
	var v := UI.vbox(6)
	v.alignment = BoxContainer.ALIGNMENT_CENTER
	p.add_child(v)
	var t := UI.num("DOT BREAKER", pal[13], 32)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(t)
	var sub := UI.label("도트 브레이커 · 공 튕기기 로그라이크", pal[6])
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(sub)
	v.add_child(Control.new())
	var b := UI.button("새 게임", pal[14], pal[15])
	b.pressed.connect(func():
		sfx.play("click")
		_iris(_new_run))
	v.add_child(b)
	var q := UI.button("종료", pal[3], pal[4])
	q.pressed.connect(func(): get_tree().quit())
	v.add_child(q)
	var best := UI.label("", pal[5])
	best.name = "Best"
	best.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(best)
	var help := UI.label("마우스로 조준 · 클릭/SPACE 발사 · A 전체 발사 · M 음소거", pal[5])
	help.position = Vector2(0, 336)
	help.size = Vector2(640, 16)
	help.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_screen.add_child(help)


func _open_title() -> void:
	phase = "title"
	_clear_popup()
	shop_screen.visible = false
	hud.visible = false
	title_screen.visible = true
	(title_screen.find_child("Best", true, false) as Label).text = "최고 기록: 라운드 %d" % best_round if best_round > 0 else ""
	backdrop.frame = Rect2(FIELD_POS, Vector2(Field.W, Field.H) * Field.CELL)
	field.visible = true
	field.setup(pal, 2, {})
	field.running = true
	field.show_aim = false
	sfx.play_music("title")


func _demo(dt: float) -> void:
	demo_t -= dt
	if demo_t <= 0.0 and field.active_count() < 6:
		demo_t = 1.1
		var types := ["basic", "bomb", "drill", "spark", "nova", "split"]
		field.drop(types[randi() % types.size()], Vector2.RIGHT.rotated(randf() * TAU), 0, {})


# ------------------------------------------------------------------ run

func _new_run() -> void:
	round_no = 1
	gold = Data.START_GOLD
	stats = {}
	upgrades = {}
	owned.assign(Data.START_BALLS)
	total_broken = 0
	endless = false
	title_screen.visible = false
	_start_round(1)


func _start_round(r: int) -> void:
	round_no = r
	phase = "play"
	_clear_popup()
	shop_screen.visible = false
	title_screen.visible = false
	hud.visible = true
	field.visible = true
	backdrop.frame = Rect2(FIELD_POS, Vector2(Field.W, Field.H) * Field.CELL)
	target = maxi(5, int(round(Data.target(r) * (1.0 - minf(stats.get("target_pct", 0.0), 50.0) / 100.0))))
	time_left = Data.ROUND_TIME + stats.get("time", 0.0)
	timer_on = false
	dropped_any = false
	field_gold_seen = 0
	queue.clear()
	for t in owned:
		queue.append({"type": t, "state": "ready", "balls": [], "waited": 0.0})
	field.setup(pal, r, stats)
	field.running = true
	field.show_aim = true
	_build_queue()
	_refresh_upgrades(up_grid)
	_update_hud()
	sfx.play_music("game")
	_stamp("ROUND %d" % r, pal[8])


func _process(dt: float) -> void:
	match phase:
		"title":
			_demo(dt)
		"play":
			var m: Vector2 = field.get_local_mouse_position() / Field.CELL - field.center()
			if m.length() > 1.5 and get_viewport().get_mouse_position() != Vector2.ZERO:
				field.aim_dir = m.normalized()
			_update_hud()


## Runs on the physics tick, in step with the balls: the clock never runs ahead of them on a slow frame
func _physics_process(dt: float) -> void:
	if phase == "play":
		_play_tick(dt)


func _play_tick(dt: float) -> void:
	if timer_on:
		time_left = maxf(0.0, time_left - dt)
		for e in queue:
			if e.state == "ready":
				e.waited += dt
	for e in queue:
		if e.state == "active" and not e.balls.any(func(b): return b.alive):
			e.state = "done"
	if field.gold > field_gold_seen:
		gold += field.gold - field_gold_seen
		field_gold_seen = field.gold
		_pop(lbl_gold)
	if int(field.score) >= target:
		_round_clear()
	elif timer_on and time_left <= 0.0:
		_round_fail("시간 초과!")
	elif dropped_any and _ready_entries().is_empty() and field.active_count() == 0:
		_round_fail("공을 다 썼다!")


func _ready_entries() -> Array:
	return queue.filter(func(e): return e.state == "ready")


func _drop(e: Dictionary, dir: Vector2, volley := false) -> void:
	if phase != "play" or e.state != "ready":
		return
	var extra := 0
	if not dropped_any:
		extra += int(stats.get("first_bonus", 0.0))
	if _ready_entries().size() == 1:
		extra += int(stats.get("last_bonus", 0.0))
	if timer_on:
		extra += mini(30, int(e.waited) * int(stats.get("wait", 0.0)))
	if volley:
		extra += int(stats.get("volley", 0.0))
	e.balls = field.drop(e.type, dir, extra, e)
	e.state = "active"
	dropped_any = true
	timer_on = true


func _drop_next() -> void:
	var r := _ready_entries()
	if not r.is_empty():
		_drop(r[0], field.aim_dir)


func _drop_all() -> void:
	var r := _ready_entries()
	for i in r.size():
		_drop(r[i], field.aim_dir.rotated((i - (r.size() - 1) / 2.0) * 0.32), true)


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_M:
			sfx.toggle_mute()
			_toast("음소거" if sfx.muted else "소리 켬")
		if phase == "play" and not iris_busy:
			if event.keycode == KEY_SPACE:
				_drop_next()
			elif event.keycode == KEY_A:
				_drop_all()
	elif event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		if phase == "play" and not iris_busy:
			var p: Vector2 = field.get_local_mouse_position()
			if Rect2(Vector2.ZERO, Vector2(Field.W, Field.H) * Field.CELL).has_point(p):
				_drop_next()


# ------------------------------------------------------------------ round end

func _round_clear() -> void:
	phase = "clear"
	field.show_aim = false
	field.clear_balls()
	total_broken += field.broken
	sfx.play("score")
	_stamp("ROUND CLEAR!", pal[16])
	var unused := _ready_entries().size()
	var rows := []
	var base := 3 + round_no / 2
	rows.append(["라운드 클리어", base])
	var tb: int = int(time_left / 5.0) * (1 + int(stats.get("time_gold", 0.0)))
	if tb > 0:
		rows.append(["남은 시간 %d초" % int(time_left), tb])
	if unused > 0:
		rows.append(["안 쓴 공 %d개" % unused, unused * (1 + int(stats.get("unused_gold", 0.0)))])
	var interest: int = mini(gold / Data.INTEREST_PER, Data.INTEREST_CAP + int(stats.get("interest_cap", 0.0)))
	if interest > 0:
		rows.append(["이자", interest])
	if stats.get("gold_round", 0.0) > 0.0:
		rows.append(["보너스", int(stats.gold_round)])
	if field.gold > 0:
		rows.append(["(라운드 중 얻은 돈 $%d)" % field.gold, 0])
	var total := 0
	for r in rows:
		total += r[1]
	gold += total
	best_round = maxi(best_round, round_no)
	_save()
	await get_tree().create_timer(0.9).timeout
	if phase != "clear":
		return
	var won := round_no == Data.WIN_ROUND and not endless
	var buttons := [["상점으로", pal[14], pal[15], func(): _iris(_open_shop)]]
	if won:
		buttons = [["무한 모드로 계속", pal[14], pal[15], func():
			endless = true
			_iris(_open_shop)], ["메인 메뉴", pal[3], pal[4], func(): _iris(_open_title)]]
	_popup("승리!" if won else "보상", rows, total, buttons, "라운드 %d를 깼다! 끝까지 왔다." % round_no if won else "")


func _round_fail(reason: String) -> void:
	phase = "over"
	set_meta("fail", reason)
	field.show_aim = false
	field.running = false
	total_broken += field.broken
	best_round = maxi(best_round, round_no - 1)
	_save()
	sfx.play("tear", 0.7)
	_stamp("GAME OVER", pal[11])
	await get_tree().create_timer(0.9).timeout
	var rows := [["도달 라운드", round_no], ["부순 블록", total_broken], ["최고 기록", best_round]]
	_popup("게임 오버", rows, -1, [
		["다시 하기", pal[14], pal[15], func(): _iris(_new_run)],
		["메인 메뉴", pal[3], pal[4], func(): _iris(_open_title)]], reason + "  점수 %d / 목표 %d" % [int(field.score), target])


## Centered result window: rows of [text, amount], an optional total, and buttons
func _popup(title: String, rows: Array, total: int, buttons: Array, note := "") -> void:
	_clear_popup()
	var dim := ColorRect.new()
	dim.color = Color(pal[0], 0.55)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	popup_layer.add_child(dim)
	var p := UI.panel(pal[2], pal[5], Vector4(14, 10, 14, 10))
	p.mouse_filter = Control.MOUSE_FILTER_STOP
	popup_layer.add_child(p)
	var v := UI.vbox(4)
	p.add_child(v)
	var t := UI.label(title, pal[13])
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(t)
	if note != "":
		var n := UI.label(note, pal[6])
		n.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		v.add_child(n)
	for r in rows:
		var h := UI.hbox(12)
		var l := UI.label(r[0], pal[7])
		l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		h.add_child(l)
		if total >= 0:
			if r[1] > 0:
				h.add_child(UI.price_tag(r[1], true))
		else:
			h.add_child(UI.num(_fmt(r[1]), pal[8]))
		v.add_child(h)
	if total >= 0:
		var line := ColorRect.new()
		line.color = pal[4]
		line.custom_minimum_size = Vector2(0, 1)
		v.add_child(line)
		var h := UI.hbox(12)
		var l := UI.label("합계", pal[8])
		l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		h.add_child(l)
		h.add_child(UI.price_tag(total, true))
		v.add_child(h)
	var bh := UI.hbox(8)
	bh.alignment = BoxContainer.ALIGNMENT_CENTER
	v.add_child(bh)
	for b in buttons:
		var btn := UI.button(b[0], b[1], b[2])
		var cb: Callable = b[3]
		btn.pressed.connect(func():
			sfx.play("click")
			cb.call())
		bh.add_child(btn)
	p.custom_minimum_size = Vector2(220, 0)
	p.reset_size()
	await get_tree().process_frame
	p.position = (Vector2(640, 360) - p.size) / 2.0
	p.pivot_offset = p.size / 2.0
	p.scale = Vector2(0.8, 0.8)
	create_tween().tween_property(p, "scale", Vector2.ONE, 0.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)


func _clear_popup() -> void:
	for c in popup_layer.get_children():
		c.queue_free()


# ------------------------------------------------------------------ HUD

func _build_hud() -> void:
	hud = Control.new()
	hud.set_anchors_preset(Control.PRESET_FULL_RECT)
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.add_child(hud)
	# left: round, score, time, money
	var left := UI.vbox(4)
	left.position = Vector2(4, 6)
	left.custom_minimum_size = Vector2(140, 0)
	hud.add_child(left)
	var rp := _box(left, "라운드")
	lbl_round = UI.num("1", pal[8], 32)
	rp.add_child(lbl_round)
	var sp := _box(left, "점수 / 목표")
	var sh := UI.hbox(4)
	lbl_score = UI.num("0", pal[16])
	lbl_target = UI.num("/ 0", pal[13])
	sh.add_child(lbl_score)
	sh.add_child(lbl_target)
	sp.add_child(sh)
	score_bar = Control.new()
	score_bar.custom_minimum_size = Vector2(0, 6)
	score_bar.draw.connect(func():
		var w := score_bar.size.x
		score_bar.draw_rect(Rect2(0, 0, w, 6), pal[0])
		var f := clampf(field.score / maxf(1.0, target), 0.0, 1.0)
		score_bar.draw_rect(Rect2(1, 1, (w - 2) * f, 4), pal[16]))
	sp.add_child(score_bar)
	var tp := _box(left, "시간")
	lbl_time = UI.num("0:45", pal[8], 32)
	tp.add_child(lbl_time)
	lbl_time_hint = UI.label("첫 공을 쏘면 시작", pal[5])
	tp.add_child(lbl_time_hint)
	var gp := _box(left, "골드 · 블록 체력")
	var gh := UI.hbox(10)
	lbl_gold = UI.num("$0", pal[13])
	lbl_gold.pivot_offset = Vector2(10, 8)
	lbl_hp = UI.num("x1.0", pal[6])
	gh.add_child(lbl_gold)
	gh.add_child(lbl_hp)
	gp.add_child(gh)
	var upp := _box(left, "업그레이드")
	up_grid = GridContainer.new()
	up_grid.columns = 7
	up_grid.add_theme_constant_override("h_separation", 2)
	up_grid.add_theme_constant_override("v_separation", 2)
	upp.add_child(up_grid)
	# right: the ball queue
	var right := UI.panel(Color(pal[1], 0.94), pal[4], Vector4(6, 5, 6, 5))
	right.position = Vector2(494, 6)
	right.custom_minimum_size = Vector2(142, 348)
	right.size = Vector2(142, 348)
	right.clip_contents = true
	hud.add_child(right)
	var rv := UI.vbox(3)
	right.add_child(rv)
	rv.add_child(UI.label("공 (클릭: 그 공 발사)", pal[6]))
	queue_box = UI.vbox(2)
	queue_box.size_flags_vertical = Control.SIZE_EXPAND_FILL
	rv.add_child(queue_box)
	for line in ["클릭·SPACE  다음 공", "A  전체 발사", "M  음소거"]:
		rv.add_child(UI.label(line, pal[5]))


## A titled panel in the left column; returns the box to fill
func _box(parent: Control, title: String) -> VBoxContainer:
	var p := UI.panel(Color(pal[1], 0.94), pal[4], Vector4(7, 4, 7, 4))
	parent.add_child(p)
	var v := UI.vbox(1)
	p.add_child(v)
	v.add_child(UI.label(title, pal[6]))
	return v


func _build_queue() -> void:
	for c in queue_box.get_children():
		c.queue_free()
	queue_rows.clear()
	var compact := queue.size() > 10
	for e in queue:
		var def := Data.ball(e.type)
		var row := PanelContainer.new()
		row.mouse_filter = Control.MOUSE_FILTER_STOP
		row.tooltip_text = "%s (%s)\n%s" % [def.name, Data.RARITY_NAME[def.rarity], def.desc]
		var h := UI.hbox(4)
		row.add_child(h)
		var strip := ColorRect.new()
		strip.color = pal[Data.RARITY_COLOR[def.rarity]]
		strip.custom_minimum_size = Vector2(2, 0)
		h.add_child(strip)
		h.add_child(UI.icon(Icons.get_icon("ball", e.type)))
		var name_l := UI.label(def.name, pal[8])
		name_l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		name_l.clip_text = true
		name_l.custom_minimum_size = Vector2(40, 0)
		h.add_child(name_l)
		var bl := UI.num("", pal[6])
		bl.custom_minimum_size = Vector2(22, 0)
		bl.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		h.add_child(bl)
		var entry: Dictionary = e
		row.gui_input.connect(func(ev: InputEvent):
			if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
				_drop(entry, field.aim_dir)
				row.accept_event())
		row.custom_minimum_size = Vector2(0, 18 if compact else 22)
		queue_box.add_child(row)
		queue_rows.append([e, row, bl])


func _update_hud() -> void:
	lbl_round.text = str(round_no)
	lbl_score.text = _fmt(int(field.score))
	lbl_target.text = "/ " + _fmt(target)
	var s := int(ceil(time_left))
	lbl_time.text = "%d:%02d" % [s / 60, s % 60]
	lbl_time.add_theme_color_override("font_color", pal[11] if timer_on and time_left < 10.0 else pal[8])
	lbl_time_hint.visible = not timer_on
	lbl_gold.text = "$%d" % gold
	lbl_hp.text = "x%.1f" % field.ref_hp
	score_bar.queue_redraw()
	for r in queue_rows:
		var e: Dictionary = r[0]
		var row: PanelContainer = r[1]
		var bl: Label = r[2]
		var fill := pal[3]
		var border := pal[4]
		match e.state:
			"ready":
				var b := 0
				var def := Data.ball(e.type)
				b = int(round((def.bounce + stats.get(e.type + ".bounce", 0.0) + stats.get("bounce", 0.0)) * (1.0 + stats.get("bounce_pct", 0.0) / 100.0)))
				bl.text = "%d" % b
				bl.add_theme_color_override("font_color", pal[16])
			"active":
				var n := 0
				for b in e.balls:
					if b.alive:
						n += b.bounces
				bl.text = "%d" % n
				bl.add_theme_color_override("font_color", pal[13])
				fill = pal[9]
				border = pal[11]
			"done":
				bl.text = "-"
				bl.add_theme_color_override("font_color", pal[4])
				fill = pal[1]
				border = pal[2]
		if row.get_meta("state", "") != e.state:
			row.set_meta("state", e.state)
			row.add_theme_stylebox_override("panel", UI.box(fill, border, Vector4(3, 1, 4, 1)))
			row.modulate = Color(1, 1, 1, 0.5) if e.state == "done" else Color.WHITE


func _refresh_upgrades(grid: GridContainer) -> void:
	for c in grid.get_children():
		c.queue_free()
	for id in upgrades:
		var def := Data.upgrade(id)
		var ic := UI.icon(Icons.get_icon("upgrade", id))
		ic.mouse_filter = Control.MOUSE_FILTER_STOP
		var n: int = upgrades[id]
		ic.tooltip_text = "%s%s\n%s" % [def.name, " x%d" % n if n > 1 else "", def.desc]
		if n > 1:
			var c := UI.num(str(n), pal[8])
			c.add_theme_font_size_override("font_size", 16)
			c.position = Vector2(9, 5)
			ic.add_child(c)
		grid.add_child(ic)


# ------------------------------------------------------------------ shop

func _open_shop() -> void:
	phase = "shop"
	_clear_popup()
	hud.visible = false
	field.visible = false
	field.running = false
	backdrop.frame = Rect2()
	shop_screen.visible = true
	reroll_count = 0
	free_rerolls = int(stats.get("free_reroll", 0.0))
	_roll_offers()
	_build_shop()
	sfx.play_music("shop")


func _owned_types() -> Array:
	var seen := []
	for t in owned:
		if not t in seen:
			seen.append(t)
	return seen


func _roll_rarity() -> String:
	var w: Dictionary = Data.rarity_weights(round_no, stats.get("luck", 0.0))
	var sum := 0.0
	for k in w:
		sum += w[k]
	var r := randf() * sum
	for k in Data.RARITIES:
		r -= w[k]
		if r <= 0.0:
			return k
	return "C"


func _pick_upgrade(pool: Array, taken: Array) -> String:
	var avail := pool.filter(func(u): return not u.id in taken)
	if avail.is_empty():
		return ""
	var rar := _roll_rarity()
	var same := avail.filter(func(u): return u.rarity == rar)
	var from: Array = same if not same.is_empty() else avail
	return from[randi() % from.size()].id


func _roll_offers() -> void:
	offers.clear()
	var types := _owned_types()
	var general := []
	var dedicated := []
	for u in Data.UPGRADES:
		if u.get("once", false) and upgrades.has(u.id):
			continue
		if u.has("for"):
			if u.for in types:
				dedicated.append(u)
		else:
			general.append(u)
	var taken := []
	for k in 3:
		var pool: Array = general
		# the third slot leans toward an upgrade for a ball you own
		if k == 2 and not dedicated.is_empty() and randf() < 0.65:
			pool = dedicated
		elif not dedicated.is_empty() and randf() < 0.2:
			pool = dedicated
		var id := _pick_upgrade(pool, taken)
		if id == "":
			id = _pick_upgrade(general, taken)
		taken.append(id)
		var def := Data.upgrade(id)
		offers.append({"kind": "upgrade", "id": id, "price": Data.price(def.cost, stats), "sold": false})
	var btaken := []
	for k in 3:
		var rar := _roll_rarity()
		var ids := Data.BALLS.keys().filter(func(b): return Data.BALLS[b].rarity == rar and not b in btaken)
		if ids.is_empty():
			ids = Data.BALLS.keys().filter(func(b): return not b in btaken)
		var id: String = ids[randi() % ids.size()]
		btaken.append(id)
		offers.append({"kind": "ball", "id": id, "price": Data.price(Data.ball(id).cost, stats), "sold": false})


func _slots() -> int:
	return Data.BALL_SLOTS + int(stats.get("slots", 0.0))


func _reroll_price() -> int:
	return 0 if free_rerolls > 0 else Data.REROLL_COST + reroll_count


func _build_shop() -> void:
	for c in shop_screen.get_children():
		c.queue_free()
	var head := UI.num("SHOP", pal[13], 32)
	head.position = Vector2(14, 2)
	shop_screen.add_child(head)
	var sub := UI.label("라운드 %d 클리어 · 다음 목표 %s" % [round_no, _fmt(Data.target(round_no + 1))], pal[6])
	sub.position = Vector2(92, 16)
	shop_screen.add_child(sub)
	for row in 2:
		var cap := UI.label("업그레이드" if row == 0 else "공", pal[6])
		cap.position = Vector2(14, 36 + row * 156)
		shop_screen.add_child(cap)
		for k in 3:
			var o: Dictionary = offers[row * 3 + k]
			var card := _shop_card(o)
			card.position = Vector2(14 + k * 130, 50 + row * 156)
			shop_screen.add_child(card)
	# side panel
	var side := UI.panel(Color(pal[1], 0.94), pal[4], Vector4(8, 6, 8, 6))
	side.position = Vector2(410, 50)
	side.custom_minimum_size = Vector2(222, 292)
	side.mouse_filter = Control.MOUSE_FILTER_PASS
	shop_screen.add_child(side)
	var v := UI.vbox(5)
	side.add_child(v)
	var gh := UI.hbox(8)
	gh.add_child(UI.label("골드", pal[6]))
	var gl := UI.num("$%d" % gold, pal[13], 32)
	gh.add_child(gl)
	v.add_child(gh)
	var bh := UI.hbox(6)
	v.add_child(bh)
	var rp := _reroll_price()
	var rb := UI.button("리롤 무료" if rp == 0 else "리롤 $%d" % rp, pal[4], pal[5])
	rb.disabled = gold < rp
	rb.pressed.connect(_reroll)
	bh.add_child(rb)
	var nb := UI.button("다음 라운드 ▶", pal[14], pal[15])
	nb.pressed.connect(func():
		sfx.play("click")
		_iris(func(): _start_round(round_no + 1)))
	bh.add_child(nb)
	v.add_child(UI.label("보유 공 %d/%d · 우클릭: 반값 판매" % [owned.size(), _slots()], pal[6]))
	var bg := GridContainer.new()
	bg.columns = 10
	bg.add_theme_constant_override("h_separation", 3)
	bg.add_theme_constant_override("v_separation", 3)
	v.add_child(bg)
	for i in owned.size():
		var t: String = owned[i]
		var def := Data.ball(t)
		var cell := PanelContainer.new()
		cell.add_theme_stylebox_override("panel", UI.box(pal[2], pal[Data.RARITY_COLOR[def.rarity]], Vector4(1, 1, 1, 1)))
		cell.add_child(UI.icon(Icons.get_icon("ball", t)))
		cell.mouse_filter = Control.MOUSE_FILTER_STOP
		cell.tooltip_text = "%s (%s)\n%s\n우클릭: $%d에 판매" % [def.name, Data.RARITY_NAME[def.rarity], def.desc, _sell_price(t)]
		var idx := i
		cell.gui_input.connect(func(ev: InputEvent):
			if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_RIGHT:
				_sell(idx))
		bg.add_child(cell)
	v.add_child(UI.label("업그레이드 %d개" % upgrades.size(), pal[6]))
	var ug := GridContainer.new()
	ug.columns = 11
	ug.add_theme_constant_override("h_separation", 2)
	ug.add_theme_constant_override("v_separation", 2)
	v.add_child(ug)
	_refresh_upgrades(ug)


func _shop_card(o: Dictionary) -> Control:
	var is_up: bool = o.kind == "upgrade"
	var def: Dictionary = Data.upgrade(o.id) if is_up else Data.ball(o.id)
	var rc := pal[Data.RARITY_COLOR[def.rarity]]
	var card := PanelContainer.new()
	card.custom_minimum_size = Vector2(124, 142)
	card.size = card.custom_minimum_size
	if o.sold:
		card.add_theme_stylebox_override("panel", UI.box(pal[1], pal[2]))
		var s := UI.label("판매 완료", pal[4])
		s.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		s.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		card.add_child(s)
		return card
	card.add_theme_stylebox_override("panel", UI.box(pal[2], rc, Vector4(5, 4, 5, 4)))
	card.mouse_filter = Control.MOUSE_FILTER_STOP
	var v := UI.vbox(2)
	card.add_child(v)
	var th := UI.hbox(3)
	th.add_child(UI.tag(Data.RARITY_NAME[def.rarity], rc, pal[0]))
	if is_up and def.has("for"):
		th.add_child(UI.tag("전용: " + Data.ball(def.for).name, pal[12], pal[0]))
	v.add_child(th)
	var ic := UI.icon(Icons.get_icon("upgrade" if is_up else "ball", o.id), 2)
	ic.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(ic)
	var nm := UI.label(def.name, pal[8])
	nm.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(nm)
	var desc := UI.label(def.desc, pal[6])
	desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	desc.custom_minimum_size = Vector2(112, 0)
	desc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(desc)
	if not is_up:
		var ball_info := UI.label("튕김 %d · 데미지 %s" % [def.bounce, str(def.dmg).trim_suffix(".0")], pal[15])
		ball_info.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		v.add_child(ball_info)
	var pt := UI.price_tag(o.price, gold >= o.price)
	pt.size_flags_vertical = Control.SIZE_SHRINK_END
	v.add_child(pt)
	card.mouse_entered.connect(func(): card.modulate = Color(1.15, 1.15, 1.15))
	card.mouse_exited.connect(func(): card.modulate = Color.WHITE)
	card.gui_input.connect(func(ev: InputEvent):
		if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
			_buy(o, card))
	return card


func _buy(o: Dictionary, card: Control) -> void:
	if o.sold:
		return
	if gold < o.price:
		_shake(card)
		_toast("골드가 부족해요")
		return
	if o.kind == "ball" and owned.size() >= _slots():
		_shake(card)
		_toast("공 칸이 가득 찼어요 (우클릭으로 판매)")
		return
	gold -= o.price
	o.sold = true
	if o.kind == "upgrade":
		add_upgrade(o.id)
	else:
		owned.append(o.id)
	sfx.play("buy")
	_build_shop()


func add_upgrade(id: String) -> void:
	upgrades[id] = upgrades.get(id, 0) + 1
	var mods: Dictionary = Data.upgrade(id).mods
	for k in mods:
		stats[k] = stats.get(k, 0.0) + float(mods[k])


func _sell_price(t: String) -> int:
	return maxi(1, Data.ball(t).cost / 2)


func _sell(i: int) -> void:
	if owned.size() <= 1:
		_toast("공이 하나는 있어야 해요")
		return
	gold += _sell_price(owned[i])
	owned.remove_at(i)
	sfx.play("blip")
	_build_shop()


func _reroll() -> void:
	var p := _reroll_price()
	if gold < p:
		return
	gold -= p
	if free_rerolls > 0:
		free_rerolls -= 1
	else:
		reroll_count += 1
	sfx.play("activate")
	_roll_offers()
	_build_shop()


# ------------------------------------------------------------------ effects

## Iris out to black around the middle of the field, run mid, iris back in
func _iris(mid: Callable) -> void:
	if iris_busy:
		return
	iris_busy = true
	iris_rect.mouse_filter = Control.MOUSE_FILTER_STOP
	var mat: ShaderMaterial = iris_rect.material
	mat.set_shader_parameter("center", FIELD_POS + Vector2(Field.W, Field.H))
	var tw := create_tween()
	tw.tween_method(func(r): mat.set_shader_parameter("radius", r), 420.0, 0.0, 0.45).set_ease(Tween.EASE_IN).set_trans(Tween.TRANS_QUAD)
	await tw.finished
	sfx.play("whoosh", 0.8)
	mid.call()
	await get_tree().create_timer(0.12).timeout
	var tw2 := create_tween()
	tw2.tween_method(func(r): mat.set_shader_parameter("radius", r), 0.0, 420.0, 0.5).set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_QUAD)
	await tw2.finished
	iris_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	iris_busy = false


func _stamp(text: String, col: Color) -> void:
	stamp.text = text
	stamp.add_theme_color_override("font_color", col)
	stamp.modulate = Color.WHITE
	stamp.scale = Vector2(1.6, 1.6)
	var tw := create_tween()
	tw.tween_property(stamp, "scale", Vector2.ONE, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_interval(0.9)
	tw.tween_property(stamp, "modulate:a", 0.0, 0.4)


func _toast(text: String) -> void:
	toast.text = text
	toast.modulate = Color.WHITE
	var tw := create_tween()
	tw.tween_interval(1.4)
	tw.tween_property(toast, "modulate:a", 0.0, 0.4)


func _pop(c: Control) -> void:
	c.scale = Vector2(1.3, 1.3)
	create_tween().tween_property(c, "scale", Vector2.ONE, 0.15)


func _shake(c: Control) -> void:
	var x: float = c.position.x
	var tw := create_tween()
	for k in 4:
		tw.tween_property(c, "position:x", x + (3 if k % 2 == 0 else -3), 0.04)
	tw.tween_property(c, "position:x", x, 0.04)
	sfx.play("land", 0.6)


static func _fmt(n: int) -> String:
	var s := str(absi(n))
	var out := ""
	while s.length() > 3:
		out = "," + s.substr(s.length() - 3) + out
		s = s.substr(0, s.length() - 3)
	return ("-" if n < 0 else "") + s + out


# ------------------------------------------------------------------ save

func _load() -> void:
	var cfg := ConfigFile.new()
	if cfg.load(SAVE_PATH) == OK:
		best_round = cfg.get_value("record", "best_round", 0)


func _save() -> void:
	var cfg := ConfigFile.new()
	cfg.set_value("record", "best_round", best_round)
	cfg.save(SAVE_PATH)
