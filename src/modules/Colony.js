/**
 * Created by slava on 17/04/17.
 */


import CanvasHelper from "./CanvasHelper";


export default class Colony {

    constructor(originX, originY){
        this.colour = CanvasHelper.getRandomColonyColour();
        this.originX = originX;
        this.originY = originY;

        this.age = 1;

        this.occupiedTiles = [];
    }
}