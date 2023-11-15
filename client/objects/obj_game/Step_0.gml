if (my_player_id == "") exit;

var match_state = game_data[$ "matchState"];

if (application_state_prev != "ingame" && application_state == "ingame") {
	music = play_sound(snd_music, 0.8, true);
}

if (application_state != "ingame" || match_state != "play") audio_stop_sound(snd_music);

track_time = max(track_time, audio_sound_get_track_position(music));

if (application_state == "title") {
	if (keyboard_check_pressed(vk_anykey)) {
		send_server_data("player_add_to_queue", { player_id: my_player_id });
	}
} else if (application_state == "ingame" && match_state == "play" && track_time > music_intro_time) {
	var to_send = { player_id: my_player_id, match_event: "" };
	
	var players = variable_struct_exists(game_data, "players") ? variable_struct_get(game_data, "players") : [];
	var my_index = array_find_index(players, function(p) {
		if (p.id == my_player_id) return true;
		return false;
	});

	if (my_index < 0) exit;

	var player = players[my_index];
	var typed_pre_input = typed;
	var target_word = string_lower(match_words[match_word_index]);
	var max_index = array_length(match_words) - 1;
	
	// don't allow input if player already has word and has typed all words
	if (typed != target_word || match_word_index < max_index) {
		typed += get_text_pressed();
		if (keyboard_check_pressed(vk_backspace)) {
			typed = keyboard_check(vk_control) ? "" : string_delete(typed, string_length(typed), 1);
		}
		typed = string_lower(typed); // reassign lowered value after typing
		if (typed_pre_input != typed) {
			if (target_word == typed) {
				play_sound(snd_success);
				typed = match_word_index == max_index ? typed : "";
				match_word_index = min(match_word_index + 1, max_index);
			} else if (string_length(typed_pre_input) > string_length(typed)) play_sound(snd_delete);
			else if (string_starts_with(target_word, typed)) play_sound(snd_type);
			else play_sound(snd_type_wrong);
			to_send[$ "match_event"] = "update";
			to_send[$ "typed"] = typed;
			to_send[$ "match_word_index"] = match_word_index;
		}
	}
	
	if (to_send[$ "match_event"] != "") send_server_data("update_match", to_send);
} else if (application_state == "ingame" && match_state == "results") {
	match_words = [];
	if (keyboard_check_pressed(ord("Q"))) {
		send_server_data("update_match", {
			player_id: my_player_id,
			match_event: "quit",
		});
	}
}

application_state_prev = application_state;
