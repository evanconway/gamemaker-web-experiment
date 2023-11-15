draw_set_font(fnt_game);

socket = -1;

my_player_id = "";
debug_log("starting socket connection...");

var use_deploy = false;
var port = use_deploy ? 443 : 5000;
var domain = use_deploy ? "tyghrufj.online" : "localhost";
var ws_url = $"ws{use_deploy ? "s" : ""}://{domain}";

show_debug_message($"{ws_url}:{port}");

socket = network_create_socket(network_socket_ws);
network_connect_raw_async(socket, ws_url, port);

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
