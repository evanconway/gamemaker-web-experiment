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

/**
 * @param {struct} struct
 * @param {Id.Socket} socket
 */
function send_struct_on_socket(struct, socket) {
	var buffer = struct_to_buffer(struct);
	network_send_raw(socket, buffer, buffer_get_size(buffer));
	buffer_delete(buffer);
}

global.debug = false;

/**
 * @param {any} msg
 */
function debug_log(msg) {
	if (!global.debug) return;
	show_debug_message(msg);
}

function get_text_pressed() {
	var result = "";
	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 1; i <= string_length(alphabet); i++) {
		var char = string_char_at(alphabet, i);
		if (keyboard_check_pressed(ord(char))) {
			result += char;
		}
	}
	return result;
}
