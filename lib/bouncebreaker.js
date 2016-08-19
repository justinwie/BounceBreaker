document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.getElementById("myCanvas");
    canvas.width = 480;
    canvas.height = 320;
  var ctx = canvas.getContext("2d");

  var x = canvas.width/2;
  var y = canvas.height-10;

  var lineX = canvas.width/2;
  var lineY = 0;

  var speedScale = 4;

  var dx = (lineX - x)/(y - lineY) * speedScale;
  var dy = -1 * speedScale;

  var ballRadius = 10;

  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth)/2;

  var rightPressed = false;
  var leftPressed = false;
  var spacePressed = false;

  var startRound = 0;

  var brickRowCount = 3;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;

  var r = 100;
  var theta = 0.5;



  var bricks = [];
  for (var i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickRowCount; j++) {
      bricks[i][j] = { x: 0, y: 0, hit: 0 };
    }
  }

  var score = 0;


  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
    else if(e.keyCode === 32) {
        spacePressed = true;
    }
  }

  function keyUpHandler(e) {
      if(e.keyCode === 39) {
          rightPressed = false;
      }
      else if(e.keyCode === 37) {
          leftPressed = false;
      }
      else if(e.keyCode === 32) {
          spacePressed = false;
      }
  }

  function collisionDetection(){
    for(i = 0; i < brickColumnCount; i++) {
      for(j = 0; j < brickRowCount; j++) {
        var brick = bricks[i][j];
        if(brick.hit === 0){
          if(x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y+brickHeight){
            dy = -dy;
            brick.hit = 1;
            score++;
            if(score === brickRowCount * brickColumnCount){
              alert("ya win!");
              document.location.reload();
            }
          }
        }
      }
    }
  }

  function drawArrow(){
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lineX, lineY);
    ctx.stroke();
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

  function drawBricks() {
    for(i = 0; i < brickColumnCount; i++) {
      for(j = 0; j < brickRowCount; j++) {
        if(bricks[i][j].hit === 0){
          var brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (j*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[i][j].x = brickX;
          bricks[i][j].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "Blue";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }


  function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }


  function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawArrow();
    collisionDetection();
    drawScore();


    if (startRound != 0) {

      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }

      if(y + dy < ballRadius) {
        dy = -dy;
      }

      else if(y + dy > canvas.height-ballRadius) {
        {  alert("GAME OVER");
          document.location.reload();
        }
      }

      x += dx;
      y += dy;
    }

    if (rightPressed && lineX < canvas.width) {
      if (lineY === 0) {
        lineX += 10
      }
      else{
        lineY -= 10
      }
      dx = (lineX - x)/(y - lineY) * speedScale;
      dy = -1 * speedScale;
    }
    if (rightPressed && lineX === canvas.width) {
      lineY += 10;
      dx = (lineX - x)/(y - lineY) * speedScale;
      dy = -1 * speedScale;
    }


    if (leftPressed && lineX === 0) {
      lineY += 10
      dx = (lineX - x)/(y - lineY) * speedScale;
      dy = -1 * speedScale;
    }
    else if (leftPressed && lineX > 0) {
      if (lineY != 0) {
        lineY -= 10
      }
      else {
        lineX -= 10
      }
      dx = (lineX - x)/(y - lineY) * speedScale;
      dy = -1 * speedScale;
    }

    if (spacePressed) {
      startRound++;
    }

    requestAnimationFrame(draw);
  }

  draw();
});
