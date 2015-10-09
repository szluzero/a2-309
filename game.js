var canvas, surface, currPage, gamePage, mouse, fullCircle = Math.PI * 2;
var food = 0;

function beginLoop() {
  var frameID = 0;
  var lastFrame = Date.now();

  function loop() {
    var currFrame = Date.now();

    var elapsed = currFrame - lastFrame;

    frameID = window.requestAnimationFrame(loop);

    currPage.update(elapsed);
    currPage.draw(surface);

    lastFrame = currFrame;
  }

  loop();
}

canvas = document.querySelector('canvas#board');
canvas.setAttribute('width', 400);
canvas.setAttribute('height', 600);

surface = canvas.getContext('2d');

mouse = (function (target) {
  var isButtonDown = false;

  target.addEventListener('mousedown', function() {
    isButtonDown = true;
  });
  target.addEventListener('mouseup', function() {
    isButtonDown = false;
  });

  return {
    isButtonDown: function() {
      return isButtonDown;
     }
  };
}(document));


function makeBug(x, y, targets) {
  var position = {
    x: x,
    y: y
  };

  var turnSpeed = fullCircle;
  var speed = 2;
  var orientation = 0;
  var distances = findDistances(targets, position);
  var target = findNewTarget(targets, distances);


  function draw(ctx) {
    ctx.save();
    
    ctx.translate(position.x, position.y);
    ctx.rotate(orientation);
    ctx.fillStyle = 'blue';
    ctx.fillRect(-5, -20, 10, 40);
    ctx.restore();
	
	ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(targets[0].x, targets[0].y, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(targets[1].x, targets[1].y, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(targets[2].x, targets[2].y, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(targets[3].x, targets[3].y, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(targets[4].x, targets[4].y, 2, 0, Math.PI * 2, true);
    ctx.fill();

  }

  function update(elapsed) {
    var y = target.y - position.y;
    var x = target.x - position.x;
    var d2 = Math.pow(x, 2) + Math.pow(y, 2);
    if (d2 < 16) {
	  var min = Math.min.apply(null, distances);
	  var shortest_index = distances.indexOf(min);
	  targets.splice(shortest_index, 1);
      distances = findDistances(targets, position);
      target = findNewTarget(targets, distances);
    }
    else {
      var angle = Math.atan2(y, x);
      var delta = angle - orientation;
      var delta_abs = Math.abs(delta);

      if (delta_abs > Math.PI) {
        delta = delta_abs - fullCircle;
      }

      if (delta !== 0) {
        var direction = delta / delta_abs;
        orientation += (direction * Math.min(turnSpeed, delta_abs));
      }
      orientation %= fullCircle;

      position.x += Math.cos(orientation) * speed;
      position.y += Math.sin(orientation) * speed;
    }
  }
 
 
  function findDistances(targets, position) {
	  //var min = Math.min.apply(null, distances);
      //var shortest_index = distances.indexOf(min);
	  //distances[shortest_index] = 99999999;
	  var newdistances = [];
	  for (var i = 0; i <= targets.length - 1; i++) {
	    newdistances.push(Math.pow(targets[i].x - position.x, 2) + Math.pow(targets[i].y - position.y, 2));
	  }
    return newdistances;
  }
 
  function findNewTarget(targets, distances) {
    var min = Math.min.apply(null, distances);
    var shortest_index = distances.indexOf(min);
    var target = targets[shortest_index];
    return target;
  }

  return {
    draw: draw,
    update: update
  }
}

gamePage = (function () {

  var entities = [];
  var numOfBugs = 1;
  var target1, target2, target3, target4, target5;
  var targets = [target1, target2, target3, target4, target5];

  targets[0] = {x: 300, y: 500};
  targets[1] = {x: 200, y: 450};
  targets[2] = {x: 100, y: 500};
  targets[3] = {x: 300, y: 200};
  targets[4] = {x: 100, y: 300};

  function start() {
    
	for (var i = 0; i <= numOfBugs; i++) {
      entities.push(makeBug(Math.floor((Math.random() * 400) + 1), 0, targets));
    }
  }

  function draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var entityIndex = entities.length - 1;
    for (; entityIndex != 0; entityIndex--) {
      entities[entityIndex].draw(ctx);
    }
  }

  function update(elapsed) {

    var entityIndex = entities.length - 1;
    for (;entityIndex != 0; entityIndex--) {
     entities[entityIndex].update(elapsed);
    }
  }

  return {
    draw: draw,
    update: update,
    start: start
  };
}());


currPage = (function (input) {

    var hue = 0;
    var transitioning = false;
    var wasButtonDown = false;
    var title = 'My Awesome Game';

    function centerText(ctx, text, y) {
        var measurement = ctx.measureText(text);
        var x = (ctx.canvas.width - measurement.width) / 2;
        ctx.fillText(text, x, y);
    }

    function draw(ctx) {

        var y = ctx.canvas.height / 2;
        var color = 'rgb(' + hue + ',0,0)';

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px monospace';
        centerText(ctx, title, y);

        ctx.fillStyle = color;
        ctx.font = '24px monospace';
        centerText(ctx, 'click to begin', y + 30);
    }

    function update() {


        var isButtonDown = input.isButtonDown();
        var mouseJustClicked = !isButtonDown && wasButtonDown;

        if (mouseJustClicked && !transitioning) {
            transitioning = true;
            currPage = gamePage;
            currPage.start();
        }

        wasButtonDown = isButtonDown;
    }

    return {
        draw: draw,
        update: update
    };
}(mouse));




beginLoop();
