var canvas, surface, currPage, gamePage, mouse, fullCircle = Math.PI * 2;


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

function makeBug(x, y) {
  var position = {
    x: x,
    y: y
  };

  var turnSpeed = fullCircle;
  var speed = 2;
  var orientation = 0;
  var target = findNewTarget();
  var target1, target2, target3, target4, target5;
  var targets = [target1, target2, target3, target4, target5];
  targets[0] = {x: 300, y: 500};
  targets[1] = {x: 200, y: 450};
  targets[2] = {x: 100, y: 500};
  targets[3] = {x: 300, y: 200};
  targets[4] = {x: 450, y: 400};

  var dis1 = Math.pow(targets[0].x - position.x, 2) + Math.pow(targets[0].y - position.y, 2);
  var dis2 = Math.pow(targets[1].x - position.x, 2) + Math.pow(targets[1].y - position.y, 2);
  var dis3 = Math.pow(targets[2].x - position.x, 2) + Math.pow(targets[2].y - position.y, 2);
  var dis4 = Math.pow(targets[3].x - position.x, 2) + Math.pow(targets[3].y - position.y, 2);
  var dis5 = Math.pow(targets[4].x - position.x, 2) + Math.pow(targets[4].y - position.y, 2);
  var distances = [dis1, dis2, dis3, dis4, dis5];

  function draw(ctx) {
    ctx.save();
    
    ctx.translate(position.x, position.y);
    ctx.rotate(orientation);
    ctx.fillStyle = 'blue';
    ctx.fillRect(-5, -20, 10, 40);
    ctx.restore();

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(target.x, target.y, 2, 0, Math.PI * 2, true);
    ctx.fill();
  }

  function update(elapsed) {
    var y = target.y - position.y;
    var x = target.x - position.x;
    var d2 = Math.pow(x, 2) + Math.pow(y, 2);
    if (d2 < 16) {
      target = targets[0];//{x:0, y:0};
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
 
  function findNewTarget() {
    var target = {
      x: Math.round(Math.random() * 400),
      y: Math.round(Math.random() * 600)
    };

    return target;
  }

  return {
    draw: draw,
    update: update
  }
}

gamePage = (function () {

  var entities = [];
  var numOfBugs = 0;

  function start() {
    for (var i = 0; i <= 20; i++) {
      entities.push(makeBug(Math.floor((Math.random() * 400) + 1), 0));
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
