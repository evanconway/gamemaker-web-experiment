var match_state = game_data[$ "state"];

draw_set_halign(fa_left);
draw_set_valign(fa_top);

if (application_state == "connecting_to_server") {
	draw_text(0, 0, "Connecting to server...");
} else if (application_state == "title") {
	draw_text(0, 0, "Ready to play? Press any key to search for a game.");
} else if (application_state == "queued") {
	draw_text(0, 0, "Searching for a game...");
} else if (application_state == "ingame") {
	var players = variable_struct_exists(game_data, "players") ? variable_struct_get(game_data, "players") : [];
	for (var i = 0; i < array_length(players); i++) {
		var player = players[i];
		var player_color = make_color_rgb(player.color.red, player.color.green, player.color.blue);
		var text = player.typed;
		draw_set_color(player_color);
		draw_set_alpha(1);
		var is_you = player.id == my_player_id;
		draw_text(0, 16 * i, $"{is_you ? "YOU " : "OPPONENT"}: \"{text}\"");
	}
	
	draw_set_color(c_white);
	draw_set_alpha(1);
	
	if (match_state == "play" && ready_time > 0) {
		draw_text(0, 0, $"game starts in: {floor(ready_time / 1000000) + 1}");
	}
	if (match_state == "play" && ready_time <= 0) {
		var word = game_data[$ "word"];
		// feather ignore once GM1041
		var word_width = string_width(word);
		// feather ignore once GM1041
		var word_height = string_height(word);
		var draw_x = display_get_gui_width() / 2  - word_width / 2;
		var draw_y = display_get_gui_height() / 2  - word_height / 2;
		draw_text(draw_x, draw_y, word);
	}
	if (match_state == "results") {
		draw_text(0, 0, "Game complete. Q to return.");
	}
} else {
	draw_text(0, 0, "game state not recognized");
}
