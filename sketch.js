//Create variables here
var dog, happyDog;
var dogImage, happyDogImage;
var database;
var foodS, foodStock;

var fedTime, lastFed;
var feed, addFood;
var foodObj;
var gameState, readState;

var sadDog, bedroom, garden, washroom;

function preload()
{
  //load images here
  dogImage = loadImage("Dog.png");
  happyDog = loadImage("virtual pet images/happy dog.png");
  garden = loadImage("virtual pet images/Garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  sadDog = loadImage("virtual pet images/Dog.png");

}

function setup() 
{
  createCanvas(400, 500);

  database = firebase.database();
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });
  
  //read game state from database
  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });
   
  dog = createSprite(200, 400, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;
  
  feed = createButton("Feed the dog");
  feed.position(400, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(500, 95);
  addFood.mousePressed(addFoods);
}

function draw() 
{
  currentTime = hour();

  if(currentTime == (lastFed + 1)){
      update("Playing");
      foodObj.garden();
  }
  else if(currentTime == (lastFed + 2)){
      update("Sleeping");
      foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
      update("Bathing");
      foodObj.washroom();
  }
  else{
    update("Hungry")
    foodObj.display();
  }
   
  if(gameState != "Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
  }
  else{
      feed.show();
      addFood.show();
      dog.addImage(sadDog);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
    gameState: "Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState: state
  })
}