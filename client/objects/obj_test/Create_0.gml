var use_browser = os_type == os_gxgames || os_browser != browser_not_a_browser;

show_debug_message($"use_browser: {use_browser}\nos_type: {os_type}");

var socket_type = use_browser ? network_socket_ws : network_socket_tcp;
var port = use_browser ? 5001 : 5000;

socket = network_create_socket(socket_type);
var result = network_connect_raw_async(socket, "localhost", port);
