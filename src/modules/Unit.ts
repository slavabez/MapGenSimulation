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

    setTargetCoordinates(x: number, y: number){


        // Check if target is accessible
        let accessible = this.testTileAccessibility(x, y);
        if (accessible) {
            console.log('accessible');
            this.targetX = x;
            this.targetY = y;
            this.state = UnitState.MOVING_TO_TARGET;
            this.currentPath = accessible;

        } else {
            this.state = UnitState.STOPPED;
            console.log('not accessible');
        }

    }

    static calculatePathFromTo(map: CanvasMap, fromX: number, fromY: number, toX: number, toY: number): Array<any>{
        let matrix = map.getPassableMatrix();
        let grid = new PF.Grid(matrix);
        let finder = new PF.AStarFinder();

        return finder.findPath(fromX, fromY, toX, toY, grid);
    }

    testTileAccessibility(x: number, y: number): Array<Array<number>> | boolean {
        // Try to find path, if can't - not accessible, if can - return path
        let path = Unit.calculatePathFromTo(this.map, this.currentX, this.currentY, x, y);
        if (path.length > 1){
            return path;
        } else {
            return false;
        }

    }

    static placeUnitRandomly(map: CanvasMap): Unit {
        let randomTile = map.getRandomPassableTile();

        return new Unit(map, randomTile.xCor, randomTile.yCor);
    }

    static placeNewUnitAt(map: CanvasMap, x: number, y: number){
        let tile = map.tiles[y][x];
        if (tile.type.passable){
            return new Unit(map, x, y);
        } else {
            throw new Error('Tried placing a unit on an impassable tile');
        }
    }


    takeAction() {
        // TODO: add method here

        // If stopped, but has a path, follow the path
        if (this.state == UnitState.STOPPED && this.currentPath.length > 0){
            /*for (let i = 0; i < this.currentPath.length; i++){
                let pathItem = this.currentPath[i];
                this.map.tiles[pathItem[1]][pathItem[0]].hasPath = true;
            }
            this.state = UnitState.MOVING_TO_TARGET;*/
        }

        if (this.state == UnitState.MOVING_TO_TARGET && this.currentPath){
            // Update path using pathfinder, move to next block
            let nextX = this.currentPath[1][0];
            let nextY = this.currentPath[1][1];


            this.move(nextX, nextY);
            this.markTilesAsPathed();
            this.checkIfReachedTarget();
            this.recalculatePathToTarget();


        }



    }

    move(x: number,y: number){
        let oldX = this.currentX;
        let oldY = this.currentY;

        this.currentX = x;
        this.currentY = y;

        console.log(`Moved from X: ${oldX} Y: ${oldY} to X: ${x}, Y:${y}`);

        // mark the old passed tile as non-pathed
        let oldTile = this.map.tiles[oldY][oldX];
        oldTile.hasPath = false;
        oldTile.units = [];

        let newTile = this.map.tiles[x][y];
        newTile.units = [this];
        newTile.hasPath = false;
    }

    recalculatePathToTarget(){
        this.currentPath = this.testTileAccessibility(this.targetX, this.targetY);
    }

    checkIfReachedTarget(){
        if (this.currentX == this.targetX && this.currentY == this.targetY){
            // Reached
            this.state = UnitState.STOPPED;
            console.log('reached target');
        } else {
            this.state = UnitState.MOVING_TO_TARGET;
        }
    }

    markTilesAsPathed(){
        for (let i = 0; i < this.currentPath.length; i++){
            let pathItem = this.currentPath[i];
            this.map.tiles[pathItem[1]][pathItem[0]].hasPath = true;
        }
        this.state = UnitState.MOVING_TO_TARGET;
    }

}


export enum UnitState {
    STOPPED = 0,
    MOVING_TO_TARGET = 1
}