var ROWS = 5;
var COLUMNS = 5;
var CHIPS = [
	"awesome_face",
	"doge",
	"ernest",
	"ernest_2"
]
var STATE_REGEX = /state=(.+);?/;
var state = {};

function init_state(data) {
	var match = document.cookie.match(STATE_REGEX);
	if (match) {
		state = JSON.parse(decodeURIComponent(escape(atob(match[1]))));
	} else {
		for (var i = 0, row = 0; row < ROWS; row++) {
			for (var column = 0; column < COLUMNS; column++, i++) {
				update_state(row, column, true, data[i]);
			}
		}
	}
}

function init_grid() {
	var $grid = $(".grid");
	for (var row = 0; row < ROWS; row++) {
		var $row = $("<div>").addClass("row");
		$grid.append($row);
		for (var column = 0; column < COLUMNS; column++) {
			var $space = $("<div>").addClass("space").data("row", row).data("column", column);
			var data = state[key(row, column)];
			var $content = $("<span>").addClass("content").html(data.content);
			var chip_image = CHIPS[(Math.floor(Math.random() * CHIPS.length))];
			var $chip = $("<div>").addClass("chip " + chip_image);
			data.hidden ? $chip.hide() : $chip.show();
			$space.append($content).append($chip);
			$space.click(on_click);
			$row.append($space);
		}
	}
}

function key(row, column) {
	return row.toString() + "," + column.toString();
}

function value(is_hidden, content) {
	return {"hidden": is_hidden, "content": content};
}

function update_state(row, column, is_hidden, content) {
	state[key(row, column)] = value(is_hidden, content);
	document.cookie = "state=" + btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

function on_click() {
	var row = $(this).data("row");
	var column = $(this).data("column");
	var $chip = $(".chip", this);
	var is_hidden = $chip.is(":hidden");
	is_hidden ? $chip.show() : $chip.hide();
	update_state(row, column, !is_hidden, $(".content", this).html());
}

function shuffle(data) {
	for (var i = data.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * i);
		var temp = data[i];
		data[i] = data[j]
		data[j] = temp;
	}
	return data;
}

$(document).ready(function() {
	$.getJSON("data.json", function(data) {
		init_state(shuffle(data));
		init_grid();
	});
});
