draw_set_font(fnt_game);
draw_set_alpha(1);
draw_set_color(c_white);
draw_set_valign(fa_middle);
draw_set_halign(fa_center);
draw_text_transformed(
	display_get_gui_width() / 2,
	display_get_gui_height() / 2,
	"The Weight of Words",
	2,
	2,
	0
);
