main = {
  init: function() {
    var layer = new Kinetic.Layer();

    var imageObj = new Image();
    imageObj.onload = function() {
      var yoda = new Kinetic.Image({
        x: 140,
        y: stage.getHeight() / 2 - 59,
        image: imageObj,
        width: 106,
        height: 118
      });

      var filteredYoda = new Kinetic.Image({
        x: 320,
        y: stage.getHeight() / 2 - 59,
        image: imageObj,
        width: 106,
        height: 118
      });

      // add the shape to the layer
      layer.add(yoda);
      layer.add(filteredYoda);

      // add the layer to the stage
      stage.add(layer);

      // apply grayscale filter to second image
      filteredYoda.applyFilter(Kinetic.Filters.Grayscale, null, function() {
        layer.draw();
      });
    };
    imageObj.src = './images/yoda.jpg';

    return layer;
  }
}