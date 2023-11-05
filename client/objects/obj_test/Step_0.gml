if (keyboard_check_pressed(vk_space)) {
	var data = "socket data";
	var size = string_byte_length(data) + 1;
	var buffer = buffer_create(size, buffer_fixed, 1);
	buffer_write(buffer, buffer_string, data);
	network_send_raw(socket, buffer, size);
	buffer_delete(buffer);
}

if (keyboard_check_pressed(vk_enter)) {
	var map = ds_map_create();
	var data = "http data";
	var request_id = http_request("http://localhost:8000", "GET", map, data);
	show_debug_message($"http request made id: {request_id}");
}

if (keyboard_check_pressed(ord("Q"))) game_end();
