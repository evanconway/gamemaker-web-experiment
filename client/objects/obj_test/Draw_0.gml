exit;
var players = variable_struct_exists(game_data, "players") ? variable_struct_get(game_data, "players") : {};

var player_ids = variable_struct_get_names(players);

for (var i = 0; i < array_length(player_ids); i++) {
	var player = variable_struct_get(players, player_ids[i]);
	var player_color = make_color_rgb(player.color.red, player.color.green, player.color.blue);
	var position_x = player.position.x;
	var position_y = player.position.y;
	draw_set_color(player_color);
	draw_set_alpha(1);
	draw_rectangle(position_x, position_y, position_x + 16, position_y + 16, false);
}
