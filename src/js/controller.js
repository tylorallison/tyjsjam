"use strict";

// =========================================================================
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

// =========================================================================
// controller maps key input codes to controller directions
class Controller {
    constructor(keymap) {
        this.keys = {};
        this.keymap = keymap || {
            37: LEFT,       // <-
            38: UP,         // ^
            39: RIGHT,      // ->
            40: DOWN,       // v
        };
        window.onkeydown = this.keyDown.bind(this);
        window.onkeyup = this.keyUp.bind(this);
        this.left = false;
        this.up = false;
        this.right = false;
        this.down = false;
    }

    reset() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

    keyDown(key) {
        this.keys[key.keyCode] = true;
        this.update()
    }

    keyUp(key) {
        delete this.keys[key.keyCode];
        this.update();
    }

    pressed(dir) {
        if (dir == LEFT) {
            this.left = true;
        }
        if (dir == RIGHT) {
            this.right = true;
        }
        if (dir == UP) {
            this.up = true;
        }
        if (dir == DOWN) {
            this.down = true;
        }
    }

    update() {
        this.reset();
        for (const key in this.keymap) {
            if (this.keys[key] == true) {
                this.pressed(this.keymap[key]);
            }
        }
    }

}

export { Controller, LEFT, RIGHT, UP, DOWN };
