import Colony from "./Colony";
import CanvasMap from "./CanvasMap";
/**
 * Created by slava on 24/04/2017.
 */

export default class Unit {

    map: CanvasMap;

    currentX: number;
    currentY: number;

    targetX: number;
    targetY: number;

    state: UnitState;
    colony: Colony | null;


    constructor(map: CanvasMap, startX: number, startY: number, colony?: Colony){

        this.currentX = startX;
        this.currentY = startY;
        this.map = map;
        if (colony){
            this.colony = colony;
        }
        this.state = UnitState.STOPPED;

    }


}


export enum UnitState {
    STOPPED = 0,
    MOVING_TO_TARGET = 1
}