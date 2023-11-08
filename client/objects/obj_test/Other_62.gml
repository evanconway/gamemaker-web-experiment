debug_log("http event occured");
var keys = ds_map_keys_to_array(async_load);

for (var i = 0; i < array_length(keys); i++) {
	debug_log(keys[i] + ": " + string(ds_map_find_value(async_load, keys[i])));
}

var request_id = ds_map_find_value(async_load, "id");
var result = json_parse(ds_map_find_value(async_load, "result"));

if (request_id = request_player_id_http_req_id) {
	my_player_id = variable_struct_get(result, "player_id");
	debug_log($"client received player id: {my_player_id}");
	debug_log("starting socket connection...");
	socket = network_create_socket(network_socket_ws);
	network_connect_raw_async(socket, global.domain, 5000);
}

debug_log("end http event\n");
