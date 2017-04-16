/**
 * Created by slava on 16/04/17.
 */

import TileTypes from './TileTypes';


export default class Tile {

    constructor(x, y, type, altitude) {
        this.xCor = x;
        this.yCor = y;
        this.type = type;
        this.altitude = altitude;
    }

    // TODO: There's got to be a better way of doing this
    static getTypeByAltitude(altitude) {
        let type;
        let found = false;
        Object.keys(TileTypes).forEach( key => {
            if (altitude <= TileTypes[key].maxAltitude && !found) {
                type = TileTypes[key];
                found = true;
            }
        });

        if (type) {
            return type;
        } else {
            return null;
        }
    }
}


