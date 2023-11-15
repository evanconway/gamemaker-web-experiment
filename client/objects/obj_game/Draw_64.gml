var match_state = game_data[$ "matchState"];

draw_set_halign(fa_left);
draw_set_valign(fa_top);

if (application_state == "connecting_to_server") {
	draw_text_centered("Connecting to server...");
} else if (application_state == "title") {
	draw_set_color(c_white);
	draw_set_alpha(1)
	draw_text(0, 0, $"players online: {game_data[$ "playersOnline"]}");
	draw_text_centered("Ready to play?\nPress any key to search for a match.");
} else if (application_state == "queued") {
	draw_set_color(c_white);
	draw_set_alpha(1)
	draw_text(0, 0, $"players online: {game_data[$ "playersOnline"]}");
	draw_text_centered("Searching for a game...");
} else if (application_state == "ingame") {
	var players = variable_struct_exists(game_data, "players") ? variable_struct_get(game_data, "players") : [];
	var entry_height = floor(string_height("ABC"));
	var i_y = 0;
	for (var i = 0; i < array_length(players); i++) {
		var player = players[i];
		var player_color = make_color_rgb(player.color.red, player.color.green, player.color.blue);
		var text = player.typed;
		draw_set_color(player_color);
		draw_set_alpha(1);
		var is_you = player.id == my_player_id;
		var player_typed_display = string_lower($"{is_you ? "you" : "opponent:"} {is_you ? "" : text}");
		var h_spacer = 10;
		var draw_y = is_you ? 0 : entry_height * (i_y + 1);
		draw_text(h_spacer, draw_y, player_typed_display);
		var progress = game_data[$ "playersWordIndex"][$ player.id] / game_data[$ "wordsToWin"];
		draw_set_halign(fa_right);
		draw_text(display_get_gui_width() - h_spacer, draw_y, $"{floor(progress * 100)}%");
		draw_set_halign(fa_left);
		if (match_state != "results") {
			var progress_bar_height = 2;
			var bar_y = draw_y + entry_height - progress_bar_height;
			draw_rectangle(0, bar_y, floor(display_get_gui_width() * progress), bar_y + progress_bar_height, false);
		}
		if (!is_you) i_y++;
	}
	
	draw_set_color(c_white);
	draw_set_alpha(1);
	var music_interval = music_intro_time / 4;
	var num_of_players = array_length(players);
	if (match_state == "play" && track_time < music_intro_time) {
		if (track_time < music_interval * 1) draw_text_centered($"type {game_data[$ "wordsToWin"]} words");
		else if (track_time < music_interval * 2) draw_text_centered($"{num_of_players} typist{num_of_players > 1 ? "s" : ""}");
		else if (track_time < music_interval * 3) {
			if (track_time > (music_intro_time * 5/8) && track_time < (music_intro_time *3/4)) {
				var fade_time = music_interval / 2;
				var new_alpha = (music_intro_time * 3/4 - track_time)  / fade_time;
				draw_set_alpha(new_alpha);
			} else draw_set_alpha(1);
			draw_text_centered(num_of_players > 1 ? "first to finish wins" : "finish to win");
			draw_set_alpha(1);
		} else draw_text_centered($"game starts in: {floor((music_intro_time - track_time) / (music_interval / 4)) + 1}", -30);
	}
	if (match_state == "play" && track_time >= music_interval * 3) {
		draw_set_color(c_dkgray);
		var max_word_display_index = min(match_word_index + 6, array_length(match_words));
		var draw_y = 1;
		for (var i = match_word_index + 1; i < max_word_display_index; i++) {
			var word = match_words[i];
			draw_text_centered(word, entry_height * draw_y);
			draw_y++;
		}
		draw_set_color(track_time < music_intro_time ? c_dkgray : c_white);
		var target_word = match_words[match_word_index];
		if (match_word_index < array_length(match_words)) draw_text_centered(target_word);
		
		// draw typed correct/error
		var correct = "";
		var error = "";
		var add_to_correct = true;
		for (var i = 1; i <= string_length(typed); i++) {
			if (!add_to_correct || string_char_at(typed, i) != string_char_at(target_word, i)) {
				add_to_correct = false;
			}
			if (add_to_correct) correct += string_char_at(typed, i);
			else error += string_char_at(typed, i);
		}
		
		draw_set_halign(fa_left);
		draw_set_valign(fa_top);
		var error_x = display_get_gui_width() / 2 - string_width(target_word) / 2;
		var error_y = display_get_gui_height() / 2 - string_height(target_word) / 2;
		
		draw_set_color(c_lime);
		draw_text(error_x, error_y - 14, correct);
		draw_set_color(c_red);
		draw_text(error_x + string_width(correct), error_y - 14, error);
	}
	if (match_state == "results") {
		var won = game_data.victor.id == my_player_id;
		draw_text_centered($"Game complete.\n{ won ? "You won!" : "You lost."}\nPress Q to continue.");
	}
} else {
	draw_text(0, 0, "game state not recognized");
}
