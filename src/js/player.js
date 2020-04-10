"use strict";

import { Mathf } from "./math.js"
import { Bounds } from './bounds.js';


class Player {
    constructor(sprite, x, y, speed) {
        // move speed in pixels per second
        this.sprite = sprite
        this.speed = speed;
        this.width = sprite.width;
        this.height = sprite.height;
        this.x = x;
        this.y = y;
        // FIXME
        this.localCollider = new Bounds(5,5,sprite.width-10,sprite.height-10);
    }

    get collider() {
        return new Bounds(
            this.localCollider.minX + this.x,
            this.localCollider.minY + this.y,
            this.localCollider.width, 
            this.localCollider.height);
    }

    // update player
    // - controller is Controller class
    // - bounds is current zone bounds, expected to have width/height properties
    update(zone, controller, step, bounds) {
        // parameter step is the time between frames ( in seconds )
        // check controls and move the player accordingly
        let saveY = this.y;
        var moveX = 0;
        var moveY = 0;
        if (controller.left || controller.right) {
            //var saveX = this.x;
            if (controller.left) {
                this.x -= this.speed * step;
            } else {
                this.x += this.speed * step;
            }
            var collider = this.collider;
            var hit = zone.collider.hit(collider);
            if (hit) {
                if (controller.left) {
                    this.x = hit.maxX + (this.x-collider.minX) + 1;
                } else {
                    this.x = hit.minX - (collider.width + collider.minX-this.x) - 1;
                }
            }
        }
        if (controller.up || controller.down) {
            //var saveX = this.x;
            if (controller.up) {
                this.y -= this.speed * step;
            } else {
                this.y += this.speed * step;
            }
            var collider = this.collider;
            var hit = zone.collider.hit(collider);
            if (hit) {
                if (controller.up) {
                    //this.x = hit.maxX + (this.x-collider.minX) + 1;
                    this.y = hit.maxY + (this.y-collider.minY) + 1;
                } else {
                    //this.x = hit.minX - (collider.width + collider.minX-this.x) - 1;
                    this.y = hit.minY - (collider.height + collider.minY-this.y) - 1;
                }
            }
        }

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
        if (ctx.dbgCollider) {
            this.collider.draw(ctx);
        }
    }
}

export { Player };