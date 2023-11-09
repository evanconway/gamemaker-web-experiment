var match_state = game_data[$ "state"];
var start_time = game_data[$ "startTime"];

// feather ignore once GM1010
var readying = start_time == undefined ? false : (current_time > start_time + 5000);

if (application_state == "title") {
	if (keyboard_check_pressed(vk_anykey)) {
		send_server_data("player_add_to_queue", { player_id: my_player_id });
	}
} else if (application_state == "ingame" && match_state == "play" && !readying) {
	var to_send = {
		player_id: my_player_id,
		match_event: "",
	}
	
	var players = variable_struct_exists(game_data, "players") ? variable_struct_get(game_data, "players") : [];
	var my_index = array_find_index(players, function(p) {
		if (p.id == my_player_id) return true;
		return false;
	});

	if (my_index < 0) exit;

	var player = players[my_index];
	
	var vel_x = 0;
	var vel_y = 0;

	var dt = delta_time / (1000000 / game_get_speed(gamespeed_fps));
	var vel = 5 * dt;

	if (keyboard_check(vk_left)) vel_x -= vel;
	if (keyboard_check(vk_right)) vel_x += vel;
	if (keyboard_check(vk_up)) vel_y -= vel;
	if (keyboard_check(vk_down)) vel_y += vel;
	
	if (vel_x != 0 || vel_y != 0) {
		var position_x = player.position.x + vel_x;
		var position_y = player.position.y + vel_y;
		to_send[$ "match_event"] = "update";
		to_send[$ "position_x"] = position_x;
		to_send[$ "position_y"] = position_y;
	}
	
	if (keyboard_check_pressed(ord("W"))) {
		to_send[$ "match_event"] = "update";
		to_send[$ "win"] = true;
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
