/**
 * Start socket connection using the given player id.
 *
 * @param {string} server_player_id
 * @return {Id.Socket} socket connection
 */
function start_socket_connection(server_player_id) {
	var use_browser = os_type == os_gxgames || os_browser != browser_not_a_browser;

	var socket_type = use_browser ? network_socket_ws : network_socket_tcp;
	var port = use_browser ? 5001 : 5000;

	var socket = network_create_socket(socket_type);
	network_connect_raw_async(socket, "localhost", port);
	return socket;
}

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