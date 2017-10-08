const ROWS = 5;
const COLUMNS = 5;

function BingoGrid(gameState) {
	const CHIPS = [
		"awesome_face",
		"doge",
		"ernest",
		"ernest_2"
	]

	this.init = function() {
		var $grid = $(".grid");
		for (var row = 0; row < ROWS; row++) {
			var $row = $("<div>").addClass("row");
			$grid.append($row);
			for (var column = 0; column < COLUMNS; column++) {
				var $space = $("<div>").addClass("space").data("row", row).data("column", column);
				var state = gameState.get(row, column);
				var $content = $("<span>").addClass("content").html(state.content);
				var chipImage = CHIPS[(Math.floor(Math.random() * CHIPS.length))];
				var $chip = $("<div>").addClass("chip " + chipImage);
				state.hidden ? $chip.hide() : $chip.show();
				$space.append($content).append($chip);
				$space.click(onClick);
				$row.append($space);
			}
		}
	}

	function onClick() {
		var $chip = $(".chip", this);
		var isHidden = $chip.is(":hidden");
		isHidden ? $chip.show() : $chip.hide();
		var row = $(this).data("row");
		var column = $(this).data("column");
		gameState.set(row, column, !isHidden, $(".content", this).html());
	}

	this.init();
}

function GameState(data) {
	const REGEX = /state=(.+);?/;
	this.state = {};

	this.init = function() {
		var match = document.cookie.match(REGEX);
		if (match) {
			this.state = JSON.parse(decodeURIComponent(escape(atob(match[1]))));
		} else {
			for (var i = 0, row = 0; row < ROWS; row++) {
				for (var column = 0; column < COLUMNS; column++, i++) {
					this.set(row, column, true, data[i]);
				}
			}
		}
	}

	this.set = function(row, column, isHidden, content) {
		this.state[key(row, column)] = value(isHidden, content);
		document.cookie = "state=" + btoa(unescape(encodeURIComponent(JSON.stringify(this.state))));
	}

	this.get = function(row, column) {
		return this.state[key(row, column)];
	}

	function key(row, column) {
		return row.toString() + "," + column.toString();
	}

	function value(isHidden, content) {
		return {"hidden": isHidden, "content": content};
	}

	this.init();
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
		var gameState = new GameState(shuffle(data));
		new BingoGrid(gameState);
	});
});
