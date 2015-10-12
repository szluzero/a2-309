var canvas, surface, currPage, gamePage, mouse, fullCircle = Math.PI * 2, startPage;
var endgame = 0;
var m = 0;
var highscore = 0;
var score;
var time;
var countup = 0;
var page2 = 0;
var pause = 0;
var si;
var cut = 0;
var z = 0;
var level = 1;
var gameover = 0;

function beginLoop() {
  var frameID = 0;
  var lastFrame = Date.now();
  startPage = currPage;

  function loop() {
    var currFrame = Date.now();

    var elapsed = currFrame - lastFrame;

    frameID = window.requestAnimationFrame(loop);

    if (endgame == 1 || time == 0) {
      if (level == 1 && gameover == 0) {
        time = 60;
        level = 2;
        endgame = 0;
        m = 0;
      }
      else {
        level = 1;
        endgame = 0;
        time = 60;
      
        try {
        currPage.end();
        }
        catch(err) {
          currPage = gamePage;
          currPage.end();
        }
      }
    }

    currPage.update(elapsed);
    currPage.draw(surface);
    lastFrame = currFrame;
    if (countup == 60) {
      time--;
      countup = 0;
    }

    countup++;
  }

  loop();
}

canvas = document.querySelector('canvas#board');
canvas.setAttribute('width', 400);
canvas.setAttribute('height', 600);

surface = canvas.getContext('2d');


