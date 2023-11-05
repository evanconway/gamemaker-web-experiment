if (keyboard_check_pressed(vk_space)) {
	var data = "socket data";
	var size = string_byte_length(data) + 1;
	var buffer = buffer_create(size, buffer_fixed, 1);
	buffer_write(buffer, buffer_string, data);
	network_send_raw(socket, buffer, size);
	buffer_delete(buffer);
}

if (keyboard_check_pressed(vk_enter)) {
    var data = json_stringify({ gamemaker_data: "I'm all the cool data" });
    var map = ds_map_create();
    var request_id = http_request("http://localhost:8000/", "POST", map, data);
    ds_map_destroy(map);
}

if (keyboard_check_pressed(ord("Q"))) game_end();
