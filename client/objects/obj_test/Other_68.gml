debug_log("async network event occured");
var keys = ds_map_keys_to_array(async_load);

var type = ds_map_find_value(async_load, "type");

// help identify type
if (type == network_type_connect) debug_log("network_type_connect");
if (type == network_type_data) debug_log("network_type_data");
if (type == network_type_disconnect) debug_log("network_type_disconnect");
if (type == network_type_down) debug_log("network_type_down");
if (type == network_type_non_blocking_connect) debug_log("network_type_non_blocking_connect");
if (type == network_type_up) debug_log("network_type_up");
if (type == network_type_up_failed) debug_log("network_type_up_failed");

for (var i = 0; i < array_length(keys); i++) {
	debug_log(keys[i] + ": " + string(ds_map_find_value(async_load, keys[i])));
}

if (type == network_type_non_blocking_connect) {
	debug_log($"Socket connection established!");
	
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
	var json_string = buffer_read(buffer, buffer_string);
	debug_log($"Data received: {json_string}");
	var data = {};
	try {
		data = json_parse(json_string);
	} catch(err) {}
	var event = is_struct(data) && variable_struct_exists(data, "event") ? variable_struct_get(data, "event") : "";
	if (event == "game_state") {
		state =  variable_struct_get(data, "game_state");
		debug_log(state);
	}
}

debug_log("end async network event\n");
