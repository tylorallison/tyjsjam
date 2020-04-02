"use strict";

// =========================================================================
class Tile {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(x, y, id, sprite) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.sprite = sprite;
    }

    // METHODS -------------------------------------------------------------
    draw(ctx) {
        // draw the tile
        ctx.drawImage(this.sprite.img, this.x, this.y);
    }

    toString() {
        return "[" + this.x + "," + this.y + "] id:" + this.id + " sprite:" + this.sprite;
    }

}

export { Tile };