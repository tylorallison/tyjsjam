"use strict";

import { Mathf } from "./math.js"

// =========================================================================
const zoneFiles = [
    "src/zones/start.json",
]
const startingZone = "start";

// =========================================================================
class Zones {
    constructor() {
        this.zoneMap = {};
        this.startingZone = {};
    }

    Load(doneCb) {
        var loadCount = 0;
        zoneFiles.forEach( (path) => {
            // read json file contents
            let xhr = new XMLHttpRequest();
            xhr.onload = () => {
                var zoneObj = JSON.parse(xhr.responseText);
                var zone = Zone.fromObj(zoneObj);
                // assign zone map
                this.zoneMap[zone.name] = zone;
                // assign starting zone
                if (zone.name == startingZone) this.startingZone = zone;
                // check for completion
                if (++loadCount >= zoneFiles.length) doneCb();
            };
            xhr.open("GET", path, true);
            xhr.send();
        });
    }

    get(name) {
        return this.zoneMap[name];
    }
}

// =========================================================================
class Layer {
    constructor(name, gwidth, gheight) {
        this.name = name;
        this.gwidth = gwidth;
        this.gheight = gheight;
        this.grid = new Array(gwidth*gheight);
    }

    static fromObj(obj) {
        var layer = new Layer(obj["name"], obj["width"], obj["height"])
        layer.grid = obj["grid"];
        return layer;
    }

    get(i, j) {
        i = Mathf.clampInt(i, 0, this.gwidth);
        j = Mathf.clampInt(j, 0, this.gheight);
        let index = i % this.gwidth + this.gwidth * j;
        return this.grid[index];
    }

    set(i, j, v) {
        i = Mathf.clampInt(i, 0, this.gwidth);
        j = Mathf.clampInt(j, 0, this.gheight);
        let index = i % this.gwidth + this.gwidth * j;
        this.grid[index] = v;
    }

    // walk expects a fcn that expects i,j,v as params, as it will be called on each tile in the zone
    walk(fcn) {
        for (let j = 0; j < this.gheight; j++) {
            for (let i = 0; i < this.gwidth; i++) {
                fcn(i, j, this.get(i,j))
            }
        }
    }

}

// =========================================================================
class Zone {
    constructor(name, gwidth, gheight) {
        this.name = name;
        this.gwidth = gwidth;
        this.gheight = gheight;
        this.layers = {};
        // FIXME
        this.collider = new Collider(gwidth, gheight, 32);
    }

    // create new zone from js object (e.g.: as parsed by json)
    static fromObj(obj) {
        var zone = new Zone(obj["name"], obj["width"], obj["height"])
        var layerObjs = obj["layers"]
        layerObjs.forEach( (layerObj) => {
            var layer = Layer.fromObj(layerObj);
            zone.addLayer(layer);
        })
        return zone
    }

    getLayer(name) {
        return this.layers[name];
    }

    addLayer(layer) {
        this.layers[layer.name] = layer;
    }

    // walk expects a fcn that expects layer as param, as it will be called on each layer in the zone
    walk(fcn) {
        for (let layer of Object.values(this.layers)) {
            fcn(layer);
        }
    }

}

// =========================================================================
class Collider {
    constructor(gwidth, gheight, tileSize) {
        this.gwidth = gwidth;
        this.gheight = gheight;
        this.tileSize = tileSize;
        this.grid = new Array(gwidth*gheight);
    }

    get(i, j) {
        i = Mathf.clampInt(i, 0, this.gwidth);
        j = Mathf.clampInt(j, 0, this.gheight);
        let index = i % this.gwidth + this.gwidth * j;
        return this.grid[index];
    }

    add(collider) {
        var i = Mathf.clampInt(Mathf.floorInt(collider.minX, this.tileSize), 0, this.gwidth);
        var j = Mathf.clampInt(Mathf.floorInt(collider.minY, this.tileSize), 0, this.gheight);
        let index = i % this.gwidth + this.gwidth * j;
        if (this.grid[index]) {
            this.grid[index].push(collider);
        } else {
            this.grid[index] = [ collider ];
        }
    }

    // given other collider, lookup collider based on grid coordinates that overlap w/ bounds of other collider to determine hit
    hit(other) {
        var starti = Mathf.clampInt(Mathf.floorInt(other.minX, this.tileSize), 0, this.gwidth);
        var endi = Mathf.clampInt(Mathf.floorInt(other.maxX, this.tileSize), 0, this.gwidth);
        var startj = Mathf.clampInt(Mathf.floorInt(other.minY, this.tileSize), 0, this.gheight);
        var endj = Mathf.clampInt(Mathf.floorInt(other.maxY, this.tileSize), 0, this.gheight);
        for (var i=starti; i<=endi; i++) {
            for (var j=startj; j<=endj; j++) {
                var colliders = this.get(i,j);
                if (colliders) {
                    for (var x=0; x<colliders.length; x++) {
                        var hit = colliders[x].hit(other); 
                        if (hit) return hit;
                    }
                }
            }
        }
        return false;
    }

}

export { Zones };