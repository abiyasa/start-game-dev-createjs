var myGame = myGame || {};

(function (ns) {
  var stage, canvas;
  var preloader;
  var labelDone;
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

    // preload assets
    preloader = new createjs.LoadQueue();
    preloader.addEventListener('complete', onCompleteAssets);
    preloader.loadManifest([
      { id: 'bg', src: baseUrl + 'bg.png' },
      { id: 'sphere', src: baseUrl + 'sphere.png' },
      { id: 'sprite-walk', src: baseUrl + "sprite-walk-74px.png" },
      { id: 'buildings', src: baseUrl + "buildings.png" }
    ]);
  };

  var onCompleteAssets = function () {
    // show we're done
    labelDone = new createjs.Container();
    var bgText = new createjs.Shape();
    var g = bgText.graphics;
    g.beginFill('#009eef');
    g.drawRect(0, 0, 640, 50);
    g.endFill();
    labelDone.addChild(bgText);
    var text = new createjs.Text('Assets loaded. Click to start!',
      '18px Verdana, Helvetica', '#000');
    labelDone.addChild(text);
    text.x = 100;
    text.y = 10;
    labelDone.addEventListener('click', startGame);
    stage.addChild(labelDone);
    labelDone.y = 100;

    stage.update();
  };

  var startGame = function () {
    stage.removeChild(labelDone);

    // init bg
    bg = new createjs.Bitmap(preloader.getResult('bg'));
    stage.addChild(bg);

    // init ball
    ball = new createjs.Bitmap(preloader.getResult('sphere'));
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
        preloader.getResult('sprite-walk')
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
      "images": [ preloader.getResult('buildings') ],
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
    handleBuildingsCollision();

    stage.update();
  };

  // handle the collision between the ball and the buildings.
  // will bounce the ball and remove the colliding buildings
  var handleBuildingsCollision = function () {
    var ballHit = false;
    var numOfBuildings = buildings.length;
    var i = 0;
    var building;
    while (!ballHit && (i < numOfBuildings)) {
      building = buildings[i];

      if (isCollide(building.x, building.y, buildingRadius, ball.x, ball.y, ballRadius)) {
        ballHit = true;

        // remove the building
        buildings.splice(i, 1);
        stage.removeChild(building);

        // check which part of the buildings hit by the ball
        // source: http://stackoverflow.com/questions/3309617/calculating-degrees-between-2-points-with-inverse-y-axis
        var hitAngle = Math.atan2(ball.y - building.y, building.x - ball.x);
        if (hitAngle < 0) {
          hitAngle += 2 * Math.PI;
        }
        hitAngle = Math.floor(hitAngle * 180 / Math.PI);

        // calculate bounce direction
        var bounceX = -1, bounceY = -1;
        if ((hitAngle >= 315) && (hitAngle < 45)) {
            // from top
            bounceX = 1;
            bounceY = -1;
        } else if ((hitAngle >= 45) && (hitAngle < 135)) {
            // from left
            bounceX = -1;
            bounceY = 1;
        } else if ((hitAngle >= 135) && (hitAngle < 225)) {
            // from below
            bounceX = 1;
            bounceY = -1;
        } else if ((hitAngle >= 225) && (hitAngle < 315)) {
            // from right
            bounceX = -1;
            bounceY = 1;
        }

        // bounce the ball
        ballSpeedX *= bounceX;
        ballSpeedY *= bounceY;
      }

      // next building
      i++;
    }
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
