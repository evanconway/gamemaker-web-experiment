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
	var entry_height = floor(string_height("ABC"));
	for (var i = 0; i < array_length(players); i++) {
		var player = players[i];
		var player_color = make_color_rgb(player.color.red, player.color.green, player.color.blue);
		var text = player.typed;
		draw_set_color(player_color);
		draw_set_alpha(1);
		var is_you = player.id == my_player_id;
		var player_typed_display = string_lower($"{is_you ? "YOU " : "OPPONENT"}: \"{is_you ? typed : text}\"");
		draw_text(0, entry_height * i, player_typed_display);
		var progress = game_data[$ "playersWordIndex"][$ player.id] / game_data[$ "wordsToWin"];
		draw_set_halign(fa_right);
		draw_text(display_get_gui_width(), entry_height * i, $"{floor(progress * 100)}%");
		draw_set_halign(fa_left);
		
		if (match_state != "results") {
			var progress_bar_height = 2;
			var bar_y = entry_height * i + entry_height - progress_bar_height;
			draw_rectangle(0, bar_y, floor(display_get_gui_width() * progress), bar_y + progress_bar_height, false);
		}
	}
	
	draw_set_color(c_white);
	draw_set_alpha(1);
	
	if (match_state == "play" && ready_time > 0) {
		draw_text_centered($"game starts in: {floor(ready_time / 1000000) + 1}");
	}
	if (match_state == "play" && ready_time <= 0) {
		draw_set_color(c_dkgray);
		for (var i = 1; i < array_length(game_data[$ "words"]); i++) {
			var word = game_data[$ "words"][i];
			draw_text_centered(word, entry_height * i);
		}
		draw_set_color(c_white);
		draw_text_centered(game_data[$ "words"][0]);
	}
	if (match_state == "results") {
		var won = game_data.victor.id == my_player_id;
		draw_text_centered($"Game complete.\n{ won ? "You won!" : "You lost."}\nPress Q to continue.");
	}
} else {
	draw_text(0, 0, "game state not recognized");
}
