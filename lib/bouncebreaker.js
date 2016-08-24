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

  var speedScale = 7;

  var dx = (lineX - x)/(y - lineY) * speedScale;
  var dy = -1 * speedScale;

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

  var score = 0;
  var round = 1;

  let randomNum = Math.floor(Math.random() * (maxNewBricks - minNewBricks + 1)) + minNewBricks;

  let existingBricks = new Array(brickColumnCount);

  for (var i = 0; i < brickColumnCount; i++) {
    existingBricks[i] = [];
    for (var j = 0; j < brickRowCount; j++) {
      existingBricks[i][j] = { x: 0, y: 0, hit: 0 };
    }
  };

  let newBricks = [];
  function createNewBricks(){
    let randomNumBricks = Math.floor(Math.random() * (maxNewBricks - minNewBricks + 1)) + minNewBricks;
    for (var i = 0; i < randomNumBricks; i++) {
      newBricks[i] = [];
      newBricks[i][0] = { x: 0, y: 0, hit: 0 };
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
        if(existingBrick.hit === 0){
          if((y+ballRadius/2 > existingBrick.y) && (y-ballRadius/2 < (existingBrick.y+brickHeight)) && (x+ballRadius/2 > existingBrick.x) && (x-ballRadius/2 < (existingBrick.x + brickWidth))){
          // if((y > existingBrick.y) && (y < (existingBrick.y+brickHeight)) && (x > existingBrick.x) && (x < (existingBrick.x + brickWidth))){
          // if((y+ballRadius > existingBrick.y-brickHeight) && (y-ballRadius < (existingBrick.y+brickHeight)) && (x+ballRadius > existingBrick.x-brickWidth) && (x-ballRadius < (existingBrick.x + brickWidth))){
            // if (Math.random()>0) {
            //   dx = -dx;
            // }
            if (Math.random()>0.95) {
              dx *= 1.1;
            }
            dy = -dy;
            existingBrick.hit = 1;
            score++;
          }
        }
      }
    }
  }

  function checkIfLost(){
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        var brick = existingBricks[i][j];
        if(brick.hit === 0){
          if(brick.y > canvas.height-brickHeight){
            alert("GAME OVER");
            document.location.reload();
          }
        }
      }
    }
  }

  function renderBrickBounce(x,y,width,height){
    let brickDx = 0;
    let brickDy = 50;
    let lowerBoundary = y+height;


    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.fillStyle = "Blue";
    ctx.fill();
    ctx.closePath();

    // lowerBoundary += brickDy;
    if (y+height+brickDy>lowerBoundary+(brickHeight/2)) {
    // if (Math.random()>0.5) {
      // ctx.beginPath();
      // ctx.rect(x,y,width,height);
      ctx.fillStyle = "Purple";
      ctx.fill();
    }
    ctx.closePath();

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

  function createInitialBricks(){
    for(i = 0; i < existingBricks.length; i++) {
      for(j = 0; j < existingBricks[i].length; j++) {
        if(existingBricks[i][j].hit === 0){
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
        if(existingBricks[i][j].hit === 0){
          renderBrickBounce(existingBricks[i][j].x, existingBricks[i][j].y, brickWidth, brickHeight);
          // ctx.beginPath();
          // ctx.rect(existingBricks[i][j].x, existingBricks[i][j].y, brickWidth, brickHeight);
          //
          // if (existingBricks[i][j].y > 150 && existingBricks[i][j].y < 230) {
          //   ctx.fillStyle = "Orange";
          // }else if (existingBricks[i][j].y > 230) {
          //   ctx.fillStyle = "Red";
          // } else {
          //   ctx.fillStyle = "Blue";
          // }
          //
          // ctx.fill();
          // ctx.closePath();
        }
      }
    }
  }

  function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function drawRound(){
    ctx.font = "14px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Round: "+round, 8, 20);
  }

  function draw(){

    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lightgrey";
    ctx.fill();

    checkIfLost();
    // console.log('test');

    // drawBricks(randomNum, 1);
    // createInitialBricks()
    drawBricks();

    // if (round != 1) {
    //   drawNewBricks()
    // }

    drawBall();


    if (startRound === 0) {
      drawArrow();
    }

    collisionDetection();
    drawRound();

    if (startRound != 0) {
      if(x + dx > (canvas.width-ballRadius) || (x + dx) < ballRadius) {
        dx = -dx;
      }
      if((y + dy) < ballRadius) {
        dy = -dy;
      }
      x += dx;
      y += dy;

      // debugger;

      if(y + dy > canvas.height-(ballRadius)) {
        lineX = x;
        lineY = 0;

        dx = (lineX - x)/(y - lineY) * speedScale;
        dy = -1 * speedScale;

        for (var i = 0; i < existingBricks.length; i++) {
          for (var j = 0; j < existingBricks[i].length; j++) {
            existingBricks[i][j].y += (brickWidth/2+brickPadding)
          }
        };
        // debugger;


        createNewBricks()
        // debugger;

        for (var i = 0; i < newBricks.length; i++) {
          let randomCol = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
          newBricks[i][0].x = existingBricks[randomCol][0].x;
          existingBricks[randomCol].unshift(newBricks[i][0])
          // debugger;
        }

        newBricks.splice(0, newBricks.length)
        // console.log('paused');

        round++;
        startRound = 0;
        // debugger;
      }
    }

    if (rightPressed && startRound === 0) {
      if (lineX < canvas.width) {
        if (lineY === 0) {
          lineX += 20
        }
        else{
          lineY -= 20
        }
      }
      else {
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
      else {
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

// if (existingBricks[i][j].y > 150 && existingBricks[i][j].y < 230) {
//   ctx.fillStyle = "Orange";
// }else if (existingBricks[i][j].y > 230) {
//   ctx.fillStyle = "Red";
// } else {
//   ctx.fillStyle = "Blue";
// }