if (my_player_id == "") exit;

var match_state = game_data[$ "matchState"];

if (application_state_prev != "ingame" && application_state == "ingame") {
	ready_time = 10666666;
	play_sound(snd_music, 0.8);
}

if (application_state != "ingame" || match_state != "play") audio_stop_sound(snd_music);

if (application_state == "title") {
	if (keyboard_check_pressed(vk_anykey)) {
		send_server_data("player_add_to_queue", { player_id: my_player_id });
	}
} else if (application_state == "ingame" && match_state == "play" && ready_time > 0) {
	ready_time -= delta_time;
} else if (application_state == "ingame" && match_state == "play" && ready_time <= 0) {
	var to_send = { player_id: my_player_id, match_event: "" };
	
	var players = variable_struct_exists(game_data, "players") ? variable_struct_get(game_data, "players") : [];
	var my_index = array_find_index(players, function(p) {
		if (p.id == my_player_id) return true;
		return false;
	});

	if (my_index < 0) exit;

	var player = players[my_index];
	var typed_pre_input = typed;
	
	var lowered_typed = string_lower(typed);
	var lowered_word = string_lower(game_data[$ "words"][game_data[$ "playersWordIndex"]]);
	
	// don't allow input if player already has word
	if (lowered_typed != lowered_word) {
		typed += get_text_pressed();
		if (keyboard_check_pressed(vk_backspace)) {
			typed = string_delete(typed, string_length(typed), 1);
		}
		lowered_typed = string_lower(typed); // reassign lowered value after typing
		if (typed_pre_input != typed) {
			if (lowered_word == lowered_typed) play_sound(snd_success);
			else if (string_length(typed_pre_input) > string_length(typed)) play_sound(snd_delete);
			else if (string_starts_with(lowered_word, lowered_typed)) play_sound(snd_type);
			else play_sound(snd_type_wrong);
			to_send[$ "match_event"] = "update";
			to_send[$ "typed"] = typed;
		}
	} else {
		debug_log("got the word");
	}
	
	if (lowered_typed == lowered_word) {
		debug_log("see what happens");
	}
	
	if (to_send[$ "match_event"] != "") send_server_data("update_match", to_send);
} else if (application_state == "ingame" && match_state == "results") {
	if (keyboard_check_pressed(ord("Q"))) {
		send_server_data("update_match", {
			player_id: my_player_id,
			match_event: "quit",
		});
	}
}

application_state_prev = application_state;
