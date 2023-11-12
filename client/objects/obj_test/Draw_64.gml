var match_state = game_data[$ "state"];

draw_set_halign(fa_left);
draw_set_valign(fa_top);

if (application_state == "connecting_to_server") {
	draw_text_centered("Connecting to server...");
} else if (application_state == "title") {
	draw_text_centered("Ready to play?\nPress any key to search for a match.");
} else if (application_state == "queued") {
	draw_text_centered("Searching for a game...");
} else if (application_state == "ingame") {
	var players = variable_struct_exists(game_data, "players") ? variable_struct_get(game_data, "players") : [];
	for (var i = 0; i < array_length(players); i++) {
		var player = players[i];
		var player_color = make_color_rgb(player.color.red, player.color.green, player.color.blue);
		var text = player.typed;
		draw_set_color(player_color);
		draw_set_alpha(1);
		var is_you = player.id == my_player_id;
		draw_text(0, 16 * i, $"{is_you ? "YOU " : "OPPONENT"}: \"{is_you ? typed : text}\"");
	}
	
	draw_set_color(c_white);
	draw_set_alpha(1);
	
	if (match_state == "play" && ready_time > 0) {
		draw_text_centered($"game starts in: {floor(ready_time / 1000000) + 1}");
	}
	if (match_state == "play" && ready_time <= 0) {
		var word = game_data[$ "word"];
		draw_text_centered(word);
	}
	if (match_state == "results") {
		var won = game_data.victor.id == my_player_id;
		draw_text_centered($"Game complete.\n{ won ? "You won!" : "You lost."}\nPress Q to continue.");
	}
} else {
	draw_text(0, 0, "game state not recognized");
}
