const ROWS = 5;
const COLUMNS = 5;

function BingoGrid() {
	const CHIPS = [
		"awesome_face",
		"doge",
		"ernest",
		"ernest_2"
	]
	this.gameState = null;

	this.__init__ = function() {
		var $grid = $("#grid");
		for (var row = 0; row < ROWS; row++) {
			var $row = $("<div>").addClass("row");
			$grid.append($row);
			for (var column = 0; column < COLUMNS; column++) {
				var $space = $("<div>").addClass("space").data("row", row).data("column", column);
				var $content = $("<span>").addClass("content");
				var chipImage = CHIPS[(Math.floor(Math.random() * CHIPS.length))];
				var $chip = $("<div>").addClass("chip " + chipImage).hide();
				$space.append($content).append($chip);
				$space.click($.proxy(onClick, this, $space));
				$row.append($space);
			}
		}
	}

	this.init = function(data) {
		this.gameState = new GameState(shuffle(data));
		var spaces = $(".space");
		for (var i = 0; i < spaces.length; i++) {
			var $space = $(spaces[i]);
			var $chip = $(".chip", $space);
			var state = this.gameState.get($space.data("row"), $space.data("column"));
			$(".content", $space).html(state.content);
			state.hidden ? $chip.hide() : $chip.show();
		}
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

	function onClick($space) {
		var $chip = $(".chip", $space);
		var isHidden = $chip.is(":hidden");
		isHidden ? $chip.show() : $chip.hide();
		this.gameState.set($space.data("row"), $space.data("column"), !isHidden, $(".content", $space).html());
	}

	this.__init__();
}

function GameState(data) {
	const REGEX = /(^| )state=([^;]+)/;
	this.state = {};

	this.__init__ = function() {
		var match = document.cookie.match(REGEX);
		if (match) {
			this.state = JSON.parse(decodeURIComponent(escape(atob(match[2]))));
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

	this.__init__();
}

$(document).ready(function() {
	var bingoGrid = new BingoGrid();
	$.getJSON("data.json", function(data) {
		bingoGrid.init(data);
		$("#button").click(function() {
			document.cookie = "state=";
			bingoGrid.init(data);
		})
	});
});