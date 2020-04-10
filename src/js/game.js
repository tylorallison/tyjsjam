"use strict";

import { Camera } from './camera.js';
import { Zones } from './zone.js';
import { Sprites } from './sprite.js';
import { Tile } from './tile.js';
import { Player } from "./player.js"
import * as control from './controller.js';

// =========================================================================
const playerTile = 49;
const playerSpeed = 200;
const playerStartPos = {x: 50, y: 50};

// =========================================================================
class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.dbgCollider = true;
        this.then; this.camera;
        this.player;
        this.controller;
        // game settings:	
        this.FPS = 30;
        this.INTERVAL = 1000 / this.FPS; // milliseconds
        this.STEP = this.INTERVAL / 1000 // seconds
        // setup an object that represents the room
        this.tiles = [];
        this.bounds;
        this.zones = new Zones();
        this.sprites = new Sprites();
        this.zone;
    }

    load(doneCb) {
        console.log("loading...");
        var toLoad = [ this.zones, this.sprites ];
        var loadCount = 0;
        toLoad.forEach( (loader) => {
            loader.Load(() => {
                if (++loadCount >= toLoad.length) doneCb();
            })
        })
    }

    setup() {
        console.log("setting up...");
        // set initial timestamp
        this.then = Date.now();

        // current zone is starting zone
        this.zone = this.zones.startingZone;
        this.bounds = {width: this.zone.gwidth*this.sprites.spriteSize, height: this.zone.gheight*this.sprites.spriteSize};

        // setup tiles
        this.tiles = []
        this.zone.walk( (layer) => {
            layer.walk( (x,y,v) => {
                var t = new Tile(x*this.sprites.spriteSize, y*this.sprites.spriteSize, v, this.sprites.get(v));
                if (t.collider) {
                    this.zone.collider.add(t.collider);
                }
                this.tiles.push(t);
            });
        });

        // setup player
        this.player = new Player(this.sprites.get(playerTile), playerStartPos.x, playerStartPos.y, playerSpeed);

        // setup controller
        this.controller = new control.Controller();

        // Setup the camera
        // Set the right viewport size for the camera
        var viewPort = {width: Math.min(this.bounds.width, this.canvas.width), height: Math.min(this.bounds.height, this.canvas.height)};
        this.camera = new Camera(0, 0, viewPort.width, viewPort.height, this.bounds.width, this.bounds.height);
        this.camera.follow(this.player);
    }


    // Game update function
    update() {
        this.player.update(this.zone, this.controller, this.STEP, this.bounds);
        this.camera.update();
    }

    // Game draw function
    draw() {
        // clear the entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // redraw all objects
        //room.map.draw(ctx, camera.x, camera.y);
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.tiles.forEach(tile => {
            tile.draw(this.ctx);
        });
        this.player.draw(this.ctx);
        this.ctx.restore();
    }

    loop() {
        this.update();
        this.draw();
    }

    play() {
        // <-- configure play/pause capabilities:
        // Using setInterval instead of requestAnimationFrame for better cross browser support,
        // but it's easy to change to a requestAnimationFrame polyfill.
        var runningId = -1;

        if (runningId == -1) {
            runningId = setInterval(() => {
                this.loop();}, this.INTERVAL);
            console.log("play");
        }

        /*
        Game.togglePause = function() {
        if (runningId == -1) {
            Game.play();
        } else {
            clearInterval(runningId);
            runningId = -1;
            console.log("paused");
        }
        }
        */
    }

}

export { Game };