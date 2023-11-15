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
	for (var i = 0; i < array_length(players); i++) {
		var player = players[i];
		var player_color = make_color_rgb(player.color.red, player.color.green, player.color.blue);
		var text = player.typed;
		draw_set_color(player_color);
		draw_set_alpha(1);
		var is_you = player.id == my_player_id;
		var player_typed_display = string_lower($"{is_you ? "YOU" : "OPP"}: \"{is_you ? typed : text}\"");
		var h_spacer = 10;
		draw_text(h_spacer, entry_height * i, player_typed_display);
		var progress = game_data[$ "playersWordIndex"][$ player.id] / game_data[$ "wordsToWin"];
		draw_set_halign(fa_right);
		draw_text(display_get_gui_width() - h_spacer, entry_height * i, $"{floor(progress * 100)}%");
		draw_set_halign(fa_left);
		
		if (match_state != "results") {
			var progress_bar_height = 2;
			var bar_y = entry_height * i + entry_height - progress_bar_height;
			draw_rectangle(0, bar_y, floor(display_get_gui_width() * progress), bar_y + progress_bar_height, false);
		}
	}
	
	draw_set_color(c_white);
	draw_set_alpha(1);
	var track_time = audio_sound_get_track_position(music);
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
		if (match_word_index < array_length(match_words)) draw_text_centered(match_words[match_word_index]);
	}
	if (match_state == "results") {
		var won = game_data.victor.id == my_player_id;
		draw_text_centered($"Game complete.\n{ won ? "You won!" : "You lost."}\nPress Q to continue.");
	}
} else {
	draw_text(0, 0, "game state not recognized");
}
