const ROWS = 5;
const COLUMNS = 5;
const DURATION = 500;

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
		center();
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
		var row = $space.data("row");
		var column = $space.data("column");
		this.gameState.set(row, column, !isHidden, $(".content", $space).html());
		isHidden ? $chip.show(0, $.proxy(victory, this, row, column)) : $chip.hide();
	}

	function victory(row, column) {
		if (this.gameState.hasBingo(row, column)) {
			document.cookie = "state=";
			$(".overlay").fadeIn(DURATION, function() {
				$(this).css("display", "flex");
	      $("#button").addClass("pulse");
	      $("#bingo").addClass("shake");
	      $(".congrats").show();
	      $(".congrats").fadeIn(DURATION);
	      $("audio")[0].play();
	    });
		}
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

	this.hasBingo = function(selectedRow, selectedColumn) {
		// check columns
		var hasWon = true;
		for (var row = 0; row < ROWS && hasWon; row++) {
			hasWon &= !this.get(row, selectedColumn).hidden;
		}
		if (hasWon) {
			return true;
		}
		// check rows
		hasWon = true;
		for (var column = 0; column < COLUMNS && hasWon; column++) {
			hasWon &= !this.get(selectedRow, column).hidden;
		}
		if (hasWon) {
			return true;
		}
		// check diagonal (top left to bottom right)
		if (selectedRow == selectedColumn) {
			hasWon = true;
			for (var row = 0; row < ROWS && hasWon; row++) {
				hasWon &= !this.get(row, row).hidden;
			}
			if (hasWon) {
				return true;
			}
		}
		// check diagonal (top right to bottom left)
		if (ROWS - selectedRow - 1 == selectedColumn) {
			hasWon = true;
			for (var row = 0, column = COLUMNS - 1; row < ROWS && COLUMNS >= 0; row++, column--) {
				hasWon &= !this.get(row, column).hidden;
			}
			if (hasWon) {
				return true;
			}
		}
		return false;
	}

	this.__init__();
}

function center() {
		var $bingoCard = $(".bingo_card");
		var top = Math.max(0, ($(window).height() - $bingoCard.outerHeight()) / 2);
		var left = Math.max(0, ($(window).width() - $bingoCard.outerWidth()) / 2);
		$bingoCard.css("position", "absolute");
		$bingoCard.css("top", top + "px");
		$bingoCard.css("left", left + "px");
}

$(document).ready(function() {
	var bingoGrid = new BingoGrid();
	var audio = $("audio")[0];

	$.getJSON("data.json", function(data) {
		bingoGrid.init(data);

		$("#button").click(function() {
			document.cookie = "state=";
			bingoGrid.init(data);
			audio.pause();
			audio.currentTime = 0;
			$(this).removeClass("pulse");
			$("#bingo").removeClass("shake");
			$(".congrats").hide();
			$(".overlay").fadeOut(DURATION);
		})
	});

	audio.addEventListener("ended", function() {
		$("#bingo").removeClass("shake");
	});

	$(window).resize(function() {
		center();
	});
});
