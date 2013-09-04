var myGame = myGame || {};

(function (ns) {
  var stage, canvas;

  var ball;
  var ballSpeedX, ballSpeedY;
  var ballRadius = 8;

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
    ballSpeedY = 150;

    // start animation
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', onTick);
    createjs.useRAF = true;
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

    stage.update();
  };

})(myGame);
