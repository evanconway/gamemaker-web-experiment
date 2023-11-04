if (keyboard_check_pressed(vk_space)) {
	var data = "I'm all the cool data.";
	var size = string_byte_length(data);
	var buffer = buffer_create(size, buffer_fixed, 1);
	buffer_write(buffer, buffer_string, data);
	buffer_seek(buffer, buffer_seek_start, 0);
	network_send_raw(socket, buffer, size);
	buffer_delete(buffer);
}
