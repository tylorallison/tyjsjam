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
    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.grid = new Array(width*height);
    }

    static fromObj(obj) {
        var layer = new Layer(obj["name"], obj["width"], obj["height"])
        layer.grid = obj["grid"];
        return layer;
    }

    get(x, y) {
        x = Mathf.clampInt(x, 0, this.width);
        y = Mathf.clampInt(y, 0, this.height);
        let index = x % this.width + this.width * y;
        return this.grid[index];
    }

    set(x, y, v) {
        x = Mathf.clampInt(x, 0, this.width);
        y = Mathf.clampInt(y, 0, this.height);
        let index = x % this.width + this.width * y;
        this.grid[index] = v;
    }

    // walk expects a fcn that expects x,y,v as params, as it will be called on each tile in the zone
    walk(fcn) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                fcn(x, y, this.get(x,y))
            }
        }
    }

}

// =========================================================================
class Zone {
    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.layers = {};
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

export { Zones };