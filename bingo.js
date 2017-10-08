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

function init(data, state) {
	var $grid = $(".grid");
	for (var i = 0, row = 0; row < ROWS; row++) {
		var $row = $("<div>").addClass("row");
		$grid.append($row);
		for (var column = 0; column < COLUMNS; column++, i++) {
			var $space = $("<div>").addClass("space").data("row", row).data("column", column);
			var $content = $("<span>").addClass("content").html(data[i]);
			var chip_image = CHIPS[(Math.floor(Math.random() * CHIPS.length))];
			var $chip = $("<div>").addClass("chip " + chip_image).hide();
			$space.append($content).append($chip);
			$space.click(on_click);
			$row.append($space);
			update_state(row, column, true, data[i]);
		}
	}
}

function init_state() {
	var match = document.cookie.match(STATE_REGEX);
	if (!match) {
		return false;
	}
	state = JSON.parse(decodeURIComponent(escape(atob(match[1]))));
	return true;
}

function init_from_cookie() {
	var $grid = $(".grid");
	for (var row = 0; row < ROWS; row++) {
		var $row = $("<div>").addClass("row");
		$grid.append($row);
		for (var column = 0; column < COLUMNS; column++) {
			var $space = $("<div>").addClass("space").data("row", row).data("column", column);
			var value = state[key(row, column)];
			var $content = $("<span>").addClass("content").html(value.content);
			var chip_image = CHIPS[(Math.floor(Math.random() * CHIPS.length))];
			var $chip = $("<div>").addClass("chip " + chip_image);
			value.hidden ? $chip.hide() : $chip.show();
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
	if (init_state()) {
		init_from_cookie();
	} else {
		$.getJSON("data.json", function(data) {
			init(shuffle(data), state);
		});
	}
});
