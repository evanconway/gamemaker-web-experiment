show_debug_message("http event occured");
var keys = ds_map_keys_to_array(async_load);

for (var i = 0; i < array_length(keys); i++) {
	show_debug_message(keys[i] + ": " + string(ds_map_find_value(async_load, keys[i])));
}
show_debug_message("end http event\n");
