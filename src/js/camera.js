"use strict";

// =========================================================================
class Camera {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(x, y, width, height, worldWidth, worldHeight) {
        // current position of camera (left-top coordinate)
        this.x = x || 0;
        this.y = y || 0;
        // distance from followed object to border before camera starts move
        this.xDeadZone = width/4; // min distance to horizontal borders
        this.yDeadZone = height/4; // min distance to vertical borders
        // world dimensions
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        // viewport dimensions
        this.height = height;
        this.width = width;
        // target object that should be followed
        // - target is expected to have x,y properties as world coordinates
        this.target = null;
    }

    // METHODS -------------------------------------------------------------
    // mark target to follow
    follow(target) {
        this.target = target;
    }

    // update camera
    update() {
        // update camera position based on target
        if (this.target != null) {
            // moves camera on horizontal axis based on target object position
            if (this.target.x - this.x + this.xDeadZone > this.width) {
                this.x = this.target.x - (this.width - this.xDeadZone);
            } else if (this.target.x - this.xDeadZone < this.x) {
                this.x = this.target.x - this.xDeadZone;
            }
            // moves camera on vertical axis based on followed object position
            if (this.target.y - this.y + this.yDeadZone > this.height) {
                this.y = this.target.y - (this.height - this.yDeadZone);
            } else if (this.target.y - this.yDeadZone < this.y) {
                this.y = this.target.y - this.yDeadZone;
            }
        }

        // don't let camera leaves the world's boundary
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x+this.width > this.worldWidth) this.x = this.worldWidth - this.width;
        if (this.y+this.height > this.worldHeight) this.y = this.worldHeight - this.height;

    }
}

export { Camera };