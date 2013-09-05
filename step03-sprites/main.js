var myGame = myGame || {};

(function (ns) {
  var stage, canvas;
  var bg;

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

    var baseUrl = '../assets/';

    // init bg
    bg = new createjs.Bitmap(baseUrl + 'bg.png');
    stage.addChild(bg);

    // init ball
    ball = new createjs.Bitmap(baseUrl + 'sphere.png');
    ball.regX = 8;
    ball.regY = 8;
    stage.addChild(ball);
    ballSpeedX = 150;
    ballSpeedY = -150;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 300;

    // init hero
    var spritesheet = new createjs.SpriteSheet({
      "images": [
        baseUrl + "sprite-walk-74px.png"
        ],
      "frames": {
        "width": 74,
        "height": 64,
        "count": 8,
        "regX": 37,
        "regY": 32
      },
      "animations": {
        "walk": [0, 7, true, 3]
      }
    });
    hero = new createjs.BitmapAnimation(spritesheet);
    stage.addChild(hero);
    hero.gotoAndPlay('walk');
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
      hero.scaleX = -1;
    } else if (heroIsMoveRight) {
      heroSpeedX = 250;
      hero.scaleX = 1;
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
