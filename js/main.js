var points = [];
var canCreatePoint = true;

var getMouseCoords = function (e, i) {
  var cPos = board.getCoordsTopLeftCorner(e, i),
      absPos = JXG.getPosition(e, i),
      dx = absPos[0] - cPos[0],
      dy = absPos[1] - cPos[1];
  return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
};

var down = function (e) {
  var i, coords;

  if (e[JXG.touchProperty]) {
    // index of the finger that is used to extract the coordinates
    i = 0;
  }
  coords = getMouseCoords(e, i);

  if (canCreatePoint) {
    var jsxPoint = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]]);
    jsxPoint.on("click", function(){currentPoint = this;});
    points.push(jsxPoint);
    currentPoint = jsxPoint;
    canCreatePoint = false;
  }
};

var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-12, 12, 12, -12], keepaspectratio: true, axis: true, showCopyright: false, showNavigation: false});
board.on('down', down);

// Create background
var center0 = board.create('point', [0.0, 0.0], {name: '', face: []});
var circle0 = board.create('circle', [center0, 10], {strokeWidth: 1, strokeColor: "#999999", highlight: false});
circle0.isDraggable = false;
var center1 = board.create('point', [5.0, 0.0], {name: '', face: []});
var circle1 = board.create('circle', [center1, 5], {strokeWidth: 1, strokeColor: "#999999", highlight: false});
circle1.isDraggable = false;
var center2 = board.create('point', [-5.0, 0.0], {name: '', face: []});
var circle2 = board.create('circle', [center2, 5], {strokeWidth: 1, strokeColor: "#999999", highlight: false});
circle2.isDraggable = false;
var center3 = board.create('point', [7.5, 0.0], {name: '', face: []});
var circle3 = board.create('circle', [center3, 2.5], {strokeWidth: 1, strokeColor: "#999999", highlight: false});
circle3.isDraggable = false;
var center4 = board.create('point', [-7.5, 0.0], {name: '', face: []});
var circle4 = board.create('circle', [center4, 2.5], {strokeWidth: 1, strokeColor: "#999999", highlight: false});
circle4.isDraggable = false;

var $buttons = $("li");
$buttons.on("click", function() {
  $buttons.removeClass("active");
  $(this).addClass("active");
  var fn = $(this).data("fn");
  plot(window[fn]);
});

var line1 = function(point) {
  return function(x){
    return (point.Y() * x) / point.X();
  };
};

var line2 = function (point) {
  return function (x) {
    return x + point.Y() - point.X();
  };
};

var plot = function(fn) {
  // The underlying path
  var startingPoint = points[points.length - 1];
  var newFn = fn(startingPoint);
  var curve = board.create('functiongraph', [newFn], {strokeColor: "#bbbbbb"});
  // The new point that glides on the path
  var glider = board.create('glider', [1, 0, curve]);
  // The highlighted segment between the new point and the old point
  board.create('functiongraph', [newFn, function(){return glider.X()}, function(){return startingPoint.X()}], {strokeColor: "red"});
  // Add the new point to points collection
  points.push(glider);
};

