"use strict";

// =========================================================================
// handy math fcns

class Mathf {
    static clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }

    static clampInt(val, min, max) {
        val = parseInt(val);
        return val > max ? max : val < min ? min : val;
    }

    static floorInt(val, base) {
        return parseInt(val/base);
    }

}

export { Mathf };