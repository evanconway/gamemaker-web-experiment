width = 320;
height = 180;
multiplier = 3;

setup = function() {
	view_enabled = true;
	view_visible[0] = true;
	camera_set_view_size(view_camera[0], width, height);
	display_set_gui_size(width, height);
	view_set_wport(0, width);
	view_set_hport(0, height);
	window_set_size(width * multiplier, height * multiplier);
	surface_resize(application_surface, width, height);
}
setup();

window_center();

show_debug_message($"camera port width: ${view_get_wport(0)}");
