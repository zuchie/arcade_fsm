Demo = {
  run: function() {
    StateMachine.create({
      target: this,
      state: 'menu',
      events: [
        { name: 'menu2Game',  from: ['menu'],           to: 'game' },
        { name: 'game2Menu', from: ['game'], to: 'menu'  },
    ]});
  },

  onbeforestartup: function() {console.log("STATE MACHINE IS STARTING UP"); },

  onmenu:         function(ctx, canvas) { 
      console.log("ENTER STATE: menu");  
  
        //document.removeEventListener('keyup', gameInput, false);

        var mouse = { // mouse position
            x: 0,
            y: 0    
        },
        playerImages = [ // players to choose from
            'images/char-boy.png',   
            'images/char-cat-girl.png',   
            'images/char-pink-girl.png', 
            'images/char-princess-girl.png'   
        ];

        var playerNo;

        function drawImgCallback(img, ctx, playerNo) {
            return function () {
                ctx.drawImage(img, playerNo * 101, 300, 101, 171);
            };
        }

        // draw players
        for (playerNo = 0; playerNo < playerImages.length; playerNo++) {
            var img = new Image();
            //ctx.drawImage(Resources.get(playerImages[playerNo]), playerNo * 101, 300, 101, 171);
            img.onload = drawImgCallback(img, ctx, playerNo); 
            img.src = playerImages[playerNo];
        }
        // display instruction
        ctx.font = "20px monospace";
        ctx.fillStyle = "navy";
        ctx.fillText("Click to choose a player", 60, 300);
        // mouse tracing
        canvas.addEventListener('mousemove', function(e){
            // pageX/Y changes with page scrolling while clientX/Y don't
            mouse.x = e.pageX - canvas.offsetLeft;
            mouse.y = e.pageY - canvas.offsetTop;
        });
        // choose a player according to mouse click coordinates. 
        canvas.addEventListener("click", choosePlayer, false);

        // Choose player according to mouse click position.
        function choosePlayer() {
            if(mouse.y > 362 && mouse.y < 442) { // player1
                if(mouse.x > 15 && mouse.x < 85) {
                    player.sprite = playerImages[0];    
                    Demo.menu2Game();
                }
                else if(mouse.x >= 118 && mouse.x < 185) { // player2
                    player.sprite = playerImages[1];    
                    Demo.menu2Game();
                }
                else if(mouse.x >= 218 && mouse.x < 285) { // player3
                    player.sprite = playerImages[2];    
                    Demo.menu2Game();
                }
                else if(mouse.x >= 315 && mouse.x < 388) { // player4
                    player.sprite = playerImages[3];    
                    Demo.menu2Game();
                }
            }
        }
  },

  ongame:        function(ctx, canvas) { 
      console.log("ENTER STATE: game"); 
  
        var fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
        // Remove start screen event handler.
        //canvas.removeEventListener("click", choosePlayer, false);
        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        window.document.addEventListener('keyup', function gameInput(e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            player.handleInput(e, allowedKeys[e.keyCode]);
            player.reset();
        });
        lastTime = Date.now();
        main(); // enter game

        function main() {
            fpsmeter.tickStart();
            /* Get our time delta information which is required if your game
             * requires smooth animation. Because everyone's computer processes
             * instructions at different speeds we need a constant value that
             * would be the same for everyone (regardless of how fast their
             * computer is) - hurray time!
             */
            var now = Date.now(),
            dt = Math.min(1, (now - lastTime) / 1000.0);

            /* Call our update/render functions, pass along the time delta to
             * our update function since it may be used for smooth animation.
             */
            update(dt);
            render();

            /* Set our lastTime variable which is used to determine the time delta
             * for the next time this function is called.
             */
            lastTime = now;
            fpsmeter.tick();

            /* Use the browser's requestAnimationFrame function to call this
             * function again as soon as the browser is able to draw another frame.
             */
            window.requestAnimationFrame(main);
        }

        function update(dt) {
            updateEntities(dt);
            checkCollisions();
        }

        /* This is called by the update function  and loops through all of the
         * objects within your allEnemies array as defined in app.js and calls
         * their update() methods. It will then call the update function for your
         * player object. These update methods should focus purely on updating
         * the data/properties related to  the object. Do your drawing in your
         * render methods.
         */
        function updateEntities(dt) {
            allEnemies.forEach(function(enemy) {
                enemy.update(dt);
            });
            //player.update(); // not use
        }

        /* This function detects collision of the enemy and player
         * and score -1 when collided.  */
        function checkCollisions() {
            allEnemies.forEach(function(enemy) {
                if(enemy.x < player.x + player.width - 30 &&
                   enemy.x + enemy.width - 30 > player.x &&
                   enemy.y < player.y + player.height - 88 &&
                   enemy.height + enemy.y - 88 > player.y) {
                    player.toInitLoc(); // to init location 
                    //scoreBoard.minus(1); // collided, decrement score
                    Demo.game2Menu();
                }
            });
        }

        /* This function draws score on canvas.
         */
        function drawScore() {
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Score: "+scoreBoard.score, 5, 70);
        } 

        /* This function initially draws the "game level", it will then call
         * the renderEntities function. Remember, this function is called every
         * game tick (or loop of the game engine) because that's how games work -
         * they are flipbooks creating the illusion of animation but in reality
         * they are just drawing the entire screen over and over.
         */
        function render() {
            /* This array holds the relative URL to the image used
             * for that particular row of the game level.
             */
            var rowImages = [
                    'images/water-block.png',   // Top row is water
                    'images/stone-block.png',   // Row 1 of 3 of stone
                    'images/stone-block.png',   // Row 2 of 3 of stone
                    'images/stone-block.png',   // Row 3 of 3 of stone
                    'images/grass-block.png',   // Row 1 of 2 of grass
                    'images/grass-block.png'    // Row 2 of 2 of grass
                ],
                numRows = 6,
                numCols = 5,
                row, col;

                function drawImgCallback(img, ctx, col, row) {
                    return function () {
                        ctx.drawImage(img, col * 101, row * 83);
                    };
                }

            /* Loop through the number of rows and columns we've defined above
             * and, using the rowImages array, draw the correct image for that
             * portion of the "grid"
             */
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /* The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to our images
                     * so that we get the benefits of caching these images, since
                     * we're using them over and over.
                     */
                    var img = new Image();
                    img.onload = drawImgCallback(img, ctx, col, row); 
                    img.src = rowImages[row];
                    //ctx.drawImage(rowImages[row], col * 101, row * 83);
                }
            }

            renderEntities();
            drawScore();
        }

        /* This function is called by the render function and is called on each game
         * tick. It's purpose is to then call the render functions you have defined
         * on your enemy and player entities within app.js
         */
        function renderEntities() {
            /* Loop through all of the objects within the allEnemies array and call
             * the render function you have defined.
             */
            allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            player.render();
        }
  },
};
