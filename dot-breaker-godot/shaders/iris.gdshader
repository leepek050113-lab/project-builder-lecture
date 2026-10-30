// Iris wipe: everything outside a circle is covered. The circle edge is snapped to the 2px game
// grid so it stays pixel-art, with a thin ring in the accent color just inside the dark.
shader_type canvas_item;

uniform float radius = 800.0;          // in canvas pixels
uniform vec2 center = vec2(320.0, 180.0);
uniform vec2 canvas = vec2(640.0, 360.0);
uniform vec4 dark : source_color = vec4(0.027, 0.024, 0.051, 1.0);
uniform vec4 ring : source_color = vec4(0.706, 0.424, 0.941, 1.0);

void fragment() {
	vec2 p = floor(UV * canvas / 2.0) * 2.0 + 1.0;
	float d = distance(p, center);
	if (d < radius) {
		COLOR = vec4(0.0);
	} else if (d < radius + 3.0 && radius > 1.0) {
		COLOR = ring;
	} else {
		COLOR = dark;
	}
}
