if (typeof game === 'undefined') {
  throw new Error('game engine (game.js) must be loaded first');
}

reaction = {
  toWin: 3
};

reaction.init = function() {
  var layer = new Kinetic.Layer({
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
  game.stage.add(layer);
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
      } else {
          me.start();
      }
    });

    shape.show();
    console.log("shown!")
    shape.transitionTo({ opacity: 0, duration: 0.5 });
  }, delay * 1000);
}
