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
}

if (type == network_type_data) {
	var buffer = ds_map_find_value(async_load, "buffer");
	var json_string = buffer_read(buffer, buffer_string);
	debug_log($"Data received: {json_string}");
	try {
		var temp_data = json_parse(json_string);
		game_data = temp_data[$ "data"];
		application_state = temp_data[$ "clientState"];
		// feather ignore once GM1011
		if (game_data[$ "overwriteClient"]) {
			// feather ignore once GM1041
			for (var i = 0; i < array_length(game_data.players); i++) {
				// feather ignore once GM1028
				if (game_data.players[i].id == my_player_id) typed = game_data.players[i].typed;
			}
		}
	} catch(err) {}
	if (variable_struct_exists(game_data, "your_player_id")) {
		my_player_id = variable_struct_get(game_data, "your_player_id");
	}
	debug_log($"application_state: {application_state}");
	debug_log(game_data);
}

debug_log("end async network event\n");
