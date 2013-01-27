Scoreboard = function(players) {
	this.players = players;
	this.slots = [];

	var scoreboard = this; // For the forEach
	this.players.forEach(function(player, _index, _array) {
		scoreboard.slots.push(new ScoreboardSlot(player));
	});
}

ScoreboardSlot = function(player) {
	this.getPlayer = function() { return player; };
	this.getScore = function() { return player.getScore(); };
  this.getName = function() { return player.name; };
  this.getAvatarUrl = function() { return player.avatar; };
}

