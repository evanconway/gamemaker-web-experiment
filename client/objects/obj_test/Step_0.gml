if (keyboard_check_pressed(vk_space)) {
	var buffer = struct_to_buffer({ test_socket: "fake socket data" });
	network_send_raw(socket, buffer, buffer_get_size(buffer));
	buffer_delete(buffer);
}

if (keyboard_check_pressed(vk_enter)) {
    var data = json_stringify({ test_http: "fake http data" });
    var map = ds_map_create();
    var request_id = http_request("http://" + global.domain + ":8000", "POST", map, data);
    ds_map_destroy(map);
}

var players = variable_struct_exists(state, "players") ? variable_struct_get(state, "players") : {};
var player = variable_struct_exists(players, my_player_id) ? variable_struct_get(players, my_player_id) : undefined;

if (player == undefined) {
	// do nothing
	// should be removed later, this is mostly for debug
	exit
}



// handle movement
var vel_x = 0;
var vel_y = 0;

var dt = delta_time / (1000000 / game_get_speed(gamespeed_fps));
var vel = 5 * dt;

if (keyboard_check(vk_left)) vel_x -= vel;
if (keyboard_check(vk_right)) vel_x += vel;
if (keyboard_check(vk_up)) vel_y -= vel;
if (keyboard_check(vk_down)) vel_y += vel;

var players = variable_struct_exists(state, "players") ? variable_struct_get(state, "players") : {};
var player = variable_struct_exists(players, my_player_id) ? variable_struct_get(players, my_player_id) : undefined;

if (player != undefined && (vel_x != 0 || vel_y != 0)) {
	var position_x = player.position.x + vel_x;
	var position_y = player.position.y + vel_y;
	var buffer = struct_to_buffer({
		event: "player_update_position",
		player_id: my_player_id,
		position_x: position_x,
		position_y: position_y,
	});
	network_send_raw(socket, buffer, buffer_get_size(buffer));
	buffer_delete(buffer);
}
