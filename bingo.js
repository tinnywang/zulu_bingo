var ROWS = 5;
var COLUMNS = 5;

function init_card(data) {
	var i = 0;
	var $card = $(".card");
	for (var i = 0, row = 0; row < ROWS; row++) {
		var $row = $("<div>").addClass("row");
		$card.append($row);
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

$(document).ready(function() {
	$.getJSON("data.json", function(data) {
		init_card(shuffle(data));
	});
});
