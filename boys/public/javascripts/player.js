var Player = function(name, key, avatar) {
	this.name = name;
	this.key = key;
	this.avatar = avatar;
  this.score = 0;
}
Player.prototype.getScore = function() { return this.score; }

var PlayerPosition = function(player) {
	this.player = player;
	this.x = 0;
	this.y = 0;
}

PlayerPosition.prototype.getPlayer = function() { return this.player; }
PlayerPosition.prototype.getX = function() { return this.x; }
PlayerPosition.prototype.getY = function() { return this.y; }
PlayerPosition.prototype.setX = function(x) { this.x = x; }
PlayerPosition.prototype.setY = function(y) { this.y = y; }
