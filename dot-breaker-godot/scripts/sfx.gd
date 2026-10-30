extends Node
## Sound: a pool of one-shot players with a per-sound cooldown (hundreds of block hits a second
## would otherwise stack into noise), and background music crossfaded between title, game and shop.

const STREAMS := {
	"click": "res://assets/audio/ui_button_click.wav",
	"buy": "res://assets/audio/item_buy.wav",
	"activate": "res://assets/audio/item_activation.wav",
	"whoosh": "res://assets/audio/whoosh.wav",
	"hit": "res://assets/audio/die_hit.wav",
	"land": "res://assets/audio/die_land.wav",
	"blip": "res://assets/audio/blip.wav",
	"boom": "res://assets/audio/star_hit.wav",
	"score": "res://assets/audio/score_calculation.wav",
	"tear": "res://assets/audio/tear.wav",
}
const MUSIC := {
	"title": "res://assets/audio/bgm_title.mp3",
	"game": "res://assets/audio/bgm_game.mp3",
	"shop": "res://assets/audio/bgm_shop.mp3",
}
const MUSIC_DB := {"title": -11.0, "game": -7.0, "shop": -10.4}
const COOLDOWN := {"hit": 0.045, "blip": 0.06, "boom": 0.09, "land": 0.05}
const POOL := 12

var streams := {}
var players: Array[AudioStreamPlayer] = []
var next_player := 0
var last := {}
var music := {}
var current := ""
var muted := false


func _ready() -> void:
	for k in STREAMS:
		streams[k] = load(STREAMS[k])
	for i in POOL:
		var p := AudioStreamPlayer.new()
		add_child(p)
		players.append(p)
	for k in MUSIC:
		var m := AudioStreamPlayer.new()
		var s: AudioStream = load(MUSIC[k])
		if s is AudioStreamMP3:
			s.loop = true
		m.stream = s
		m.volume_db = -80.0
		add_child(m)
		music[k] = m


func play(sound: String, pitch := 1.0, db := 0.0) -> void:
	if muted or not streams.has(sound):
		return
	var now := Time.get_ticks_msec() / 1000.0
	if now - float(last.get(sound, -1.0)) < COOLDOWN.get(sound, 0.0):
		return
	last[sound] = now
	var p := players[next_player]
	next_player = (next_player + 1) % POOL
	p.stream = streams[sound]
	p.pitch_scale = pitch
	p.volume_db = db
	p.play()


func play_music(which: String) -> void:
	if which == current:
		return
	current = which
	for k in music:
		var m: AudioStreamPlayer = music[k]
		if k == which:
			if not m.playing:
				m.play()
			create_tween().tween_property(m, "volume_db", -80.0 if muted else MUSIC_DB[k], 0.8)
		elif m.playing:
			var tw := create_tween()
			tw.tween_property(m, "volume_db", -80.0, 0.8)
			tw.tween_callback(m.stop)


func toggle_mute() -> void:
	muted = not muted
	for k in music:
		music[k].volume_db = -80.0 if muted or k != current else MUSIC_DB[k]
