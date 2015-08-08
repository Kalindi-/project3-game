/* Enemies our player must avoid
 * depending on parmeters given at random, it sets the direction
 * as well the position of the enemy
 */
var Enemy = function(xPosition, yPosition, direction) {
    this.x = xPosition;
    if (direction > 0.5) {
        direction = -1
    } else  if (direction <= 0.5) {
        direction = 1
    }
    //putting the enemy on the corridor
    if (yPosition === 0) {
        yPosition = 60
    } else if (yPosition === 1) {
        yPosition = 145
    } else if (yPosition === 2) {
        yPosition = 230
    } else if (yPosition === 3) {
        yPosition = 315
    }
    //set the parameters to variables of the object
    this.y = yPosition;
    this.direction = direction
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-pink-girl.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// keeps the enemies in motion, and wraps them on the screen
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += 20 * dt * this.direction;
    if (this.x > 450) {
        this.x= -50
    } else if (this.x < -50) {
        this.x = 450
    }
};

// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// making the class of player with its variables
var Player = function (){
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
};

/* the function draws and gives the player a heart when reaching the water
 * if game is won, it allows the player to navigate around the water*/
Player.prototype.update = function() {
    if (isWin === false) {
        if (this.y <  20) {
            // makes a new instance of heart
            heart = new Heart();
            heartDraw = true;
            // sets hearts coordinates to player ones
            heart.x = this.x;
            heart.y = this.y;
            //this call with a delay stops the drawing of the heart
            setTimeout(heartTime, heartImageTime)
        }

    } else if (isWin === true) {
        if (this.y <  0) {
            this.y = 438;
        } else if (this.y >  439) {
            this.y = 25;
        } else if (this.x < 0) {
            this.x = 403;
        } else if (this.x > 404) {
            this.x = 0;
        }
    }
};

//function, moves player depending on key pressed
Player.prototype.handleInput = function(key) {
    if (valueBrokenHearts < 10) {
        if (key === 'left') {
            if (this.x > -10) {
               this.x -=10;
            }
        } else if (key === 'right') {
            if (this.x < 405) {
                this.x +=10;
            }
        } else if (key === 'up') {
            if (this.y > -10) {
                this.y -=10;
            }
        } else if (key === 'down') {
            if (this.y < 440) {
                this.y +=10;
            }
        }
    }
};

// Draws the player on the screen:
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Function sets as this.sprite the heart the game needs
var Heart = function (){
    if (heartBroken === true){
        this.sprite = 'images/Heart-broken.png';
    } else {
        this.sprite = 'images/Heart.png';
    }
};

// Draws the heart on the screen:
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* function that puts player back on the first line,
 * stops hearts from being drawn, increases the round,
 * and calls the function to make new enemies*/
var heartTime = function() {
    player.y = 400;
    if (heartBroken === true) {
        valueBrokenHearts += 1;
        heartBroken = false;
        heartDraw = false;
        round += 1;
        makeNewEnemy(round);
    } else if (heartDraw === true) {
        valueHearts += 1;
        heartDraw = false;
        round += 1;
        makeNewEnemy(round);
    }
    //write game values on screen
    document.getElementById('value-hearts').innerHTML = valueHearts;
    document.getElementById('value-broken-hearts').innerHTML = valueBrokenHearts;

};


/* functions creates new enemy,
 * calls function to check if game is ended*/
var makeNewEnemy = function(round) {
    if (valueBrokenHearts < 11) {
        var round = new Enemy(Math.floor(Math.random()*(500)-50), Math.floor(Math.random()*4), Math.random());
        allEnemies.push(round);
    }
    isGameEnd();
};

/* check if game is ended, either lost or won. inform the player or the code*/
var isGameEnd = function() {
    if (valueBrokenHearts > 9) {
        document.getElementById('game-end').innerHTML = 'your heart <br>is broken';
    } else if (valueHearts > 9){
        isWin = true;
    }
};

/* function to check weather the player collided with an enemy
 * checks if the x and y values of the two are close enough,
 * if so, it sets of, to draw the broken heart
 */

function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        if (enemy.x < player.x+50 && enemy.x > player.x-50) {
            if (enemy.y < player.y+41 && enemy.y > player.y-41) {
                heart = new Heart();
                heartBroken = true;
                heartDraw = true;
                //set the heart on the spot of the player
                heart.x = player.x;
                heart.y = player.y;
                //call the end of the heart drawing after the delay
                setTimeout(heartTime, heartImageTime);
            }
        }
    });
};


// initializing game participants
var player = new Player();
// first enemy, that appears at page load
var mike = new Enemy(Math.floor(Math.random()*(500)-50), Math.floor(Math.random()*4), Math.round(Math.random()));
// one enemy for easy debugging
// var mike = new Enemy(200,315, -1);

//initializing list of enemies
var allEnemies = [mike];

//initializing some game functionalities
isWin = false; //here i do not write the var because i want it to be used in the other js files.
heartDraw = false;
var heartBroken = false;
//game values
var valueHearts = 0;
var valueBrokenHearts = 0;
// keeps count of the rounds, through which different enemies are created
var round = 0;
//amount of time that hearts get displayed
var heartImageTime = 600;



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
});
