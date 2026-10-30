extends Node2D
## Space behind everything: the dark sky with slowly twinkling stars, and the frame around the field.

var pal: Array[Color] = []
var stars: Array = []          # [pos, palette index, phase]
var frame := Rect2()           # the field's rect; empty = no frame


func setup(palette: Array[Color]) -> void:
	pal = palette
	var rng := RandomNumberGenerator.new()
	rng.seed = 7
	for k in 160:
		stars.append([Vector2(rng.randi_range(0, 639), rng.randi_range(0, 359)), [3, 4, 5, 6, 15, 12][rng.randi_range(0, 5)], rng.randf() * TAU])


func _process(_dt: float) -> void:
	queue_redraw()


func _draw() -> void:
	if pal.is_empty():
		return
	draw_rect(Rect2(0, 0, 640, 360), pal[1])
	var t := Time.get_ticks_msec() / 1000.0
	for s in stars:
		var a: float = 0.35 + 0.65 * (0.5 + 0.5 * sin(t * 1.3 + s[2]))
		draw_rect(Rect2(s[0], Vector2.ONE), Color(pal[s[1]], a))
	if frame.size != Vector2.ZERO:
		var r := frame.grow(4)
		draw_rect(Rect2(r.position + Vector2(2, 2), r.size), Color.BLACK)
		draw_rect(r, pal[4])
		draw_rect(r.grow(-1), pal[0])
		draw_rect(r.grow(-2), pal[3])
		draw_rect(r.grow(-3), pal[0])
