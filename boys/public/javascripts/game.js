if (typeof Kinetic === 'undefined') {
  throw new Error('Kinetic script must be loaded first!');
}

game = {
  STATES: { stopped: 'Stopped', running: 'Running' },
  players: [],
  playerScores: [],  //TODO : Need a home for visual details
  state: {},
}

game.Player = function(name, key, avatar) {
	this.name = name;
	this.key = key;
	this.avatar = avatar;
  this.score = 0;
}
game.Player.prototype.getScore = function() { return this.score; }
game.Player.prototype.setScore = function(score) { this.score = score; } // Add events

game.Scoreboard = function(players) {
	this.players = players;
	this.slots = [];

	var scoreboard = this; // For the forEach
	this.players.forEach(function(player, _index, _array) {
		scoreboard.slots.push(new game.ScoreboardSlot(player));
	});
}

game.ScoreboardSlot = function(player) {
	this.getPlayer = function() { return player; };
	this.getScore = function() { return player.getScore(); };
  this.getName = function() { return player.name; };
  this.getAvatarUrl = function() { return player.avatar; };
}

game.isStopped = function() { return this.state === this.STATES.stopped };
game.isRunning = function() { return this.state === this.STATES.running };
game.start = function() {
  var theGame = this;
  this.state = this.STATES.running;

  this.loopInterval = setInterval(function() {
    theGame.players.forEach(function(player, _index, _array) {
      player.setScore(Math.round(Math.random() * 1000));
    });

    theGame.updateScores();
  }, 1000);
};

game.stop = function() {
  clearInterval(this.loopInterval);
  this.state = this.STATES.stopped;
};

game.updateScores = function() {
  var theGame = this;
  theGame.players.forEach(function(player, index, _array) {
    score = theGame.playerScores[index];
    score.setScore(player.getScore());
  });

  this.stage.draw();
}

game.init = function(containerElementId, playerNames) {

  function createStage(containerElementId) {
    return new Kinetic.Stage({
      container: containerElementId,
      width: 1024,
      height: 768
    });
  }

  function createPlayers(playerNames) {
    var players = [];
    var keys = ['a', 'l', ' '];

    playerNames.forEach(function(name, _index, _array) {
      var key = keys.shift();
      players.push(new game.Player(name, key, './images/' + name + '.png'))
    });

    return players;
  }


  function createScoreboard(stage, players) {
    var scoreboard = new game.Scoreboard(players);

    var board = new Kinetic.Layer();

    var borderWidth = 4;
    var borderAdjustment = borderWidth - 1;
    var shadowOffsetX = 10;
    var shadowOffsetY = 10;

    var border = new Kinetic.Rect({
      x: 0,
      y: borderAdjustment,
      width: stage.getWidth() - borderAdjustment - shadowOffsetX,
      height: 60,
      fill: '#de5',
      stroke: '#555',
      strokeWidth: borderWidth,
      draggable: true,
      cornerRadius: 10,
      shadowColor: '#000',
      shadowBlur: 10,
      shadowOffset: [shadowOffsetX, shadowOffsetY],
      shadowOpacity: 0.5,
      name: 'scoreboardBorder'
    });

    board.add(border);


    var imageWidth = 50;
    var imageHeight = 50;
    var nameWidth = 100;
    var scoreWidth = 50;

    var betweenPlayerPadding = 100;
    var playerWidth = imageWidth + nameWidth + scoreWidth + betweenPlayerPadding;

    var addPlayerImageToScoreboard = function(board, avatarUrl, startX, startY) {
      var playerImage = new Image();
      playerImage.addEventListener('load', function() {
        var smallImage = new Kinetic.Image({
          x: startX,
          y: startY,
          width: imageWidth,
          height: imageHeight,
          image: playerImage
        });
        board.add(smallImage);
        board.draw();  // Not sure why this is needed other than it happens async
      });

      playerImage.setAttribute('src', avatarUrl);  // Trigger the load event
    }


    var addPlayerNameToScoreboard  = function(board, name, startX, startY) {
      var playerText = new Kinetic.Text({
        x: startX,
        y: startY + 20,
        text: name,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 80,
        align: 'center'
      });

      board.add(playerText);
    }


    var addPlayerScoreTextToScoreboard = function(board, startX, startY) {

      var score = new Kinetic.Text({
        x: startX,
        y: startY,
        text: 'hi',
        fontSize: 24,
        fontFamily: 'Calibri',
        fill: '#855',
        width: scoreWidth,
        padding: 16,
        align: 'center'
      });

      score.setScore = function(score) {
        // Don't ask me why setting textArr[0] actually changes text where
        // setting text property doesn't.
        this.textArr[0] = score.toString(); // Assumes text box is only child
      };

      board.add(score);

      return score;
    }


    var addPlayerToScoreboard = function(board, name, avatarUrl, startX, startY) {
      addPlayerImageToScoreboard(board, avatarUrl, startX, startY);
      addPlayerNameToScoreboard(board, name, startX + imageWidth, startY);
      var playerScore = addPlayerScoreTextToScoreboard(board, startX + imageWidth + nameWidth, startY);
      game.playerScores.push(playerScore);
    }

    scoreboard.slots.forEach(function(slot, index, array) {
      var startingOffsetX = (stage.getWidth() - (playerWidth * array.length)) / 2
      var startX = startingOffsetX + (index * playerWidth);
      var startY = 10;
      addPlayerToScoreboard(board, slot.getName(), slot.getAvatarUrl(), startX, startY);
    });

    stage.add(board);

    return board;
  }


  // Actually do stuff now
  this.stop();

  this.stage = createStage(containerElementId);
  this.players = createPlayers(playerNames);
  this.scoreboard = createScoreboard(this.stage, this.players);

  this.start();

  return this.stage;
}
