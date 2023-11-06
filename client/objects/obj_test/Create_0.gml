socket = -1;

my_player_id = "";
request_player_id_http_req_id = http_request("http://localhost:8000/start", "GET", ds_map_create(), "");

state = {};
