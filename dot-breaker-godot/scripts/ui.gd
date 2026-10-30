extends RefCounted
## Pixel UI building blocks (after Pipstar's ui_kit). Sizes are in 640x360 canvas units.
## Two fonts: ThaleahFat for big numbers and English headings (16/32), Mona12 for Korean text (12).

static var pal: Array[Color] = []
static var num_font: FontFile
static var ko_font: FontVariation


static func setup(palette: Array[Color]) -> Theme:
	pal = palette
	num_font = load("res://fonts/ThaleahFat.ttf")
	var mona: FontFile = load("res://fonts/Mona12.ttf")
	for f in [num_font, mona]:
		f.antialiasing = TextServer.FONT_ANTIALIASING_NONE
		f.hinting = TextServer.HINTING_NONE
		f.subpixel_positioning = TextServer.SUBPIXEL_POSITIONING_DISABLED
	ko_font = FontVariation.new()
	ko_font.base_font = mona
	var theme := Theme.new()
	theme.default_font = ko_font
	theme.default_font_size = 12
	theme.set_stylebox("panel", "TooltipPanel", box(pal[1], pal[5], Vector4(6, 4, 6, 4)))
	theme.set_color("font_color", "TooltipLabel", pal[8])
	return theme


## 9x9 nine-slice: 1px border, hard 2px drop shadow to the bottom right
static func box(fill: Color, border: Color, pad := Vector4(8, 6, 8, 6)) -> StyleBoxTexture:
	var img := Image.create(9, 9, false, Image.FORMAT_RGBA8)
	img.fill(Color(0, 0, 0, 0))
	img.fill_rect(Rect2i(2, 2, 7, 7), Color.BLACK)
	img.fill_rect(Rect2i(0, 0, 7, 7), border)
	img.fill_rect(Rect2i(1, 1, 5, 5), fill)
	var sb := StyleBoxTexture.new()
	sb.texture = ImageTexture.create_from_image(img)
	sb.texture_margin_left = 2
	sb.texture_margin_top = 2
	sb.texture_margin_right = 3
	sb.texture_margin_bottom = 3
	sb.content_margin_left = pad.x
	sb.content_margin_top = pad.y
	sb.content_margin_right = pad.z + 2
	sb.content_margin_bottom = pad.w + 2
	return sb


static func panel(fill := Color(0, 0, 0, 0), border := Color(0, 0, 0, 0), pad := Vector4(8, 6, 8, 6)) -> PanelContainer:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", box(fill if fill.a > 0 else Color(pal[1], 0.94), border if border.a > 0 else pal[4], pad))
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return p


## Korean text (Mona12)
static func label(text: String, color := Color(0, 0, 0, 0), size := 12) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_override("font", ko_font)
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color if color.a > 0 else pal[7])
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l


## Numbers and English headings (ThaleahFat)
static func num(text: String, color := Color(0, 0, 0, 0), size := 16) -> Label:
	var l := label(text, color, size)
	l.add_theme_font_override("font", num_font)
	l.add_theme_color_override("font_shadow_color", Color.BLACK)
	l.add_theme_constant_override("shadow_offset_x", 1)
	l.add_theme_constant_override("shadow_offset_y", 1)
	return l


static func vbox(sep := 0) -> VBoxContainer:
	var b := VBoxContainer.new()
	b.add_theme_constant_override("separation", sep)
	b.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return b


static func hbox(sep := 6) -> HBoxContainer:
	var b := HBoxContainer.new()
	b.add_theme_constant_override("separation", sep)
	b.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return b


static func button(text: String, fill: Color, hover: Color, ink := Color(0, 0, 0, 0)) -> Button:
	var b := Button.new()
	b.text = text
	b.focus_mode = Control.FOCUS_NONE
	b.add_theme_font_override("font", ko_font)
	b.add_theme_font_size_override("font_size", 12)
	var c := ink if ink.a > 0 else pal[8]
	for s in ["font_color", "font_hover_color", "font_pressed_color"]:
		b.add_theme_color_override(s, c)
	b.add_theme_color_override("font_disabled_color", pal[5])
	b.add_theme_stylebox_override("normal", box(fill, pal[1], Vector4(10, 4, 10, 4)))
	b.add_theme_stylebox_override("hover", box(hover, pal[8], Vector4(10, 4, 10, 4)))
	b.add_theme_stylebox_override("pressed", box(hover, pal[13], Vector4(10, 5, 10, 3)))
	b.add_theme_stylebox_override("disabled", box(pal[2], pal[3], Vector4(10, 4, 10, 4)))
	return b


## Icon scaled up by whole pixels
static func icon(tex: Texture2D, scale := 1) -> TextureRect:
	var t := TextureRect.new()
	t.texture = tex
	t.custom_minimum_size = Vector2(16, 16) * scale
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	t.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	return t


## Small colored tag (rarity, "전용")
static func tag(text: String, fill: Color, ink: Color) -> PanelContainer:
	var p := panel(fill, pal[1], Vector4(3, 1, 3, 0))
	p.add_child(label(text, ink))
	return p


## Price: coin + number, red when you can't afford it
static func price_tag(amount: int, ok: bool) -> HBoxContainer:
	var h := hbox(2)
	h.alignment = BoxContainer.ALIGNMENT_CENTER
	var c := icon(load("res://assets/ui/coin.png"))
	c.custom_minimum_size = Vector2(7, 7)
	h.add_child(c)
	h.add_child(num(str(amount), pal[13] if ok else pal[11]))
	return h
