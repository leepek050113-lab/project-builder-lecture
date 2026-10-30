extends Node
## Bot playthrough: plays runs through main itself (drops, shop buys, next rounds) at high speed
## and prints how far each run gets. Screenshots too when SHOT_DIR is set (run with a display):
##   godot --headless --path . res://tests/bot_check.tscn          (balance numbers)
##   SHOT_DIR=/tmp/shots godot --path . res://tests/bot_check.tscn  (screenshots, one run)
## RUNS=n sets how many runs.

var OUT := OS.get_environment("SHOT_DIR")
var main
var results := []
var shots := {}


func wait(s: float) -> void:
	await get_tree().create_timer(s, true, false, false).timeout


func shot(n: String) -> void:
	if OUT == "" or shots.has(n):
		return
	shots[n] = true
	await RenderingServer.frame_post_draw
	get_viewport().get_texture().get_image().save_png(OUT + "/" + n + ".png")


func _ready() -> void:
	var runs := int(OS.get_environment("RUNS")) if OS.get_environment("RUNS") != "" else (1 if OUT != "" else 12)
	if OUT == "":
		Engine.time_scale = 8.0
		Engine.max_physics_steps_per_frame = 16
	main = load("res://main.tscn").instantiate()
	add_child(main)
	await wait(0.5)
	await shot("01_title")
	for r in runs:
		results.append(await play_run())
	var rounds := results.map(func(x): return x[0])
	rounds.sort()
	print("rounds reached: ", rounds, "  median ", rounds[rounds.size() / 2])
	for x in results:
		print("  run: round ", x[0], "  ", x[1])
	get_tree().quit()


func play_run() -> Array:
	main._iris(main._new_run)
	await wait(1.4)
	var log := []
	while true:
		match main.phase:
			"play":
				await play_round()
			"clear":
				log.append("r%d %ds" % [main.round_no, int(main.Data.ROUND_TIME + main.stats.get("time", 0.0) - main.time_left)])
				await wait(1.3)
				if main.round_no == 1:
					await shot("04_clear")
				if main.round_no >= 20:
					return [main.round_no, " ".join(log)]
				main._clear_popup()
				main._open_shop()
				await wait(0.3)
				await shot("05_shop")
				shop()
				await wait(0.2)
				if main.round_no == 3:
					await shot("06_shop_later")
				main._start_round(main.round_no + 1)
			"over":
				await wait(1.4)
				await shot("07_over")
				main._clear_popup()
				log.append("%s %d/%d" % [main.get_meta("fail", ""), int(main.field.score), main.target])
				return [main.round_no, " ".join(log)]
		await wait(0.05)
	return []


## Drop the first ball, wait a bit for it to clear a path, then send the rest
func play_round() -> void:
	await wait(0.3)
	await shot("02_round_start")
	main.field.aim_dir = Vector2.RIGHT.rotated(randf() * TAU)
	main._drop_next()
	await wait(2.0)
	await shot("03_play")
	while main.phase == "play" and not main._ready_entries().is_empty():
		main.field.aim_dir = Vector2.RIGHT.rotated(randf() * TAU)
		main._drop_next()
		await wait(0.6)
		if main.round_no == 3:
			await shot("03b_play_r3")
	while main.phase == "play":
		await wait(0.1)


## Greedy shopper: balls first while there is room, then upgrades, cheapest-rarest first
func shop() -> void:
	for pass_no in 2:
		var order: Array = main.offers.duplicate()
		order.shuffle()
		order.sort_custom(func(a, b): return (a.kind == "ball") and not (b.kind == "ball") if main.owned.size() < 8 else (a.kind == "upgrade") and not (b.kind == "upgrade"))
		for o in order:
			if not o.sold and main.gold >= o.price:
				main._buy(o, Control.new())
		if main.gold >= main._reroll_price() + 6:
			main._reroll()
