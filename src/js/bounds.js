"use strict";

function colorRect(ctx, topLeftX, topRightY, boxWidth, boxHeight, fillColor) {  //draw rectangles
    ctx.strokeStyle = fillColor;
    ctx.debug = true;
    //ctx.fillStyle = fillColor;
    ctx.strokeRect(topLeftX, topRightY, boxWidth, boxHeight);
}

// =========================================================================
class Bounds {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(minX,minY,width,height) {
        this.minX = minX;
        this.minY = minY;
        this.width = width;
        this.height = height;
        this.maxX = minX+width;
        this.maxY = minY+height;
    }

    contains(pos) {
        return pos.x >= this.minX && pos.x <= this.maxX &&
               pos.y >= this.minY && pos.y <= this.maxY;
    }

    hit(other) {
        var xoverlap = (this.minX >= other.minX && this.minX <= other.maxX) ||
                       (this.maxX >= other.minX && this.maxX <= other.maxX) ||
                       (other.minX >= this.minX && other.minX <= this.maxX) ||
                       (other.maxX >= this.minX && other.maxX <= this.maxX);
        var yoverlap = (this.minY >= other.minY && this.minY <= other.maxY) ||
                       (this.maxY >= other.minY && this.maxY <= other.maxY) ||
                       (other.minY >= this.minY && other.minY <= this.maxY) ||
                       (other.maxY >= this.minY && other.maxY <= this.maxY);
        if (xoverlap && yoverlap) {
            var minX = Math.max(this.minX, other.minX);
            var maxX = Math.min(this.maxX, other.maxX);
            var minY = Math.max(this.minY, other.minY);
            var maxY = Math.min(this.maxY, other.maxY);
            return new Bounds(minX, minY, maxX-minX, maxY-minY);
        }
        return false;
    }

    draw(ctx) {
        colorRect(ctx, this.minX, this.minY, this.width, this.height, "red");
    }

    toString() {
        return "[" + this.minX + "," + this.minY + ":" + this.maxX + "," + this.maxY + "]";
    }
}

export { Bounds };