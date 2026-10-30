extends SceneTree
## Builds icon.png (the window / project icon) from the Nova ball icon:
##   godot --headless --path . --script res://tools/make_icon.gd

const Data := preload("res://scripts/data.gd")
const Icons := preload("res://scripts/icons.gd")


func _init() -> void:
	var pal: Array[Color] = []
	for h in Data.PALETTE_HEX:
		pal.append(Color(h))
	Icons.pal = pal
	var img := Icons.draw("ball", "nova")
	img.resize(128, 128, Image.INTERPOLATE_NEAREST)
	img.save_png("res://icon.png")
	quit()
