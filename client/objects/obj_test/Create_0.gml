socket = network_create_socket(network_socket_tcp);
network_connect_raw_async(socket, "localhost", 5000);

show_debug_message("network types");
show_debug_message("network_type_connect: " + string(network_type_connect));
show_debug_message("network_type_disconnect: " + string(network_type_disconnect));
show_debug_message("network_type_data: " + string(network_type_data));
show_debug_message("network_type_non_blocking_connect: " + string(network_type_non_blocking_connect));
