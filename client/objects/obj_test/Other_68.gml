show_debug_message("async network event occured");
var keys = ds_map_keys_to_array(async_load);

for (var i = 0; i < array_length(keys); i++) {
	show_debug_message(keys[i] + ": " + string(ds_map_find_value(async_load, keys[i])));
}

var type = ds_map_find_value(async_load, "type");

if (type == network_type_data) {
	var buffer = ds_map_find_value(async_load, "buffer");
	var data = buffer_read(buffer, buffer_string);
	show_debug_message($"Data received: {data}");
}
