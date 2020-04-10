"use strict";

import { Bounds } from './bounds.js';

// =========================================================================
class Tile {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(x, y, id, sprite) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.sprite = sprite;
        // FIXME
        if (id >= 17 && id <= 20) {
            this.collider = new Bounds(x,y,32,32);
        }
        if (id == 28) this.collider = new Bounds(x+22,y,10,32);
    }

    // METHODS -------------------------------------------------------------
    draw(ctx) {
        // draw the tile
        ctx.drawImage(this.sprite.img, this.x, this.y);
        if (ctx.dbgCollider && this.collider) {
            this.collider.draw(ctx);
        }
    }

    toString() {
        return "[" + this.x + "," + this.y + "] id:" + this.id + " sprite:" + this.sprite;
    }

}

export { Tile };