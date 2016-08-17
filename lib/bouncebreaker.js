document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.getElementById("myCanvas");
    canvas.width = 480;
    canvas.height = 320;
  var ctx = canvas.getContext("2d");


  var x = canvas.width/2;
  var y = canvas.height/2;
  var dx = 2;
  var dy = -2;


  var ballRadius = 10;

  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth)/2;

  var rightPressed = false;
  var leftPressed = false;

  var brickRowCount = 3;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;

  var bricks = [];
  for (var i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickRowCount; j++) {
      bricks[i][j] = { x: 0, y: 0 };
    }
  }

  function drawBricks() {
    for(i=0; i<brickColumnCount; i++) {
      for(j=0; j<brickRowCount; j++) {
          bricks[i][j].x = 0;
          bricks[i][j].y = 0;
          ctx.beginPath();
          ctx.rect(0, 0, brickWidth, brickHeight);
          ctx.fillStyle = "Black";
          ctx.fill();
          ctx.closePath();
      }
    }
  }



  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
  }

  function keyUpHandler(e) {
      if(e.keyCode === 39) {
          rightPressed = false;
      }
      else if(e.keyCode === 37) {
          leftPressed = false;
      }
  }

  function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "Green";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "Red";
    ctx.fill();
    ctx.closePath();
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
      if(x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
      }
      else {
          alert("GAME OVER");
          document.location.reload();
      }
    }

    if (rightPressed && (paddleX < canvas.width-paddleWidth)) {
      paddleX += 6;
    }
    else if (leftPressed && paddleX > 0) {
      paddleX -= 6;
    }

    x += dx;
    y += dy;
  }



  setInterval(draw, 10);




});
