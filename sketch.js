var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var checkPointSound, dieSound, jumpSound;

var checkbox;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImage = loadImage("restart.png");
  GOImage = loadImage("gameOver.png");
  
  checkPointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  gameOver = createSprite(width/2,height-150,10,10);
  gameOver.addImage(GOImage);
  
  restart = createSprite(width/2,height-100,10,10);
  restart.addImage(restartImage);
  restart.scale = 0.5
  
  trex = createSprite(50,height-30,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,height-10,400,10);
  invisibleGround.visible = false;

  console.log(trex.height + ", " + trex.width);
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  score = 0;
  checkbox = createCheckbox("Activate Bot?");
  checkbox.position(width-150,40);

  if(!"highestScore" in localStorage){
    localStorage.setItem("highestScore",0);
  }
 
  
}


function draw() {
  background(180);

  fill("black")
  textSize(20)
  text("HS: " + localStorage.getItem("highestScore"),width-250,20);
  text("score: " + score,width-120,20);
  
  if(gameState === PLAY){

    if(frameCount % 5 === 0){
      score = score + 1;
    }

   // 1 (space   or touches) and  2 trex height
  
    if( (keyDown("space") || touches.length>0)&& trex.y >= height-100) {
      trex.velocityY = -10;
      jumpSound.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(checkbox.checked()){
      trex.setCollider("rectangle",40,0,trex.width + 50,trex.height   + 50);
    }else{
      trex.setCollider("rectangle",0,0,trex.width + 50,trex.height   + 50);
    }

    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      if(checkbox.checked()){
        trex.velocityY = -10;
        jumpSound.play(); 
      }else{
        gameState = END
        dieSound.play();
      }
    }
    ground.velocityX = -(4 + 3 * score/100);
    
    if(score % 100 === 0 && score > 0){
      checkPointSound.play();
    }
    
    gameOver.visible = false;
    restart.visible = false;
  }
  
else if(gameState === END){

  trex.velocityY = 0
  ground.velocityX = 0
  
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);
  
  trex.changeAnimation("collided",trex_collided)
 
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
  
  restart.visible = true;
  gameOver.visible = true;
   
  if(mousePressedOver(restart)){
      reset();
  }
}
  trex.collide(invisibleGround);
  drawSprites();
}

function reset(){

  gameState = PLAY 
  print("changed")
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  if(localStorage.getItem("highestScore") < score){
    localStorage.setItem("highestScore",score)
  }
  score = 0
  
  trex.changeAnimation("running",trex_running);
    
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-35,10,40);
   obstacle.velocityX = ground.velocityX;

   
    // //generate random obstacles
  var rand = Math.round(random(1,6));
  switch(rand) {
    case 1: obstacle.addImage(obstacle1);
              break;
    case 2: obstacle.addImage(obstacle2);
              break;
    case 3: obstacle.addImage(obstacle3);
              break;
    case 4: obstacle.addImage(obstacle4);
              break;
    case 5: obstacle.addImage(obstacle5);
              break;
    case 6: obstacle.addImage(obstacle6);
              break;
    default: break;
    }
   
    //assign scale and lifetime to the obstacle           
  obstacle.scale = 0.5;
  obstacle.lifetime = width/2;
   
   //adding obstacles to the group
  obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,height-100,40,10);
    cloud.y = Math.round(random(10,height-150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width/2;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}
