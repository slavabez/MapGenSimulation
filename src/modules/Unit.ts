import Colony from "./Colony";
import CanvasMap from "./CanvasMap";
import * as PF from 'pathfinding';
import Tile from "./Tile";
/**
 * Created by slava on 24/04/2017.
 */

export default class Unit {

    map: CanvasMap;

    currentX: number;
    currentY: number;

    targetX: number;
    targetY: number;

    currentTile: Tile;

    currentPath: any;

    state: UnitState;
    colony: Colony | null;


    constructor(map: CanvasMap, startX: number, startY: number, colony?: Colony){

        this.currentX = startX;
        this.currentY = startY;
        this.map = map;
        if (colony){
            this.colony = colony;
        }

        this.currentTile = this.map.tiles[startY][startX];
        this.state = UnitState.STOPPED;
        // Add to map's unit list
        this.map.units.push(this);
        // Add to tile
        this.currentTile.units.push(this);

    }

    findPathTo(x: number, y: number){
        const passableMatrix = this.map.passableMatrix;
        let grid = new PF.Grid(passableMatrix);
        let finder = new PF.AStarFinder();

        console.log(grid);
        console.log(this.map);
        console.log(`Attempting to find path from X:${this.currentX} Y:${this.currentY} to X:${x} Y:${y} `);
        this.currentPath = finder.findPath(this.currentX, this.currentY, x, y, grid);
        console.log(this.currentPath);

    }

    static placeUnitRandomly(map: CanvasMap): Unit {
        let randomTile = map.getRandomPassableTile();

        return new Unit(map, randomTile.xCor, randomTile.yCor);
    }


}


export enum UnitState {
    STOPPED = 0,
    MOVING_TO_TARGET = 1
}