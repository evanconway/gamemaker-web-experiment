socket = -1;

my_player_id = "";
request_player_id_http_req_id = http_request("http://" + global.domain + ":8000/start", "GET", ds_map_create(), "");

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
