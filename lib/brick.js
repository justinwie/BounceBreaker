const Brick = function(){
  var brickRowCount = 1;
  var brickColumnCount = 6;
  var brickWidth = 60;
  var brickHeight = 30;
  var brickPadding = 2;
  var brickOffsetTop = brickHeight*1.5;
  var brickOffsetLeft = (canvas.width - ((brickWidth+(brickPadding))*brickColumnCount))/2;

  var minNewBricks = 4;
  var maxNewBricks = 6;



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
}

module.exports = Bricks;
