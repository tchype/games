if (typeof game === 'undefined') {
  throw new Error('game engine (game.js) must be loaded first');
}

reaction = {
  toWin: 3
};

reaction.init = function() {
  layer = new Kinetic.Layer({
    x: 0,
    y: 100
  });

  this.shape = new Kinetic.Star({
    x: (game.stage.getWidth() - 70)/2,
    y: 50,
    //width: 300,
    //height: 300,
    visible: false,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 2,
    cornerRadius: 5,
    numPoints: 6,
    innerRadius: 40,
    outerRadius: 70
  });

  layer.add(this.shape);

  this.winnerText = new Kinetic.Text({
        x: 0,
        y: 250,
        text: 'Congratulations!!!',
        fontSize: 72,
        fontFamily: 'Calibri',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        width: 1024,
        padding: 200,
        align: 'center',
        visible: false
  });
  layer.add(this.winnerText);

  game.Player.prototype.setColorImage = function(kineticImage) {
    this.colorImage = kineticImage;
  }
  game.Player.prototype.getColorImage = function() {
    return this.colorImage;
  }
  var players = game.players;
  var imageWidth = 200;
  var imageHeight = 200;
  var imageSeparator = 75;

  players.forEach(function(player, index, _array) {
    var playerImage = new Image();
    playerImage.addEventListener('load', function() {
      var colorImage = new Kinetic.Image({
        x: Math.floor((game.stage.getWidth() - imageWidth) / 2) + (imageWidth/2),
        y: 50 + (imageHeight/2),
        offset: [imageWidth/2, imageHeight/2],
        width: imageWidth,
        height: imageHeight,
        image: playerImage,
        visible: false
      });
      layer.add(colorImage);
      layer.draw();  // Not sure why this is needed other than it happens async
      player.setColorImage(colorImage);
    });

    playerImage.setAttribute('src', player.avatar);  // Trigger the load event
  });
  game.stage.add(layer);
  this.layer = layer;


  // Add sound effects

  var startBackgroundMusic = function() {
    var backgroundMusic = document.createElement('audio');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    backgroundMusic.autoplay = true;
    backgroundMusic.src = './sounds/Gorilla-Pimp_3for3-160.mp3';
    backgroundMusic.preload = 'auto';

    return backgroundMusic;
  }


  var setupCorrectSoundEffect = function() {
    var rightSoundEffect = document.createElement('audio');
    rightSoundEffect.src = './sounds/beep-24-correct.mp3';
    rightSoundEffect.preload = 'auto';
    rightSoundEffect.volume = 1;

    return rightSoundEffect;
  }

  var setupWinnerMusic = function() {
    var winnerMusic = document.createElement('audio');
    winnerMusic.src = './sounds/creepydoll.m4a';
    winnerMusic.preload = 'auto';
    winnerMusic.volume = 1;

    return winnerMusic;
  }

  this.correctSoundEffect = setupCorrectSoundEffect();
  this.backgroundMusic = startBackgroundMusic();
  this.winnerMusic = setupWinnerMusic();
}

reaction.start = function() {
  var me = this
  this.shape.setOpacity(1);

  var activateTriggers = function(matchCallback, missCallback) {
    if (typeof missCallback !== 'function') {
      missCallback = matchCallback;
    }
    var eventName = 'keydown';
    var onTrigger = function(event) {
      window.removeEventListener(eventName, onTrigger);

      var players = game.players

      for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var key = String.fromCharCode(event.keyCode);
        console.log(key);
        if (player.key === key) {
          matchCallback(player);
          return;
        }
      }

      missCallback(key);
    };
    window.addEventListener(eventName, onTrigger);
    console.log('listening...');
  };

  var getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  };


  var delay = getRandomArbitrary(0.5, 10);
  var me = this;
  console.log(delay);

  setTimeout(function() {
    var shape = me.shape;

    activateTriggers(function(player) {
      console.log(player.name + " got it first!");
      player.setScore(player.getScore() + 1);
      game.updateScores();

      if (player.getScore() >= me.toWin) {
        console.log("The winner is..." + player.name + "!!!!");
        me.showWinner(player);
      } else {
        me.showFirst(player, function() { me.start(); });
      }
    }, function(key) { console.log('Got key ' + key); });

    shape.show();
    console.log("shown!")
    shape.transitionTo({ opacity: 0, duration: 0.5 });
  }, delay * 1000);
}

reaction.showFirst = function(player, callback) {
  console.log(player);
  this.correctSoundEffect.play();
  var image = player.getColorImage();
  image.show();
  setTimeout(function() { 
    image.hide();
    image.setOpacity(1);
    callback(); 
  }, 4000);
  image.transitionTo({ opacity: 0, duration: 3.5 });
}

reaction.showWinner = function(player) {
  this.backgroundMusic.pause();
  this.winnerMusic.currentTime = 46; // Start at chorus of creepy doll
  this.winnerMusic.play();
  this.winnerText.show();

  var winnerImage = player.getColorImage();

  // Rotate once every four seconds
  var angularSpeed = Math.PI / 2;
  var anim = new Kinetic.Animation(function(frame) {
    var angleDiff = frame.timeDiff * angularSpeed / 1000;
    winnerImage.setOffset(winnerImage.getWidth()/2, winnerImage.getHeight()/2);
    winnerImage.rotate(angleDiff);
  }, this.layer);

  winnerImage.show();
  anim.start(); }