mouse = (function (target) {
  var isButtonDown = false;

  target.addEventListener('mousedown', function(e) {
    
    var rect = surface.canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;

    if ((mouseX > 100 - 15 && mouseX < 100 + 15) && (mouseY > 200 - 15 && mouseY < 200 + 15)) {
      isButtonDown = true;
    }

    if ((mouseX > 300 - 15 && mouseX < 300 + 15) && (mouseY > 200 - 15 && mouseY < 200 + 15)) {
      isButtonDown = true;
      level = 2;
    }
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


function makeBug(x, y, targets, speed, colour) {
  var position = {
    x: x,
    y: y
  };

  if (level == 2) {
    speed = speed/3 + speed;
  }
  var kill = 0;
  var turnSpeed = fullCircle;
  var orientation = 0;
  var distances = findDistances(targets, position);
  var target = findNewTarget(targets, distances);

  window.addEventListener('mousedown', mouseclickEvent);
  function mouseclickEvent(e) {
    var rect = surface.canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;

    if ((mouseX > position.x - 20 && mouseX < position.x + 20) && (mouseY > position.y - 20 && mouseY < position.y + 20)) {
      kill = 1;
      if (colour == 'black') {
        score += 5;
      }
      else if (colour == 'red') {
        score += 3;
      }
      else {
        score += 1;
      }

      
      if (score > highscore) {
        highscore = score;
      }
    }
};



  function draw(ctx) {
    if (kill == 0) {
    ctx.save();
    
    ctx.translate(position.x, position.y);
    ctx.rotate(orientation);
    ctx.fillStyle = colour;
    ctx.fillRect(-5, -20, 10, 40);
    ctx.restore();
  }
  
    if (targets[0] != null) {
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(targets[0].x, targets[0].y, 2, 0, Math.PI * 2, true);
      ctx.fill();
    }

    if (targets[1] != null) {
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(targets[1].x, targets[1].y, 2, 0, Math.PI * 2, true);
      ctx.fill();
    }

    if (targets[2] != null) {
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(targets[2].x, targets[2].y, 2, 0, Math.PI * 2, true);
      ctx.fill();
    }

    if (targets[3] != null) {
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(targets[3].x, targets[3].y, 2, 0, Math.PI * 2, true);
      ctx.fill();
    }

    if (targets[4] != null) {
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(targets[4].x, targets[4].y, 2, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }

  function update(elapsed) {
    if (kill == 1) {
      position.x = 0;
      position.y = 0;
    }
    else {
    if (target == null) {
      distances = findDistances(targets, position);
      target = findNewTarget(targets, distances);
      while (target == null) {
      }
    }
    else {
    var y = target.y - position.y;
    var x = target.x - position.x;
    var d2 = Math.pow(x, 2) + Math.pow(y, 2);
    if (d2 < 16) {
      var min = Math.min.apply(null, distances);
      var shortest_index = distances.indexOf(min);
      targets.splice(shortest_index, 1);
      distances = findDistances(targets, position);
      target = findNewTarget(targets, distances);
      if (target == null) {
        endgame = 1;
        m = 10;
        gameover = 1;
      }
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
}
  }
 
 
  function findDistances(targets, position) {
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
  var entities;
  var numOfBugs;
  var targets;
  var target1, target2, target3, target4, target5;

  function start() {
    page2 = 1;
    time = 60;
    entities = [];
    score = 0;

    targets = [target1, target2, target3, target4, target5];

    targets[0] = {x: Math.random() * 400, y: (Math.random() + 0.2) * 500};
    targets[1] = {x: Math.random() * 400, y: (Math.random() + 0.2) * 500};
    targets[2] = {x: Math.random() * 400, y: (Math.random() + 0.2) * 500};
    targets[3] = {x: Math.random() * 400, y: (Math.random() + 0.2) * 500};
    targets[4] = {x: Math.random() * 400, y: (Math.random() + 0.2) * 500};

    entities.push(makeBug(Math.random() * 400, 60, targets, 1.5, 'black'));

    }

  function draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px monospace';
    ctx.fillText("Timer: " + time, 25, 20);
    ctx.fillText("||", 200, 20);
    ctx.fillText("Score: " + score, 275, 20);
    
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(400, 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(400, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 600);
    ctx.lineTo(400, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();


    var entityIndex = entities.length - 1;
    for (; entityIndex != 0; entityIndex--) {
      entities[entityIndex].draw(ctx);
    }
  }

  function update(elapsed) {
    if (z == 0) {
      var speed, colour;
      var bugcolour = Math.random();
      if (bugcolour <= 0.3) {
        colour = 'black';
        speed = 1.5;
      }
      else if (bugcolour > 0.3 && bugcolour <= 0.6) {
        colour = 'red';
        speed = 0.75;
      }
      else {
        colour = 'orange';
        speed = 0.60;
      }
      entities.push(makeBug(Math.random() * 400, 60, targets, speed, colour));
      var howlong = Math.random();
      if (howlong <= 0.33) {
        z = 60;
      }
      else if (howlong > 0.33 && howlong <= 0.66) {
        z = 120;
      }
      else {
        z = 180;
      }
    }
    if (z > 0) {
      z--;
    }
    var entityIndex = entities.length - 1;
    for (;entityIndex != 0; entityIndex--) {
     entities[entityIndex].update(elapsed);
    }

  }

  function end() {
    entities.length = 0;
    targets.length = 0;
    currPage = startPage;
  }
   
  return {
    draw: draw,
    update: update,
    start: start,
    end : end
  };
}());


currPage = (function (input) {

    var transitioning = false;
    var wasButtonDown = false;
    var title = "High Score: " + highscore;

    function centerText(ctx, text, y) {
        var measurement = ctx.measureText(text);
        var x = (ctx.canvas.width - measurement.width) / 2;
        ctx.fillText(text, x, y);
    }

    function draw(ctx) {

        var y = ctx.canvas.height / 2;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px monospace';
        centerText(ctx, title, y);

        ctx.fillStyle = 'black';
        ctx.font = '24px monospace';
        centerText(ctx, 'choose a level', y + 30);

        ctx.fillStyle = 'white';
        ctx.font = '24px monospace';
        ctx.fillText("Level 1", 60, 150);

        ctx.fillStyle = 'white';
        ctx.font = '24px monospace';
        ctx.fillText("Level 2", 260, 150);

        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(100, 200, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(300, 200, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    function update() {
        title = "High Score: " + highscore;

        var isButtonDown = input.isButtonDown();
        var mouseJustClicked = !isButtonDown && wasButtonDown;

        if (m != 0) {
          isButtonDown = false;
          mouseJustClicked = false;
        }

        if (mouseJustClicked) {
            currPage = gamePage;
            currPage.start();
        }

        wasButtonDown = isButtonDown;
        if (m > 0) {
          m--;
        }
    }

    return {
        draw: draw,
        update: update
    };
}(mouse));




beginLoop();
