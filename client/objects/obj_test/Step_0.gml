if (application_state == "title" && keyboard_check_pressed(vk_anykey)) {
	send_server_data("player_add_to_queue", { player_id: my_player_id });
	exit;
}

// handle movement
/*
var vel_x = 0;
var vel_y = 0;

var dt = delta_time / (1000000 / game_get_speed(gamespeed_fps));
var vel = 5 * dt;

if (keyboard_check(vk_left)) vel_x -= vel;
if (keyboard_check(vk_right)) vel_x += vel;
if (keyboard_check(vk_up)) vel_y -= vel;
if (keyboard_check(vk_down)) vel_y += vel;

if (player != undefined && (vel_x != 0 || vel_y != 0)) {
	var position_x = player.position.x + vel_x;
	var position_y = player.position.y + vel_y;
	send_struct_on_socket({
		event: "player_update_position",
		player_id: my_player_id,
		position_x: position_x,
		position_y: position_y,
	}, socket);
}
*/