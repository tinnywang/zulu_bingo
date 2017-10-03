var ROWS = 5;
var COLUMNS = 5;
var CHIPS = [
	"awesome_face",
	"doge",
	"ernest",
	"ernest_2"
]

function init_grid(data) {
	var $grid = $(".grid");
	for (var i = 0, row = 0; row < ROWS; row++) {
		var $row = $("<div>").addClass("row");
		$grid.append($row);
		for (var column = 0; column < COLUMNS; column++, i++) {
			var $space = $("<div>").addClass("space").attr("row", row).attr("column", column);
			var $content = $("<span>").addClass("content").html(data[i]);
			var chip_image = CHIPS[(Math.floor(Math.random() * CHIPS.length))];
			var $chip = $("<div>").addClass("chip " + chip_image).hide();
			$space.append($content).append($chip);
			$space.click(on_click);
			$row.append($space);
		}
	}
}

function on_click() {
	var $chip = $(".chip", this);
	$chip.is(":hidden") ? $chip.show() : $chip.hide();
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
		init_grid(shuffle(data));
	});
});
