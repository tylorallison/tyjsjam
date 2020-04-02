"use strict";

import { Mathf } from "./math.js"


class Player {
    constructor(sprite, x, y, speed) {
        // move speed in pixels per second
        this.sprite = sprite
        this.speed = speed;
        this.width = sprite.width;
        this.height = sprite.height;
        this.x = x;
        this.y = y;
    }

    // update player
    // - controller is Controller class
    // - bounds is current zone bounds, expected to have width/height properties
    update(controller, step, bounds) {
        // parameter step is the time between frames ( in seconds )
        // check controls and move the player accordingly
        if (controller.left) this.x -= this.speed * step;
        if (controller.up) this.y -= this.speed * step;
        if (controller.right) this.x += this.speed * step;
        if (controller.down) this.y += this.speed * step;

        // don't let player leaves the world's boundary
        var minX = this.width/2;
        var minY = this.height/2;
        var maxX = bounds.width - this.width/2;
        var maxY = bounds.height - this.height/2;
        this.x = Mathf.clamp(this.x, minX, maxX);
        this.y = Mathf.clamp(this.y, minY, maxY);
    }

    draw(ctx) {
        ctx.drawImage(this.sprite.img, this.x, this.y);
    }
}

export { Player };