var trex, trexRunning, trex_collided;
var ground, groundImage;
var invisibleGround;
var cloud, cloudImage, cloudsGroup;
var obstacle, obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound, dieSound, checkPointSound;
var restartImg, gameOverImg;
var gameOver, restart;

function preload() {
  //you have load images, animations, sound  
  groundImage = loadImage("ground2.png");

  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("jump.mp3");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //to refer to canvas width - width
  //to refer to canvas height - height
  //create the sprite, apply the animations, scale, velocity

  ground = createSprite(width / 2, height - 50, width, 20); //1
  ground.addImage(groundImage);
  ground.velocityX = -9;
  ground.x = ground.width / 2;

  trex = createSprite(50, height - 35, 7, 7); //2
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("deadTrex", trex_collided);
  trex.scale = 0.5;
  trex.debug = true;
  trex.changeAnimation("running");
  //trex.setCollider("circle",0,0,50);

  invisibleGround = createSprite(width / 2, height - 35, width, 10); //3
  invisibleGround.visible = false;

  gameOver = createSprite(width / 2, height / 2 - 30);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  obstaclesGroup = new Group();

  cloudsGroup = new Group();
}

function draw() {
  background(150, 150, 150);

  textSize(20);
  fill("white");
  text("Score: " + score, 50, 50);

  if (gameState == PLAY) {
    gameOver.visible = false;
    restart.visible = false;

    score = score + Math.round(getFrameRate() / 85);

    if (score > 0 && score % 100 == 0) {
      checkPointSound.play();
    }

    ground.velocityX = -(4 + 3 * score / 100)

    if (ground.x < 500) {
      ground.x = ground.width / 2;
    }

    //jump the trex when space pressed
    if ((touches.length > 0 || keyDown("space")) && trex.y >= height / 2 + 300) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.9;

    spawnClouds();

    spawnObstacle();

    if (obstaclesGroup.isTouching(trex)) {
      dieSound.play();
      gameState = END;
    }
  } else if (gameState == END) {
    ground.velocityX = 0
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    trex.changeAnimation("deadTrex");
    if (mousePressedOver(restart) || touches.length > 0) {
      reset();
      touches = [];
    }
  }



  //console.log(Math.round(random(20,100)));

  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 == 0) {
    cloud = createSprite(width, 30, 5, 5);
    cloud.y = Math.round(random(10, 70));
    cloud.addImage(cloudImage);
    cloud.velocityX = -5;

    trex.depth = cloud.depth;
    trex.depth += 1;
    cloud.scale = 0.5;
    cloud.lifetime = 500;

    cloudsGroup.add(cloud);

  }
}

function spawnObstacle() {
  if (frameCount % 60 == 0) {
    obstacle = createSprite(width, height - 45, 5, 5);
    obstacle.velocityX = -(4 + 3 * score / 100);

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;

    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  score = 0;
  trex.changeAnimation("running");
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
}