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

  var buildings;
  var buildingRadius = 20;

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

    // create buildings
    spritesheet = new createjs.SpriteSheet({
      "images": [ baseUrl + "buildings.png"],
      "frames": [
        [33, 0, 27, 62, 0, 13, 42],
        [96, 0, 15, 62, 0, 8, 42],
        [79, 0, 15, 62, 0, 8, 42],
        [62, 0, 15, 64, 0, 8, 42],
        [0, 0, 31, 59, 0, 15, 39]
      ],
      "animations": {
        "tilemap": [0, 4]
      }
    });

    // generate several buildings using the same spritesheet
    buildings = [];
    var numOfCols = 15;
    var numOfRows = 6;
    var padding = 10;
    var col, row, posX, posY = 100, frameNum;
    var building;
    for (row = 0; row < numOfRows; row++) {
      posX = 25;
      for (col = 0; col < numOfCols; col++) {
        building = new createjs.BitmapAnimation(spritesheet);
        building.x = posX;
        building.y = posY;
        stage.addChild(building);

        // show different frame, randomly
        building.gotoAndStop(Math.floor(Math.random() * 5));

        buildings.push(building);

        posX += 20 + padding;
      }
      posY += 20 + padding;
    }

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

    // check collision between ball and hero
    if (isCollide(hero.x, hero.y, heroRadius, ball.x, ball.y, ballRadius)) {
      // always bounce up
      if (ballSpeedY > 0) {
        ballSpeedY *= -1;
      }
    }

    // check collision between ball and buildings

    stage.update();
  };

  // Check if two circle is colliding.
  // Return true if circle A and B collides.
  // aX,aY = center of circle A
  // aRadius = radius of circle A
  var isCollide = function (aX, aY, aRadius, bX, bY, bRadius) {
    var squareDistance = ((aX - bX) * (aX - bX)) + ((aY - bY) * (aY - bY));
    return squareDistance <= ((aRadius + bRadius) * (aRadius + bRadius));
  };
})(myGame);
