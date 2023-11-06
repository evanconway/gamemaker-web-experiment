if (keyboard_check_pressed(vk_space)) {
	var buffer = struct_to_buffer({ test_socket: "fake socket data" });
	network_send_raw(socket, buffer, buffer_get_size(buffer));
	buffer_delete(buffer);
}

if (keyboard_check_pressed(vk_enter)) {
    var data = json_stringify({ test_http: "fake http data" });
    var map = ds_map_create();
    var request_id = http_request("http://localhost:8000", "POST", map, data);
    ds_map_destroy(map);
}
