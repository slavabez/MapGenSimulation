/**
 * Created by slava on 17/04/17.
 */


import {Colour, ColourHelper} from "./Colour";
import Tile from "./Tile";
import CanvasMap from "./CanvasMap";


export default class Colony {
    originX: number;
    originY: number;
    colour: Colour;
    age: number;
    occupiedTiles: Array<Tile>;
    map: CanvasMap;

    constructor(cObject: ColonyObject){
        this.colour = cObject.colour;
        this.originX = cObject.originX;
        this.originY = cObject.originY;
        this.age = cObject.age;
        this.occupiedTiles = cObject.occupiedTiles;
        this.map = cObject.map;

        this.map.colonies.push(this);
    }

    static createNewRandomColony(map: CanvasMap, xCor: number, yCor: number){
        let emptyTileArray: Array<Tile> = [];
        let cObj = {
            originX: xCor,
            originY: yCor,
            age: 0,
            colour: ColourHelper.getRandomColour(),
            occupiedTiles: emptyTileArray,
            map: map
        };
        return new Colony(cObj);
    }

    static getEmptyColony(map: CanvasMap){
        let emptyArr: Array<Tile> = [];
        return new Colony({
            originX: 0,
            originY: 0,
            colour: ColourHelper.getRandomColour(),
            age: 0,
            occupiedTiles: emptyArr,
            map: map
        });
    }
}

export interface ColonyObject {
    originX: number;
    originY: number;
    colour: Colour;
    age: number;
    occupiedTiles: Array<Tile>;
    map: CanvasMap;
}
