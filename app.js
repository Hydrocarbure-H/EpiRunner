var hero;
var run_animation;
var jump_animation;
var game_bg;
var platform_bg;
var game_fonts;
var game_music;
var game_over_music;
var gameOver = false;
var platformsGroup;
var currentPlatformLocation;
var gravity;
var jumpPower = 15;
var heroSpeed = 15;
var currentBackgroundTilePosition;
var backgroundTiles;
var playerScore = 0;
var jump_music;
var music_title;

// Thanks to IT Girls Code for the Game Renderer. Inspired from https://codepen.io/KeishaSPerkins/pen/oBKapy.

function preload() 
{
    jump_animation = loadAnimation(
        'https://epinotes.fr/public/apps/EpiRunner/images/hero/hero/on.png'
    );
    run_animation = loadAnimation(
        'https://epinotes.fr/public/apps/EpiRunner/images/hero/hero/off.png'
    );
    game_bg = loadImage('https://epinotes.fr/public/apps/EpiRunner/images/bg.jpg');
    platform_bg = loadImage('https://epinotes.fr/public/apps/EpiRunner/images/platform.png');
    game_fonts = loadFont('https://epinotes.fr/public/apps/EpiRunner/fonts/police6_moyen.ttf');
    game_music = loadSound(get_music(randomIntFromInterval(0, 4)));
    game_over_music = loadSound('https://epinotes.fr/public/apps/EpiRunner/music/music_gameover.mp3');
    jump_music = loadSound('https://epinotes.fr/public/apps/EpiRunner/music/jump.mp3');
    woohoo_music = loadSound('https://epinotes.fr/public/apps/EpiRunner/music/music_woohoo.mp3');
}

function setup() 
{
    var instructions = createP('Utilisez <strong>les flèches</strong> ou <strong>la souris</strong> pour <strong>sauter</strong> !');
    instructions.addClass('instructions');
    createCanvas(940, 450);
    hero = createSprite(50, 100, 25, 40);
    hero.depth = 4;
    hero.addAnimation('jump', jump_animation);
    hero.addAnimation('run', run_animation);
    hero.setCollider("rectangle", 0, 0, 10, 41);
    platformsGroup = new Group();
    gravity = 1;
    currentPlatformLocation = -width;
    currentBackgroundTilePosition = -width;
    backgroundTiles = new Group();
    game_music.play();

}

function draw() 
{
    if (!gameOver) {
        hero.velocity.y += gravity;
        background(200);
        addNewPlatforms();
        removeOldPlatforms();
        hero.collide(platformsGroup, solidGround);
        jumpDetection();
        newStepDetection();
        heroSpeed += 0.01;
        hero.velocity.x = heroSpeed;
        camera.position.x = hero.position.x + 300;
        addNewBackgroundTiles();
        removeOldBackgroundTiles();
        fallCheck();
        drawSprites();
        updateScore();
    }

    if (gameOver) {
        updateSprites(false);
        gameOverText();
        newGame();
    }
}

function addNewPlatforms() 
{
    if (platformsGroup.length < 5) {
        var currentPlatformLength = 1132;
        var platform = createSprite((currentPlatformLocation * 1.3), random(300, 400), 1132, 336);

        currentPlatformLocation += currentPlatformLength;
        platform.addAnimation('default', platform_bg);
        platform.depth = 3;
        platformsGroup.add(platform);
    }
}

function solidGround() 
{
    hero.velocity.y = 0;
    hero.changeAnimation("run");
    jump_music.stop();
    // To force players to stay on the flour
    playerScore++;
    if (hero.touching.right) {
        hero.velocity.x = 0;
        hero.velocity.y += 30;
    }
}

function jumpDetection() 
{
    if (keyWentDown(UP_ARROW)) {
        jump_music.play();
        hero.changeAnimation("jump");
        hero.animation.rewind();
        hero.velocity.y = -jumpPower;
    }
}

function newStepDetection()
{
    if (playerScore % 100 == 0 && playerScore != 0)
    {
        woohoo_music.play();
    }
}

