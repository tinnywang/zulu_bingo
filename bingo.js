var ROWS = 5;
var COLUMNS = 5;

function init_grid(data) {
	var i = 0;
	var $grid = $(".grid");
	for (var i = 0, row = 0; row < ROWS; row++) {
		var $row = $("<div>").addClass("row");
		$grid.append($row);
		for (var column = 0; column < COLUMNS; column++) {
			var $space = $("<div>").addClass("space").attr("row", row).attr("column", column);
			var $text = $("<span>").addClass("text").text(data[i]);
			$space.append($text);
			$space.click(on_click);
			$row.append($space);
			i++;
		}
	}
}

function on_click() {
	if ($(this).hasClass("selected")) {
		$(this).removeClass("selected");
	} else {
		$(this).addClass("selected");
	}
}

function shuffle(data) {
	for (var i = data.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * i);
		var temp = data[i];
		data[i] = data[j]
		data[j] = temp;
	}
	return data
}

var COLORS = [
	"#F92672", // pink
	"#66D9EF", // blue
	"#A6E22E", // green
	"#FD971F" // orange
];
$(document).ready(function() {
	$(".bingo_card").css('background-color', COLORS[Math.floor(Math.random() * COLORS.length)])
	$.getJSON("data.json", function(data) {
		init_grid(shuffle(data));
	});
});
