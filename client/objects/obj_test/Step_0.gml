var match_state = game_data[$ "state"];

if (application_state_prev != "ingame" && application_state == "ingame") {
	ready_time = 3000000;
}

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
	
	// don't allow input if player already has word
	if (player.typed != game_data[$ "word"]) {
		var text_typed = player.typed + get_text_pressed();
		if (keyboard_check_pressed(vk_backspace)) {
			text_typed = string_delete(text_typed, string_length(text_typed), 1);
		}
	
		if (text_typed != player.typed) {
			show_debug_message($"typed: {text_typed}");
			to_send[$ "match_event"] = "update";
			to_send[$ "typed"] = text_typed;
		}
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
