var players = variable_struct_exists(state, "players") ? variable_struct_get(state, "players") : {};
var player = variable_struct_exists(players, my_player_id) ? variable_struct_get(players, my_player_id) : undefined;

draw_set_color(c_white);
	draw_set_alpha(1);

if (player == undefined) {
	draw_text(0, 0, "Player data is not in state");
	exit;
}

if (player.queue < 0) {
	draw_text(0, 0, "Ready to play? Press any key to search for a game.");
}
