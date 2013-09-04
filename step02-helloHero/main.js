var myGame = myGame || {};

(function (ns) {
  var stage, canvas;

  var ball;
  var ballSpeedX, ballSpeedY;
  var ballRadius = 8;

  var hero;
  var heroIsMoveLeft, heroIsMoveRight;
  var heroSpeedX;
  var heroRadius = 30;

  // init the application
  ns.init = function () {
    // init canvas and stage
    canvas = document.getElementById('canvas-main');
    stage = new createjs.Stage(canvas);

    // init ball
    ball = new createjs.Shape();
    var g = ball.graphics;
    g.beginFill('#009eef');
    g.drawCircle(0, 0, ballRadius);
    g.endFill();
    stage.addChild(ball);
    ballSpeedX = 150;
    ballSpeedY = -150;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 300;

    // init hero
    hero = new createjs.Shape();
    g = hero.graphics;
    g.beginFill('#ff8080');
    g.drawRect(0, 0, 70, 60);
    g.endFill();
    stage.addChild(hero);
    hero.regX = 35;
    hero.regY = 30;
    hero.x = canvas.width / 2;
    hero.y = canvas.height - 150;
    heroIsMoveLeft = heroIsMoveRight = false;

    // register key event
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;

    // start animation
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', onTick);
    createjs.useRAF = true;
  };

  var onKeyUp = function () {
    switch (event.keyCode) {
    case 37:
      // left
      heroIsMoveLeft = false;
      break;

    case 39:
      // right
      heroIsMoveRight = false;
      break;
    }
  };

  var onKeyDown = function () {
    switch (event.keyCode) {
    case 37:
      // left
      heroIsMoveLeft = true;
      break;

    case 39:
      // right
      heroIsMoveRight = true;
      break;
    }
  };

  var onTick = function (event) {
    var delta = event.delta * 0.001;

    // animate the ball
    ball.x += ballSpeedX * delta;
    ball.y += ballSpeedY * delta;

    // ball bounce
    if (ball.x <= ballRadius) {
      ballSpeedX *= -1;
      ball.x = ballRadius;
    } else if (ball.x >= (canvas.width - ballRadius)) {
      ballSpeedX *= -1;
      ball.x = canvas.width - ballRadius;
    }

    if (ball.y <= ballRadius) {
      ballSpeedY *= -1;
      ball.y = ballRadius;
    } else if (ball.y >= (canvas.height - ballRadius)) {
      ballSpeedY *= -1;
      ball.y = canvas.height - ballRadius;
    }

    // move hero based on moving direction
    if (heroIsMoveLeft) {
      heroSpeedX = -250;
    } else if (heroIsMoveRight) {
      heroSpeedX = 250;
    } else {
      heroSpeedX = 0;
    }

    // update hero position
    hero.x += heroSpeedX * delta;

    // limit hero position
    if (hero.x <= heroRadius) {
      hero.x = heroRadius;
    } else if (hero.x >= (canvas.width - heroRadius)) {
      hero.x = canvas.width - heroRadius;
    }

    stage.update();
  };

})(myGame);
