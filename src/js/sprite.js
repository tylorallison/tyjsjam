"use strict";

// =========================================================================
const spriteJson = "src/img/sprites.json";
const spritePath = "src/img/";
const spriteDfltSize = 32;

// =========================================================================
class Sprites {
    constructor() {
        this.spriteMap = {};
        this.spriteSize = spriteDfltSize;
    }

    Load(doneCb) {
        // read json file contents
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            var loadCount = 0;
            var rootRef = JSON.parse(xhr.responseText);
            var records = rootRef["records"];
            records.forEach(record => {
                var width = record.width || spriteDfltSize;
                var height = record.height || spriteDfltSize;
                var sprite = new TileSprite(spritePath + record.path + ".png", width, height, record.id, () => {
                    if (++loadCount >= records.length) doneCb();
                });
                this.spriteMap[record.id] = sprite;
            });
        }
        xhr.open("GET", spriteJson, true);
        xhr.send();
    }

    get(id) {
        return this.spriteMap[id];
    }

}

// =========================================================================
class Sprite {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(url, width, height, onload_cb) {
        this.width = width;
        this.height = height;
        this.img = new Image();
        if (onload_cb != null) this.img.onload = onload_cb;
        this.img.src = url;
    }
}

// =========================================================================
class TileSprite extends Sprite {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(url, width, height, id, onload_cb) {
        super(url, width, height, onload_cb);
        this.id = id;
    }
}

function loadSprites(records, defaultWidth, defaultHeight, doneCb) {
    var loadCount = 0;
    records.forEach(record => {
        var width = record.w || defaultWidth;
        var height = record.w || defaultHeight;
        var s = new TileSprite("src/img/" + record.path + ".png", width, height, record.id, () => {
            if (++loadCount >= records.length) doneCb();
        });
        spriteTiles[record.id] = s;
    });
}

function loadFromFile(filePath, dfltWidth, dfltHeight, doneCb) {
    // read json file contents
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        var rootRef = JSON.parse(xhr.responseText)
        var records = rootRef["records"]
        loadSprites(records, dfltWidth, dfltHeight, doneCb)
    };
    xhr.open("GET", filePath, true);
    xhr.send();
}


export { Sprites };