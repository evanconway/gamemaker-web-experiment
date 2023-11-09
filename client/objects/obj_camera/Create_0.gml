width = 320;
height = 180;
multiplier = 3;

setup = function() {
	view_enabled = true;
	view_visible[0] = true;
	camera_set_view_size(view_camera[0], width, height);
	window_set_size(width * multiplier, height * multiplier);
	surface_resize(application_surface, width, height);
	display_set_gui_size(width, height);
}
setup();

window_center();
