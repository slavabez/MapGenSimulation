/**
 * Created by slava on 16/04/17.
 */

import Colony from './Colony';
import TileType from "./TileType";
import {TileTypeEnum} from "./TileTypeEnum";
import Unit from "./Unit";

export default class Tile {
    xCor: number;
    yCor: number;
    type: TileType;
    altitude: number;
    hasSettlement: boolean;
    colony: Colony | null;
    units: Array<Unit>;


    constructor(c: TileConstructorObject) {
        this.xCor = c.xCor;
        this.yCor = c.yCor;
        this.type = c.type;
        this.altitude = c.altitude;
        this.hasSettlement = c.hasSettlement;
        this.colony = c.colony;
        this.units = c.units;
    }

    static createEmptyTile(x: number, y: number){
        let type = TileType.getTypeById(TileTypeEnum.DEEP_WATER);

        return new Tile({
            xCor: x,
            yCor: y,
            type: type,
            altitude: -5000,
            hasSettlement: false,
            colony: null,
            units: []
        });
    }

}


export interface TileConstructorObject {
    xCor: number;
    yCor: number;
    type: TileType;
    altitude: number;
    hasSettlement: boolean;
    colony: Colony;
    units: Array<Unit>;
}
