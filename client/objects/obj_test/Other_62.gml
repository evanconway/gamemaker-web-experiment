show_debug_message("http event occured");
var keys = ds_map_keys_to_array(async_load);

for (var i = 0; i < array_length(keys); i++) {
	show_debug_message(keys[i] + ": " + string(ds_map_find_value(async_load, keys[i])));
}

var event_id = ds_map_find_value(async_load, "id");
var result = json_parse(ds_map_find_value(async_load, "result"));

if (event_id = request_player_id_http_req_id) {
	my_player_id = variable_struct_get(result, "player_id");
	show_debug_message($"client received player id: {my_player_id}");
	show_debug_message("starting socket connection...");
	socket = start_socket_connection(my_player_id);
}

show_debug_message("end http event\n");
