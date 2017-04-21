/**
 * Created by slava on 17/04/17.
 */


import {Colour, ColourHelper} from "./Colour";
import Tile from "./Tile";


export default class Colony {
    originX: number;
    originY: number;
    colour: Colour;
    age: number;
    occupiedTiles: Array<Tile>;

    constructor(cObject: ColonyObject){
        this.colour = cObject.colour;
        this.originX = cObject.originX;
        this.originY = cObject.originY;
        this.age = cObject.age;
        this.occupiedTiles = cObject.occupiedTiles;
    }

    static createNewRandomColony(xCor: number, yCor: number){
        let emptyTileArray: Array<Tile> = [];
        let cObj = {
            originX: xCor,
            originY: yCor,
            age: 0,
            colour: ColourHelper.getRandomColour(),
            occupiedTiles: emptyTileArray
        };
        return new Colony(cObj);
    }

    static getEmptyColony(){
        let emptyArr: Array<Tile> = [];
        return new Colony({
            originX: 0,
            originY: 0,
            colour: ColourHelper.getRandomColour(),
            age: 0,
            occupiedTiles: emptyArr
        });
    }
}

export interface ColonyObject {
    originX: number;
    originY: number;
    colour: Colour;
    age: number;
    occupiedTiles: Array<Tile>;
}
