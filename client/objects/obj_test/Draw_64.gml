draw_set_color(c_white);
draw_set_alpha(1);

if (application_state == "connecting_to_server") {
	draw_text(0, 0, "Connecting to server...");
} else if (application_state == "title") {
	draw_text(0, 0, "Ready to play? Press any key to search for a game.");
} else if (application_state == "queued") {
	draw_text(0, 0, "Searching for a game...");
} else if (application_state == "ingame") {
	draw_text(0, 0, "In Game!");
} else {
	draw_text(0, 0, "game state not recognized");
}
