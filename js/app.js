"use strict";
// Enemies our player must avoid
var Enemy = function(initX, initY, width, height, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = initX;
    this.y = initY;
    this.width = width; // Enemy width
    this.height = height; // Enemy height
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * 100 * dt; 
    if(this.x > characterWidth*5) { // out screen, move from start position 
        this.x = -characterWidth;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Inherited from Enemy.
var Player = function(initX, initY, width, height) {
    Enemy.call(this, initX, initY, width, height);
}; 
Player.prototype = Object.create(Enemy.prototype);
Player.constructor = Player;
/*
 * Move direction + pixels by key input.
 */
Player.prototype.handleInput = function(inputKey) {
    switch(inputKey) {
        case 'left':
            this.x -= characterWidth; 
            break;
        case 'up':
            this.y -= step; 
            break;
        case 'right':
            this.x += characterWidth; 
            break;
        case 'down':
            this.y += step; 
            break;
    }
};

/*
 * Reset position when moving out of bound.
 */
Player.prototype.reset = function() {
    if(this.y < 0) { // reach water, win, restart 
        player.toInitLoc(); 
        scoreBoard.score++;
    }
    if(this.y > 50+step*4) { // reach lower bound, keep still 
        this.y = 50+step*4; 
    }
    if(this.x < 0) { // reach left bound, keep still 
        this.x = 0; 
    }
    if(this.x > characterWidth*4) { // reach right bound, keep still 
        this.x = characterWidth*4; 
    }
};
Player.prototype.toInitLoc = function() {
    player.x = characterWidth*2; // to init pos
    player.y = 50+step*4; 
};

/* Score board, add/minus score. 
 */
var Score = function(initNum) {
    this.score = initNum;
};
Score.prototype.add = function(num) {
    this.score += num;
};
Score.prototype.minus = function(num) {
    this.score -= num;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [],
    step = 83,
    characterWidth = 101,
    characterHeight = 171;
allEnemies.push(new Enemy(200, 50, characterWidth, characterHeight, 3)); // add enemies 
allEnemies.push(new Enemy(500, 50, characterWidth, characterHeight, 2)); 
allEnemies.push(new Enemy(200, 50+step, characterWidth, characterHeight, 2)); 
allEnemies.push(new Enemy(400, 50+step, characterWidth, characterHeight, 1)); 
allEnemies.push(new Enemy(100, 50+step*2, characterWidth, characterHeight, 1)); 
allEnemies.push(new Enemy(300, 50+step*2, characterWidth, characterHeight, 2)); 
var player = new Player(202, 50+step*4, characterWidth, characterHeight); // add player
var scoreBoard = new Score(0); // add scoreboard

/*
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    player.reset();
});
*/
