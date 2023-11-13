draw_set_font(fnt_game);

socket = -1;

my_player_id = "";
debug_log("starting socket connection...");
socket = network_create_socket(network_socket_wss);
network_connect_raw_async(socket, "wss://" + global.domain, 8443);

application_state = "connecting_to_server";
application_state_prev = application_state;
game_data = {};

/**
 * @param {string} event
 * @param {struct} data
 */
function send_server_data(event, data) {
	send_struct_on_socket({
		event: event,
		data: data,
	}, socket);
}

ready_time = 0; // game countdown once match starts

typed = ""; // only overwritten by server on round reset
