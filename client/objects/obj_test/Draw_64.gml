var match_state = game_data[$ "state"];
var start_time = game_data[$ "startTime"];

// our time logic is wrong, does GameMaker not have an equal to Date.now() ??
// feather ignore once GM1010
var readying = start_time == undefined ? false : (date_current_datetime() > start_time + 5000);

draw_set_color(c_white);
draw_set_alpha(1);

if (application_state == "connecting_to_server") {
	draw_text(0, 0, "Connecting to server...");
} else if (application_state == "title") {
	draw_text(0, 0, "Ready to play? Press any key to search for a game.");
} else if (application_state == "queued") {
	draw_text(0, 0, "Searching for a game...");
} else if (application_state == "ingame") {
	show_debug_message($"current_time: {date_current_datetime()}");
	if (match_state == "play" && readying) {
		draw_text(0, 0, $"Game Start In: {(start_time + 5000) - current_time}");
	}
	if (match_state == "play" && !readying) {
		draw_text(0, 0, "In Game!");
	}
	if (match_state == "results") {
		draw_text(0, 0, "Game complete. Q to return.");
	}
} else {
	draw_text(0, 0, "game state not recognized");
}
