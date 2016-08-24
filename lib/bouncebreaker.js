document.addEventListener("DOMContentLoaded", function(){
  var canvas = document.getElementById("myCanvas");
    canvas.width = 480;
    canvas.height = 320;

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

  // var powerUpBall = { x: randX, y: randY, hit: 0, power: 1, radius: 12 };

  var speedScale = 7;

  var dx = (lineX - x)/(y - lineY) * speedScale;
  var dy = -1 * speedScale;

  var rightLevel = 10;
  var ballRadius = 10;

  var rightPressed = false;
  var leftPressed = false;
  var spacePressed = false;

  let startRound = 0;

  var brickRowCount = 1;
  var brickColumnCount = 6;
  var brickWidth = 60;
  var brickHeight = 30;
  var brickPadding = 2;
  var brickOffsetTop = 30;
  // var brickOffsetLeft = 0;
  var brickOffsetLeft = (canvas.width - ((brickWidth+(brickPadding))*brickColumnCount))/2;

  var minNewBricks = 1;
  var maxNewBricks = 6;


  let ballLevel = 1;

  var score = 0;
  var round = 1;

  let newRound = false;

  let powerBalls = [];

  // let randomNum = Math.floor(Math.random() * (maxNewBricks - minNewBricks + 1)) + minNewBricks;

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
        // if(existingBrick.hit === 0){
        if(existingBrick.power > 0){
          if((y+ballRadius/2 > existingBrick.y) && (y-ballRadius/2 < (existingBrick.y+brickHeight)) && (x+ballRadius/2 > existingBrick.x) && (x-ballRadius/2 < (existingBrick.x + brickWidth))){
          // if((y > existingBrick.y) && (y < (existingBrick.y+brickHeight)) && (x > existingBrick.x) && (x < (existingBrick.x + brickWidth))){
          // if((y+ballRadius > existingBrick.y-brickHeight) && (y-ballRadius < (existingBrick.y+brickHeight)) && (x+ballRadius > existingBrick.x-brickWidth) && (x-ballRadius < (existingBrick.x + brickWidth))){
            // if (Math.random()>0) {
            //   dx = -dx;
            // }
            dy = -dy;
            existingBrick.power -= ballLevel;
            if (Math.random()>0.99) {
              dx *= 1.1;
            }
            // existingBrick.hit = 1;
            score++;
          }
        }
      }
    }
    for(i = 0; i < powerBalls.length; i++) {
      let powerBall = powerBalls[i];
      if (powerBall.hit === 0) {
        if ((x+ballRadius > powerBall.x-powerBall.radius) && (x-ballRadius < powerBall.x+powerBall.radius) && (y+ballRadius > powerBall.y-powerBall.radius) && (y-ballRadius < powerBall.y+powerBall.radius)){
          ballLevel += 1;
          powerBall.hit = 1;
        }
      }
    }


  }

  function checkIfLost(){
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        var brick = existingBricks[i][j];
        // if(brick.hit === 0){
        if(brick.power > 0){
          if(brick.y > canvas.height-brickHeight){
            alert("GAME OVER");
            document.location.reload();
          }
        }
      }
    }
  }

  // function animateBricks(duration){
  //   // let accel = 5;
  //   // const brickDy = 50 + accel;
  //   // let start = new Date().getTime();
  //   // let end = start + duration;
  //
  //   let animation = function(){
  //     for(i = 0; i < existingBricks.length; i++) {
  //       for(j = 0; j < existingBricks[i].length; j++) {
  //         if(existingBricks[i][j].hit === 0){
  //           ctx.beginPath();
  //           ctx.rect(existingBricks[i][j].x, existingBricks[i][j].y, brickWidth, brickHeight);
  //           ctx.fillStyle = "Purple";
  //           ctx.fill();
  //           ctx.closePath();
  //         }
  //       }
  //     }
  //
  //     let animate = true;
  //     if (animate) requestAnimationFrame(animation)
  //   }
  //
  //   setTimeout(function(){ animation() }, 1)
  //   let animate = false
  // }

  function drawArrow(){
    ctx.beginPath();
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

    // ctx.font = "12px Helvetica";
    // ctx.fillStyle = "White";
    // ctx.fillText(ballLevel, x-ballRadius/4, y+ballRadius/4);
  }

  function drawPowerLevel(){
    ctx.font = "14px Helvetica";
    ctx.fillStyle = "Black";
    ctx.fillText('Power: +'+ballLevel, 0, canvas.height-10);
  }

  function createInitialBricks(){
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        // if(existingBricks[i][j].hit === 0){
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
        // if(existingBricks[i][j].hit === 0){
        if(existingBricks[i][j].power > 0){
          ctx.beginPath();
          ctx.rect(existingBricks[i][j].x, existingBricks[i][j].y, brickWidth, brickHeight);

          if (existingBricks[i][j].power - ballLevel >= 5) {
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

          ctx.font = "14px Helvetica";
          ctx.fillStyle = "White";
          ctx.fillText(existingBricks[i][j].power, existingBricks[i][j].x+brickWidth/2-brickPadding*2, existingBricks[i][j].y+brickPadding*2+brickHeight/2);
        }
      }
    }
  }

  function drawScore(){
    ctx.font = "16px Helvetica";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function drawBallLevel(){
    ctx.font = "14px Helvetica";
    ctx.fillStyle = "Black";
    ctx.fillText("Ball Power: "+ballLevel, powerUpBall.x, powerUpBall.y-20);
  }


  function createPowerBall(){
    if (powerBalls.length < round-1) {
      randX = Math.floor(Math.random() * (rightBorder - leftBorder + 1)) + leftBorder;
      randY = Math.floor(Math.random() * (topBorder - bottomBorder + 1)) + bottomBorder;
      // random = Math.random();
      // randPower = if (random>0.3) {
      //
      // }
      powerBall = { x: randX, y: randY, hit: 0, power: 1, radius: 12 }

      // for(i = 0; i < existingBricks.length; i++) {
      //   for(j = 0; j < existingBricks[i].length; j++) {
      //     let existingBrick = existingBricks[i][j]
      //     if(existingBrick.power > 0){
      //       if(!((powerBall.y+ballRadius/2 > existingBrick.y) && (powerBall.y-ballRadius/2 < (existingBrick.y+brickHeight)) && (powerBall.x+ballRadius/2 > existingBrick.x) && (powerBall.x-ballRadius/2 < (existingBrick.x + brickWidth)))){
      //         powerBalls.push(powerBall)
      //       }
      //     }
      //   }
      // }
      powerBalls.push(powerBall)

    }
  }

  function drawPowerBalls(){
    for(i = 0; i < powerBalls.length; i++) {
      let powerBall = powerBalls[i];
      if (powerBall.hit === 0) {
        ctx.beginPath();
        ctx.arc(powerBall.x, powerBall.y, powerBall.radius, 0, Math.PI*2);
        ctx.fillStyle = "#bedc27";
        ctx.fill();
        ctx.closePath();

        ctx.font = "16px Helvetica";
        ctx.fillStyle = "#f5f5f5";
        ctx.fillText('+', powerBall.x-powerBall.radius/2, powerBall.y+powerBall.radius/2);
      }
    }
  }

  function drawRound(){
    ctx.font = "14px Helvetica";
    ctx.fillStyle = "Black";
    ctx.fillText("Round: "+round, 8, 20);
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
    drawPowerBalls()

    if (startRound === 0) {
      drawArrow();
      createPowerBall()
    }

    drawRound();
    drawBall();
    // drawBallLevel()
    drawPowerLevel()



    collisionDetection();

    if (startRound != 0) {
      if(x + dx > (canvas.width-ballRadius) || (x + dx) < ballRadius) {
        dx *= -1.05;
      }
      if((y + dy) < ballRadius) {
        dy *= -1.05;
      }
      x += dx;
      y += dy;

      if(y + dy > canvas.height-(ballRadius)) {

        // randX = Math.floor(Math.random() * (rightBorder - leftBorder + 1)) + leftBorder;
        // randY = Math.floor(Math.random() * (topBorder - bottomBorder + 1)) + bottomBorder;
        // powerUpBall.x = randX;
        // powerUpBall.y = randY;

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

        newBricks = [];
        // powerBalls = [];
        startRound = 0;
        // ballLevel += 1;
      }
    }

    if (rightPressed && startRound === 0) {
      if (lineX < canvas.width) {
        if (lineY === 0) {
          lineX += 15
        }
        else{
          lineY -= 15
        }
      }
      else {
        lineY += 15;
      }

      dx = (lineX - x)/(y - lineY) * speedScale;
      dy = -1 * speedScale;
    }

    else if (leftPressed && startRound === 0) {
      if (lineX > 0) {
        if (lineY != 0) {
          lineY -= 15
        }
        else {
          lineX -= 15
        }
      }
      else {
        lineY += 15
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
