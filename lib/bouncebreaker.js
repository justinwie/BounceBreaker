document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.getElementById("myCanvas");
  canvas.width = 480;
  canvas.height = 480;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);


  var ctx = canvas.getContext("2d");

  var x = canvas.width/2;
  var y = canvas.height-10;

  var lineX = canvas.width/2;
  var lineY = 0;

  var rightBorder = Math.floor(canvas.width * 0.8);
  var leftBorder = Math.floor(canvas.width * 0.2);
  var bottomBorder = Math.floor((canvas.height * 0.5));
  var topBorder = Math.floor(canvas.height * 0.8);

  var randX = Math.floor(Math.random() * (rightBorder - leftBorder + 1)) + leftBorder;
  var randY = Math.floor(Math.random() * (topBorder - bottomBorder + 1)) + bottomBorder;

  var speedScale = 12;

  var dx = (lineX - x)/(y - lineY) * speedScale;
  var dy = -1 * speedScale;

  var rightLevel = 10;
  var ballRadius = 10;

  var rightPressed = false;
  var leftPressed = false;
  var spacePressed = false;

  let startRound = 0;
  var brokenBricks = 0

  var brickRowCount = 1;
  var brickColumnCount = 6;
  var brickWidth = 60;
  var brickHeight = 30;
  var brickPadding = 1;
  var brickOffsetTop = brickHeight*1.5;
  var brickOffsetLeft = (canvas.width - ((brickWidth+(brickPadding))*brickColumnCount))/2;

  var minNewBricks = 4;
  var maxNewBricks = 6;

  let ballLevel = 1;

  var round = 1;

  let newRound = false;

  let powerBalls = [];
  let powerCounter = 0;

  let existingBricks = new Array(brickColumnCount);

  for (var i = 0; i < brickColumnCount; i++) {
    existingBricks[i] = [];
    for (var j = 0; j < brickRowCount; j++) {
      existingBricks[i][j] = { x: 0, y: 0, hit: 0, power: round };
    }
  };

  let newBricks = [];

  function createNewBricks(){
    let randomNumBricks = Math.floor(Math.random() * (maxNewBricks - minNewBricks + 1)) + minNewBricks;
    for (var i = 0; i < randomNumBricks; i++) {
      newBricks[i] = [];
      newBricks[i][0] = { x: 0, y: 0, hit: 0, power: round };
    };
    for(i = 0; i < newBricks.length; i++) {
      var brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
      var brickY = brickOffsetTop
      newBricks[i][0].x = brickX;
      newBricks[i][0].y = brickY;
    }
  }

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
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        let existingBrick = existingBricks[i][j];
        if(existingBrick.power > 0){

          if((x+(ballRadius*2) >= existingBrick.x) && (x+(ballRadius*2) < (existingBrick.x + brickWidth)) && (y >= (existingBrick.y)) && (y+(2*ballRadius) <= existingBrick.y+brickHeight)){
            // left
            dx = -dx;
            existingBrick.power -= ballLevel;
          }
          else if((x <= existingBrick.x+ brickWidth) && (x > (existingBrick.x)) && (y >= (existingBrick.y)) && (y+(2*ballRadius) <= existingBrick.y+brickHeight)){
            // right
            dx = -dx;
            existingBrick.power -= ballLevel;
          }
          else if((y <= (existingBrick.y+brickHeight)) && (y > existingBrick.y) && (x >= existingBrick.x) && (x+(2*ballRadius) <= (existingBrick.x + brickWidth))){
            // bottom
            dy = -dy;
            existingBrick.power -= ballLevel;
          }
          else if((y+(2*ballRadius) >= (existingBrick.y)) && (y+(2*ballRadius) < existingBrick.y+brickHeight) && (x >= existingBrick.x) && (x+(2*ballRadius) <= (existingBrick.x + brickWidth))){
            dy = -dy;
            existingBrick.power -= ballLevel;
          }
        }
      }
    }
    for(i = 0; i < powerBalls.length; i++) {
      let powerBall = powerBalls[i];
      if (powerBall.hit === 0) {
        if ((x+ballRadius > powerBall.x-powerBall.radius) && (x-ballRadius < powerBall.x+powerBall.radius) && (y+ballRadius > powerBall.y-powerBall.radius) && (y-ballRadius < powerBall.y+powerBall.radius)){
          ballLevel += powerBall.power;
          powerBall.hit = 1;
        }
      }
    }
  }

  function checkIfLost(){
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        var brick = existingBricks[i][j];
        if(brick.power > 0){
          if(brick.y > canvas.height-brickHeight-10){
            lostGame()
            spacePressed = false
            leftPressed = false
            rightPressed = false
          }
        }
      }
    }
  }

  function lostGame(){
    $(".modal").not("#lost").hide();
    $("#lost").show()
  }

  function drawArrow(){
    ctx.beginPath();
    ctx.setLineDash([10]);
    ctx.moveTo(x, y);
    ctx.lineTo(lineX, lineY);
    ctx.stroke();
  }

  function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#69D2E7';
    ctx.fill();
    ctx.closePath();
  }

  function drawPowerLevel(){
    ctx.font = "16px Helvetica";
    ctx.fillStyle = "Black";
    ctx.fillText('Power: '+ballLevel, 8, canvas.height-10);
  }

  function createInitialBricks(){
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        if(existingBricks[i][j].power > 0){
            var brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (j*(brickHeight+brickPadding))+brickOffsetTop;
            existingBricks[i][j].x = brickX;
            existingBricks[i][j].y = brickY;
        }
      }
    }
  }

  function drawBricks() {
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        if(existingBricks[i][j].power > 0){

          ctx.beginPath();
          ctx.rect(existingBricks[i][j].x, existingBricks[i][j].y, brickWidth, brickHeight);

          if ((ballLevel <= 0)) {
            ctx.fillStyle = "darkgrey";
          }
          else if (existingBricks[i][j].y >= (canvas.height-(brickHeight*3)) ) {
            if (Math.random() > 0.7) {
              ctx.fillStyle = "#000000";
            }else {
              ctx.fillStyle = "#30302e";
            }
          }
          else if (existingBricks[i][j].power - ballLevel >= 5) {
            ctx.fillStyle = "#48b2ff";
          }
          else if ((existingBricks[i][j].power - ballLevel >= 3)&&(existingBricks[i][j].power - ballLevel < 5)) {
            ctx.fillStyle = "#48b2ff";
          }
          else if ((existingBricks[i][j].power - ballLevel >= 1)&&(existingBricks[i][j].power - ballLevel < 3)) {
            ctx.fillStyle = "#fa3f00";
          }
          else {
            ctx.fillStyle = "#ff862e";
          }
          ctx.fill();
          ctx.closePath();
          let fontAdjust = 3;
          if (existingBricks[i][j].power < 10) {
            fontAdjust = 2;
          }
          ctx.font = "14px Helvetica";
          ctx.fillStyle = "White";
          ctx.fillText(existingBricks[i][j].power, existingBricks[i][j].x+brickWidth/2-brickPadding*fontAdjust, existingBricks[i][j].y+brickPadding*2+brickHeight/2);
        }

      }
    }
  }

  function drawBrokenBricks(){
    ctx.font = "16px Helvetica";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Bricks: "+brokenBricks, canvas.width - 115, canvas.height - 10);
  }

  function createPowerBall(){
    if (powerCounter < round-1) {
      randX = Math.floor(Math.random() * (rightBorder - leftBorder + 1)) + leftBorder;
      randY = Math.floor(Math.random() * (topBorder - bottomBorder + 1)) + bottomBorder;

      powerBall = { x: randX, y: randY, hit: 0, power: 1, radius: 14, speed: 1 }

      powerBalls.push(powerBall)

      if (Math.random()>0.7) {
        randX = Math.floor(Math.random() * (rightBorder - leftBorder + 1)) + leftBorder;
        randY = Math.floor(Math.random() * (topBorder - bottomBorder + 1)) + bottomBorder;
        if (Math.random()>1) {
          powerBall = { x: randX, y: randY, hit: 0, power: +2, radius: 12, speed: 1 }
        }else {
          powerBall = { x: randX, y: randY, hit: 0, power: -1, radius: 14, speed: 1  }
        }
        powerBalls.push(powerBall)
      }
      powerCounter += 1;
    }
  }

  function drawPowerBalls(){
    for(i = 0; i < powerBalls.length; i++) {
      let powerBall = powerBalls[i];
      if (powerBall.hit === 0) {
        let powerBallColor = powerBall.power === 1 ? "#bedc27" : "black"
        let powerBallText = (powerBall.power >= 0) ? "+" : "x"
        let powerBallFont = (powerBall.power === -1) ? "16px" : "16px"

        ctx.beginPath();
        ctx.arc(powerBall.x, powerBall.y, powerBall.radius, 0, Math.PI*2);
        ctx.fillStyle = powerBallColor;
        ctx.fill();
        ctx.closePath();

        ctx.font = powerBallFont + " Helvetica";
        ctx.fillStyle = "White";
        ctx.fillText(powerBallText, powerBall.x-powerBall.radius/3, powerBall.y+powerBall.radius/3);
      }
    }
  }

  function drawRound(){
    ctx.font = "16px Helvetica";
    ctx.fillStyle = "Black";
    ctx.fillText("Round: "+round, 8, 20);
  }
  function drawHighScore(){
    let prevBest = window.localStorage.getItem('bestScore')
    if (round > prevBest) {
      window.localStorage.setItem('bestScore', round)
    }
    let best = Math.max(round, prevBest)
    ctx.font = "16px Helvetica";
    ctx.fillStyle = "Black";
    ctx.fillText("High Score: "+  best, canvas.width - 115, 20);
  }

  function fillCanvas(){
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f2e6";
    ctx.fill();
  }



  function draw(){
    fillCanvas()
    checkIfLost();

    drawBricks();
    drawPowerBalls();
    drawHighScore();

    if (startRound === 0) {
      drawArrow();
      createPowerBall()
    }

    drawRound();
    drawBall();
    drawPowerLevel();


    collisionDetection();

    if (startRound != 0) {
      if(x + dx > (canvas.width-ballRadius) || (x + dx) < ballRadius) {
        dx *= -1;
      }
      if((y + dy) < ballRadius) {
        dy *= -1;
      }
      x += dx;
      y += dy;

      if(y + dy > canvas.height-(ballRadius)) {
        round++;

        lineX = x;
        lineY = 0;

        dx = (lineX - x)/(y - lineY) * speedScale;
        dy = -1 * speedScale;

        for (var i = 0; i < existingBricks.length; i++) {
          for (var j = 0; j < existingBricks[i].length; j++) {
            existingBricks[i][j].y += (brickWidth/2+brickPadding)
          }
        };

        createNewBricks()

        for (var i = 0; i < newBricks.length; i++) {
          let randomCol = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
          newBricks[i][0].x = existingBricks[randomCol][0].x;
          existingBricks[randomCol].unshift(newBricks[i][0])
        }

        for (var i = 0; i < powerBalls.length; i++) {
          if (powerBalls[i].power != 1) {
            powerBalls.splice(i, 1)
          }
        }

        newBricks = [];
        startRound = 0;
      }
    }

    if (rightPressed && startRound === 0 ) {
      if (lineX < canvas.width) {
        if (lineY === 0) {
          lineX += 20
        }
        else{
          lineY -= 20
        }
      }
      else if(lineY<canvas.height*.80){
        lineY += 20;
      }

      dx = (lineX - x)/(y - lineY) * speedScale;
      dy = -1 * speedScale;


    }

    else if (leftPressed && startRound === 0) {
      if (lineX > 0) {
        if (lineY != 0) {
          lineY -= 20
        }
        else {
          lineX -= 20
        }
      }
      else if(lineY<canvas.height*.80){
        lineY += 20
      }

      dx = (lineX - x)/(y - lineY) * speedScale;
      dy = -1 * speedScale;

    }

    if (spacePressed) {
      startRound++;
    }
  }

  function game(){
    draw();
    requestAnimationFrame(game);
  }
  createInitialBricks()
  game();
});
