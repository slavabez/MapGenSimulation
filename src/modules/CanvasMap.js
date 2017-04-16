/**
 * Created by slava on 16/04/17.
 */


import Tile from './Tile';
import TileTypes from './TileTypes';
import Generator from './Generator';
import CanvasHelper from "./CanvasHelper";
import MathsHelper from "./MathsHelper";

export default class CanvasMap {


    /**
     * Creates a new map with given dimensions and fills it with ocean cells
     * @param canvasId
     */
    constructor(canvasId) {

        // Get width and height programmatically from the canvas
        const canvasDiv = document.getElementById(canvasId);
        const width = canvasDiv.width;
        const height = canvasDiv.height;

        if (Number.isInteger(width)) {
            this.width = width;
        } else {
            throw new Error('CanvasMap width has to be an integer');
        }

        if (Number.isInteger(height)) {
            this.height = height;
        } else {
            throw new Error('CanvasMap height has to be an integer');
        }

        this.canvasId = canvasId;


        // Create ocean cells
        this.tiles = [];

        for (let h = 0; h < this.height; h++) {
            this.tiles[h] = [];
            for (let w = 0; w < this.width; w++) {
                this.tiles[h][w] = new Tile(w, h, TileTypes.DEEP_WATER, -5000);
            }
        }

    }


    renderOnCanvas() {
        CanvasHelper.drawMap(this, this.canvasId);
    }

    generatePerlinBased(seed, scale, octaves, persistence, lacunarity, useFalloffMap = true) {

        const perlinMatrix = Generator.createPerlinNoiseMatrix(this.width, this.height, seed, scale, octaves, persistence, lacunarity);
        let falloffMatrix = [];
        if (useFalloffMap){
            falloffMatrix = Generator.createFalloffMap(this.width, this.height);
        }

        for (let h = 0; h < this.height; h++) {
            this.tiles[h] = [];
            for (let w = 0; w < this.width; w++) {

                let value;
                if (useFalloffMap){
                    let subtracted = perlinMatrix[h][w] - falloffMatrix[h][w];
                    value = MathsHelper.clampNumber(subtracted);
                } else {
                    value = perlinMatrix[h][w];
                }

                const altitude = (value + 1) * 3500 - 2000;

                const tile = new Tile(w, h, Tile.getTypeByAltitude(altitude), altitude);

                this.tiles[h][w] = tile;
            }
        }


    }


}