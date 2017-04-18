/**
 * Created by slava on 16/04/17.
 */

import TileTypes from './TileTypeEnum';
import Colony from './Colony';

export default class Tile {
    xCor: number;
    yCor: number;
    type: Object;
    altitude: number;
    hasSettlement: boolean;
    colony: Colony;


    constructor(x: number, y: number, type: Object, altitude: number) {
        this.xCor = x;
        this.yCor = y;
        this.type = type;
        this.altitude = altitude;
        this.hasSettlement = false;
        this.colony = null;
    }


    // TODO: There's got to be a better way of doing this
    static getTypeByAltitude(altitude: number): Object {
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