function touchStarted() 
{
    jump_music.play();
    hero.changeAnimation("jump");
    hero.animation.rewind();
    hero.velocity.y = -jumpPower;
    if (gameOver) {
        platformsGroup.removeSprites();
        backgroundTiles.removeSprites();
        gameOver = false;
        updateSprites(true);
        heroSpeed = 15;
        hero.position.x = 50;
        hero.position.y = 100;
        hero.velocity.x = heroSpeed;
        currentPlatformLocation = -width;
        currentBackgroundTilePosition = -width;
        playerScore = 0;
        game_over_music.stop();
        game_music.play();
    }
}

function removeOldPlatforms() 
{
    for (var i = 0; i < platformsGroup.length; i++) {
        if ((platformsGroup[i].position.x) < hero.position.x - width) {
            platformsGroup[i].remove();
        }
    }
}

function addNewBackgroundTiles() 
{
    if (backgroundTiles.length < 3) {
        currentBackgroundTilePosition += 839;
        var bgLoop = createSprite(currentBackgroundTilePosition, height / 2, 840, 390);
        bgLoop.addAnimation('bg', game_bg);
        bgLoop.depth = 1;
        backgroundTiles.add(bgLoop);
    }
}

function removeOldBackgroundTiles() 
{
    for (var i = 0; i < backgroundTiles.length; i++) {
        if ((backgroundTiles[i].position.x) < hero.position.x - width) {
            backgroundTiles[i].remove();
        }
    }
}

function fallCheck() 
{
    if (hero.position.y > height) {
        gameOver = true;
        game_music.stop();
        game_over_music.play();
    }
}

function gameOverText() 
{
    background(0, 0, 0, 10);
    fill('white');
    stroke('black');
    textAlign(CENTER);
    textFont(game_fonts);
    strokeWeight(2);
    textSize(90);
    strokeWeight(10);
    text("GAME OVER", camera.position.x, camera.position.y);

    textSize(18);
    text("Sautez pour réessayer", camera.position.x, camera.position.y + 150);
   
    textSize(20);
    text("Vous avez parcouru " + playerScore + ' mètres !', camera.position.x, camera.position.y + 50);

    textSize(12);
    text("Musique : " + music_title, camera.position.x, camera.position.y + 200);
}

function newGame() 
{
    if ((keyWentDown(UP_ARROW))) {
        platformsGroup.removeSprites();
        backgroundTiles.removeSprites();
        gameOver = false;
        updateSprites(true);
        heroSpeed = 15;
        hero.position.x = 50;
        hero.position.y = 100;
        hero.velocity.x = heroSpeed;
        currentPlatformLocation = -width;
        currentBackgroundTilePosition = -width;
        playerScore = 0;
        game_over_music.stop();
        game_music.play();
    }
}

function updateScore() 
{
    if (playerScore < 400)
    {
        fill('white');
        textFont(game_fonts);
        strokeWeight(2);
        stroke('black');
        textSize(20);
        textAlign(CENTER);
        text(playerScore + "m", camera.position.x + 350, camera.position.y + 160);
    }
    else if (playerScore > 400 && playerScore < 600)
    {
        fill('orange');
        textFont(game_fonts);
        strokeWeight(2);
        stroke('black');
        textSize(23);
        textAlign(CENTER);
        text(playerScore + "m", camera.position.x + 350, camera.position.y + 160);
    }
    else
    {
        fill('red');
        textFont(game_fonts);
        strokeWeight(2);
        stroke('black');
        textSize(27);
        textAlign(CENTER);
        text(playerScore + "m", camera.position.x + 350, camera.position.y + 160);
    }

}

function randomIntFromInterval(min, max) 
{ // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function get_music(index)
{
    var res;
    switch (index) {
        case 0:
          res = "https://epinotes.fr/public/apps/EpiRunner/music/music_gadget.mp3";
          music_title = "Inspecteur Gadget (1982)";
          break;
        case 1:
            res = "https://epinotes.fr/public/apps/EpiRunner/music/music_lyoko.mp3";
            music_title = "Code Lyoko (2003)";
            break;
        case 2:
            res = "https://epinotes.fr/public/apps/EpiRunner/music/music_jetpack.mp3";
            music_title = "Jetpack Joyride (2011)";
          break;
        default:
            res = "https://epinotes.fr/public/apps/EpiRunner/music/music_matt.mp3";
            music_title = "Electro Mix - Matteo Honiger (2024)";
            break;
      }
      return res;
}