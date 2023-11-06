show_debug_message("async network event occured");
var keys = ds_map_keys_to_array(async_load);

var type = ds_map_find_value(async_load, "type");

// help identify type
if (type == network_type_connect) show_debug_message("network_type_connect");
if (type == network_type_data) show_debug_message("network_type_data");
if (type == network_type_disconnect) show_debug_message("network_type_disconnect");
if (type == network_type_down) show_debug_message("network_type_down");
if (type == network_type_non_blocking_connect) show_debug_message("network_type_non_blocking_connect");
if (type == network_type_up) show_debug_message("network_type_up");
if (type == network_type_up_failed) show_debug_message("network_type_up_failed");

for (var i = 0; i < array_length(keys); i++) {
	show_debug_message(keys[i] + ": " + string(ds_map_find_value(async_load, keys[i])));
}

if (type == network_type_non_blocking_connect) {
	show_debug_message($"Socket connection established!");
	// send player id once connection is established
	if (my_player_id != "") {
		var buffer = struct_to_buffer({
			event: "connect_player_id",
			player_id: my_player_id,
		});
		network_send_raw(socket, buffer, buffer_get_size(buffer));
		buffer_delete(buffer);
	}
}

if (type == network_type_data) {
	var buffer = ds_map_find_value(async_load, "buffer");
	var data = buffer_read(buffer, buffer_string);
	show_debug_message($"Data received: {data}");
}

show_debug_message("end async network event\n");
