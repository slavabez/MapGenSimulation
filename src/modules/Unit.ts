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
    progressToTarget: number;

    currentTile: Tile;

    currentPath: any;

    state: UnitState;
    colony: Colony | null;


    constructor(map: CanvasMap, startX: number, startY: number, colony?: Colony) {

        this.currentX = startX;
        this.currentY = startY;
        this.map = map;
        if (colony) {
            this.colony = colony;
        }

        this.currentTile = this.map.tiles[startY][startX];
        this.state = UnitState.STOPPED;
        this.progressToTarget = 0;
        // Add to map's unit list
        this.map.units.push(this);
        // Add to tile
        this.currentTile.units.push(this);

    }

    setTargetCoordinates(x: number, y: number) {


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

    static calculatePathFromTo(map: CanvasMap, fromX: number, fromY: number, toX: number, toY: number): Array<any> {
        let matrix = map.getPassableMatrix();
        let grid = new PF.Grid(matrix);

        let finder = new PF.AStarFinder({allowDiagonal: true});

        return finder.findPath(fromX, fromY, toX, toY, grid);
    }

    testTileAccessibility(x: number, y: number): Array<Array<number>> | boolean {
        // Try to find path, if can't - not accessible, if can - return path
        let path = Unit.calculatePathFromTo(this.map, this.currentX, this.currentY, x, y);
        if (path.length > 1) {
            return path;
        } else {
            return false;
        }

    }

    static placeUnitRandomly(map: CanvasMap): Unit {
        let randomTile = map.getRandomPassableTile();

        return new Unit(map, randomTile.xCor, randomTile.yCor);
    }

    static placeNewUnitAt(map: CanvasMap, x: number, y: number) {
        let tile = map.tiles[y][x];
        if (tile.type.passable) {
            return new Unit(map, x, y);
        } else {
            throw new Error('Tried placing a unit on an impassable tile');
        }
    }


    takeAction() {
        /*

         Take action depending on state:

         1) STOPPED - determine new action
         a) If the target path is different to current position and tile reachable - move to target
         b) remain stopped

         2) INTERRUPTED
         a) Same as stopped

         3) MOVING_TO_TARGET
         a) Double check current path exists
         b) Move along the path
         c) If reached target coordinates - stop

         4) TARGET_UNREACHABLE
         a) Spit out errors

         */

        switch (this.state) {
            // Stopped and interrupted are the same for now
            case UnitState.STOPPED:
            case UnitState.INTERRUPTED:

                if (
                    (this.currentX != this.targetX || this.currentY != this.targetY)
                    &&
                    this.canPathTo(this.targetX, this.targetY)
                ) {
                    // Not at target coordinates AND it's accessible, set moving state and call itself recursively
                    this.state = UnitState.MOVING_TO_TARGET;
                    this.takeAction();
                }
                break;

            case UnitState.MOVING_TO_TARGET:

                if (this.checkInterruptCondition()) {
                    // Interrupted, reset to interrupt, skip step
                    this.state = UnitState.INTERRUPTED;
                    break;
                }

                if (this.currentPath.length > 0) {
                    // Path already exists, follow it unless we reached destination (i.e. final step of path)
                    if (this.progressToTarget < this.currentPath.length - 1) {
                        // Keep moving

                        let nextX = this.currentPath[this.progressToTarget + 1][0];
                        let nextY = this.currentPath[this.progressToTarget + 1][1];

                        this.move(nextX, nextY);

                        this.progressToTarget++;
                    } else {
                        this.state = UnitState.STOPPED;
                        break;
                    }


                } else {
                    // Calculate path, save and start following it
                    this.currentPath = this.testTileAccessibility(this.targetX, this.targetY);

                    this.progressToTarget = 0;
                    this.takeAction();

                }

                break;

        }


    }

    move(x: number, y: number) {
        let oldX = this.currentX;
        let oldY = this.currentY;

        this.currentX = x;
        this.currentY = y;

        // mark the old passed tile as non-pathed
        let oldTile = this.map.tiles[oldY][oldX];
        oldTile.hasPath = true;
        oldTile.units = [];

        let newTile = this.map.tiles[y][x];
        newTile.units = [this];
        newTile.hasPath = false;
    }

    checkInterruptCondition(): boolean {
        return false;
    }

    recalculatePathToTarget() {
        this.currentPath = this.testTileAccessibility(this.targetX, this.targetY);
    }

    checkIfReachedTarget() {
        if (this.currentX == this.targetX && this.currentY == this.targetY) {
            // Reached
            this.state = UnitState.STOPPED;
            console.log('reached target');
        } else {
            this.state = UnitState.MOVING_TO_TARGET;
        }
    }

    markTilesAsPathed() {
        for (let i = 0; i < this.currentPath.length; i++) {
            let pathItem = this.currentPath[i];
            //this.map.tiles[pathItem[1]][pathItem[0]].hasPath = true;
        }
        this.state = UnitState.MOVING_TO_TARGET;
    }

    canPathTo(x: number, y: number): boolean {
        let path = this.testTileAccessibility(x, y);
        return !!path;
    }

}


export enum UnitState {
    STOPPED = 0,
    MOVING_TO_TARGET = 1,
    INTERRUPTED = 2,
    TARGET_UNREACHABLE = 3
}