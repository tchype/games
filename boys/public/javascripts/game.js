game = {
  STATES: { stopped: 'Stopped', running: 'Running' },
  players: [],
  playerScores: [],  //TODO : Need a home for visual details
  state: {},
}

game.isStopped = function() { return this.state === this.STATES.stopped };
game.isRunning = function() { return this.state === this.STATES.running };
game.start = function() {
  var theGame = this;
  this.state = this.STATES.running;

  this.loopInterval = setInterval(function() {
    theGame.players.forEach(function(player, _index, _array) {
      player.score = Math.round(Math.random() * 1000);
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
    score.setScore(player.score);
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
      players.push(new Player(name, key, './images/' + name + '.png'))
    });

    return players;
  }


  function createScoreboard(stage, players) {
    var scoreboard = new Scoreboard(players);

    var board = new Kinetic.Layer();

    var borderWidth = 4;
    var borderAdjustment = borderWidth - 1;

    var border = new Kinetic.Rect({
      x: 0,
      y: borderAdjustment,
      width: stage.getWidth() - borderAdjustment,
      height: 60,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: borderWidth,
      draggable: true,
      name: 'scoreboardBorder'
    });

    board.add(border);


    var imageWidth = 50;
    var imageHeight = 50;
    var nameWidth = 80;
    var scoreWidth = 50;

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
        y: startY,
        text: name,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 80,
        padding: 20,
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


    var addPlayerToScoreboard = function(board, name, avatarUrl, playerIndex) {
      var startX = 10 + (playerIndex * 300);
      var startY = 10;

      addPlayerImageToScoreboard(board, avatarUrl, startX, startY);
      addPlayerNameToScoreboard(board, name, startX + imageWidth, startY);
      var playerScore = addPlayerScoreTextToScoreboard(board, startX + imageWidth + nameWidth, startY);
      game.playerScores.push(playerScore);
    }

    scoreboard.slots.forEach(function(slot, index, _array) {
      addPlayerToScoreboard(board, slot.getName(), slot.getAvatarUrl(), index);
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
