/**
 * Created by slava on 17/04/17.
 */


import {Colour, ColourHelper} from "./Colour";
import Tile from "./Tile";
import CanvasMap, {MapDirection} from "./CanvasMap";


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

    takeAction(){
        // Start simple, expand in a random direction if it's a passable tile

        this.spread();



    }

    spread(){
        /*
        Version A

        1. Take random tile, check that it's not 'dead end'
            a. Take random direction, check that not all 4 directions are impassable
            b. if passable - spread
            c. else - mark direction as impassable, back to a
            d. if all 4 directions are impassable - mark tile as 'dead end', go to 1

        Version B

        1. If counter not reached yet, take random tile
        2. Take random direction
        3. Try to spread
        4. If failed, increment counter
        */

        let tries = 0;
        let maxTries = 50;
        let hasSpread = false;

        while(!hasSpread && tries < maxTries){
            let randomTile = this.occupiedTiles[Math.floor(Math.random() * this.occupiedTiles.length)];
            let randomDirection: MapDirection = Math.floor(Math.random() * 4);

            let xToCheck = 0;
            let yToCheck = 0;

            switch (randomDirection){
                case MapDirection.NORTH:
                    xToCheck = randomTile.xCor;
                    yToCheck = randomTile.yCor - 1;
                    break;
                case MapDirection.EAST:
                    xToCheck = randomTile.xCor + 1;
                    yToCheck = randomTile.yCor;
                    break;
                case MapDirection.SOUTH:
                    xToCheck = randomTile.xCor;
                    yToCheck = randomTile.yCor + 1;
                    break;
                case MapDirection.WEST:
                    xToCheck = randomTile.xCor - 1;
                    yToCheck = randomTile.yCor;
                    break;
                default:
                    // Default to North
                    xToCheck = randomTile.xCor;
                    yToCheck = randomTile.yCor - 1;
            }
            let tile: Tile = this.map.tiles[yToCheck][xToCheck];
            if (!tile.hasSettlement && tile.type.passable){
                this.occupiedTiles.push(tile);
                tile.hasSettlement = true;
                tile.colony = this;
                hasSpread = true;
            }

            tries++;
        }

    }

    static createNewRandomColony(map: CanvasMap, xCor: number, yCor: number){
        let tileArray: Array<Tile> = [];
        let tile = map.tiles[yCor][xCor];
        tileArray.push(tile);
        let cObj = {
            originX: xCor,
            originY: yCor,
            age: 0,
            colour: ColourHelper.getRandomColour(),
            occupiedTiles: tileArray,
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
