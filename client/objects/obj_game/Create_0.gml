draw_set_font(fnt_game);

var use_deploy = false;
port = use_deploy ? 443 : 5000;
var domain = use_deploy ? "tyghrufj.online" : "localhost";
ws_url = $"ws{use_deploy ? "s" : ""}://{domain}";

show_debug_message($"{ws_url}:{port}");

my_player_id = "";
application_state = "connecting_to_server";
application_state_prev = application_state;
game_data = {};
match_word_index = 0;
match_words = [];
typed = "";
track_time = 0;

socket = network_create_socket(network_socket_ws);
connect_to_server = function() {
	debug_log("starting socket connection...");
	my_player_id = "";
	application_state = "connecting_to_server";
	application_state_prev = application_state;
	game_data = {};
	match_word_index = 0;
	match_words = [];
	typed = "";
	track_time = 0;
	network_destroy(socket);
	socket = network_create_socket(network_socket_ws);
	network_connect_raw_async(socket, ws_url, port);
};

connect_to_server();

/**
 * @param {string} event
 * @param {struct} data
 */
function send_server_data(event, data) {
	var sent = send_struct_on_socket({
		event: event,
		data: data,
	}, socket);
	debug_log($"send server data: ${sent}");
	if (sent < 0) {
		connect_to_server();
	}
}

typed = ""; // only overwritten by server on round reset

music = -1;

// entire time in seconds of the intro
// intro is 4 measures
music_intro_time = 10.666666;
