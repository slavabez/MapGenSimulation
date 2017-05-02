/**
 * Created by slava on 16/04/17.
 */


import Tile, {TileConstructorObject} from './Tile';
import Generator from './Generator';
import CanvasHelper from "./CanvasHelper";
import MathsHelper from "./MathsHelper";
import Logger from "./Logger";
import Colony from "./Colony";
import TileType from "./TileType";
import Unit from "./Unit";


export default class CanvasMap {
    colonies: Array<Colony>;
    units: Array<Unit>;
    width: number;
    height: number;
    canvasId: string;
    tiles: Array<Array<Tile>>;
    passableMatrix: Array<Array<number>>;

    /**
     * Creates a new map with given dimensions and fills it with ocean cells
     * @param canvasId
     */
    constructor(canvasId: string) {

        // Get width and height programmatically from the canvas
        const canvasDiv: any = document.getElementById(canvasId);

        this.width = canvasDiv.width;
        this.height = canvasDiv.height;
        this.colonies = [];
        this.units = [];

        this.canvasId = canvasId;

        // Create ocean cells
        this.tiles = [];
        this.passableMatrix = [];

        for (let h = 0; h < this.height; h++) {
            this.tiles[h] = [];
            for (let w = 0; w < this.width; w++) {
                this.tiles[h][w] = Tile.createEmptyTile(w,h);
            }
        }

    }

    renderOnCanvas() {
        CanvasHelper.drawMap(this);
    }

    generatePerlinBased(seed: number, scale: number, octaves: number, persistence: number, lacunarity: number, useFalloffMap: boolean = true) {

        const perlinMatrix = Generator.createPerlinNoiseMatrix(this.width, this.height, seed, scale, octaves, persistence, lacunarity);
        let falloffMatrix: Array< Array< number >> = [];
        if (useFalloffMap){
            falloffMatrix = Generator.createFalloffMap(this.width, this.height);
        }

        for (let h = 0; h < this.height; h++) {
            this.tiles[h] = [];
            this.passableMatrix[h] = [];
            for (let w = 0; w < this.width; w++) {

                let value: number;
                if (useFalloffMap){
                    let subtracted = perlinMatrix[h][w] - falloffMatrix[h][w];
                    value = MathsHelper.clampNumber(subtracted);
                } else {
                    value = perlinMatrix[h][w];
                }

                const altitude = (value + 1) * 3500 - 2000;

                const tileType = TileType.getTileTypeByAltitude(altitude);
                const cObj: TileConstructorObject = {
                    xCor: w,
                    yCor: h,
                    hasSettlement: false,
                    colony: null,
                    type: tileType,
                    altitude: altitude,
                    units: [],
                    hasPath: false
                };
                // Confusingly, 1 is blocked, 0 is passable
                let passableValue = (tileType.passable) ? 0 : 1;

                this.tiles[h][w] = new Tile(cObj);
                this.passableMatrix[h][w] = passableValue;
            }
        }


    }

    addRandomColony(){
        // Take a random spot, check requirements, repeat until a spot is found
        let randomTile = this.getRandomPassableTile();
        const x = randomTile.xCor;
        const y = randomTile.yCor;
        randomTile.hasSettlement = true;

        randomTile.colony = Colony.createNewRandomColony(this, x, y);

        // Don't think I need this anymore
        /*CanvasHelper.drawMapPart(this, x-5, y-5, 10);*/

        Logger.logGood(`Settlement placed on X: ${x}, Y: ${y}`);

    }

    addLargeRandomSettlement(size = 9){
        let randomTile = this.getRandomPassableTile();

        const x = randomTile.xCor;
        const y = randomTile.yCor;

        // Find the middle
        const middle = Math.floor(size/2) + 1;

        const startX = x - Math.floor(size/2);
        const startY = y - Math.floor(size/2);

        for (let iy = 0; iy < size; iy ++){
            for (let ix = 0; ix < size; ix ++){
                let tile = this.tiles[startY + iy][startX + ix];
                if (tile.type.passable){
                    tile.hasSettlement = true;
                }
            }
        }

        CanvasHelper.drawMapPart(this, startX -5, startY - 5, 20);
    }

    getRandomTile(){
        const randX = Math.floor(Math.random() * this.width);
        const randY = Math.floor(Math.random() * this.height);

        return this.tiles[randY][randX];
    }

    getRandomPassableTile(){
        let tile = this.getRandomTile();
        while(!tile.type.passable || tile.hasSettlement){
            tile = this.getRandomTile();
        }
        return tile;
    }

    generatePassableMatrix(): void{
        for (let h = 0; h < this.height; h++) {
            this.passableMatrix[h] = [];
            for (let w = 0; w < this.width; w++) {
                const tileType = this.tiles[h][w].type;
                this.passableMatrix[h][w] = (tileType.passable) ? 1 : 0;
            }
        }
    }

    getPassableMatrix(): Array<Array<number>>{
        if (this.passableMatrix[this.height - 1][this.width - 1]){
            return this.passableMatrix;
        } else {
            this.generatePassableMatrix();
            return this.passableMatrix;
        }
    }


}

export enum MapDirection {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3
}