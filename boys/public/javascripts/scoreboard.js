Scoreboard = function(players) {
	this.players = players;
	this.slots = [];

	var scoreboard = this; // For the forEach
	this.players.forEach(function(player, _index, _array) {
		scoreboard.slots.push(new ScoreboardSlot(player));
	});
}

ScoreboardSlot = function(player) {
	this.player = player;
	this.score = 0;
	// this.avatarIcon = new Image();
	// this.avatarIcon.addEventListener('load', function() {
	// 	var filteredIcon = new Kinetic.Image({
	//     x: 0,
	//     y: 0,
	//     image: this.avatarIcon,
	//     width: 50,
	//     height: 50
	//   });
	// });

	// this.avatarIcon.src = player.avatar;
}

