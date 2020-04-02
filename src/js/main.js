"use strict";

console.log("loading main...");

import { Game } from "./game.js"

// start the game when page is loaded
window.onload = function() {
    // create game
    var game = new Game();

    // load
    game.load( () => {
        // setup/play
        game.setup();
        game.play();
    });
    window.Game = game;
}
