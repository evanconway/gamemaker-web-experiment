global.domain = "localhost";

/**
 * Takes a struct, stringifies it as JSON, writes it to a buffer.
 * Returns the buffer.
 *
 * @param {struct} struct
 */
function struct_to_buffer(struct) {
	var data = json_stringify(struct);
	var size = string_byte_length(data) + 1;
	var buffer = buffer_create(size, buffer_fixed, 1);
	buffer_write(buffer, buffer_string, data);
	return buffer;
}

global.debug = false;

/**
 * @param {any} msg
 */
function debug_log(msg) {
	if (!global.debug) return;
	show_debug_message(msg);
}
