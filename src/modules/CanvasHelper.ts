/**
 * Created by slava on 16/04/17.
 */

import UI from './UserInterface';
import CanvasMap from "./CanvasMap";
import Tile from "./Tile";
import * as PF from 'pathfinding';

export default class CanvasHelper {

    static getCanvasContext(canvasId: string) {

        let canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        return canvas.getContext('2d');
    }

    /**
     * Convert the cells on the map to the array compatible with canvas. The array can be loaded straight into the canvas
     * @param map
     */
    static convertMapToUint8ClampedArray(map: CanvasMap) {
        const context = CanvasHelper.getCanvasContext(map.canvasId);

        // Create an empty imageData array
        let imageData = context.createImageData(map.width, map.height);

        for (let h = 0; h < map.height; h++) {
            // Row by row
            for (let w = 0; w < map.width; w++) {

                const tile = map.tiles[h][w];
                // If hasSettlement - get that hasSettlement colour
                let rgb;
                if (tile.hasPath){
                    rgb = {
                        name: 'path',
                        hex: '#ff0000',
                        rgb: '255,0,0',
                        r: 255,
                        g: 0,
                        b: 0,
                    };
                } else if (tile.hasSettlement) {
                    rgb = tile.colony.colour;
                } else if (tile.units.length > 0) {
                    rgb = {
                        name: 'units',
                        hex: '#ffffff',
                        rgb: '255,255,255',
                        r: 255,
                        g: 255,
                        b: 255,
                    };
                } else {
                    rgb = tile.type;
                }


                // Find the number of the element in the data array
                // The formula to find the position of the first value (R) is 4 * (MaxWidth * Height + Width)
                let startPosition = 4 * ( map.width * h + w );

                // Set Red
                imageData.data[startPosition] = rgb.r;
                // Set Green
                imageData.data[startPosition + 1] = rgb.g;
                // Set Blue
                imageData.data[startPosition + 2] = rgb.b;
                // 4th position is transparency
                imageData.data[startPosition + 3] = 255;
            }
        }

        return imageData;
    }

    static convertPartMapToUint8(map: CanvasMap, startX: number, startY: number, size: number) {
        const context = CanvasHelper.getCanvasContext(map.canvasId);
        // Create empty imageData array with set dimensions
        let imageData = context.createImageData(size, size);

        for (let y = 0; y < size; y++) {
            // Row by row
            for (let x = 0; x < size; x++) {

                const tile = map.tiles[startY + y][startX + x];
                // If hasSettlement - get that hasSettlement colour
                let rgb;
                if (tile.hasSettlement) {
                    rgb = tile.colony.colour;
                } else {
                    rgb = tile.type;
                }

                // Find the number of the element in the data array
                // The formula to find the position of the first value (R) is 4 * (MaxWidth * Height + Width)
                let startPosition = 4 * ( size * y + x );

                // Set Red
                imageData.data[startPosition] = rgb.r;
                // Set Green
                imageData.data[startPosition + 1] = rgb.g;
                // Set Blue
                imageData.data[startPosition + 2] = rgb.b;
                // 4th position is transparency
                imageData.data[startPosition + 3] = 255;
            }
        }

        return imageData;
    }

    static drawMap(map: CanvasMap) {

        // Get Canvas context
        const context = CanvasHelper.getCanvasContext(map.canvasId);
        // Generate the canvas array
        const mapImageData = CanvasHelper.convertMapToUint8ClampedArray(map);
        // Plug it in
        context.putImageData(mapImageData, 0, 0);
        UI.stopGenerateButtonLoading();
    }

    static drawMapPart(map: CanvasMap, startX: number, startY: number, size: number) {
        const context = CanvasHelper.getCanvasContext(map.canvasId);
        const partialMapImageData = CanvasHelper.convertPartMapToUint8(map, startX, startY, size);
        context.putImageData(partialMapImageData, startX, startY);
    }

    static testTilesAreReachable(map: CanvasMap, tile1: Tile, tile2: Tile): boolean {
        let tile1X = tile1.xCor;
        let tile1Y = tile1.yCor;

        let tile2X = tile2.xCor;
        let tile2Y = tile2.yCor;

        let matrix = map.getPassableMatrix();
        let grid = new PF.Grid(matrix);

        let finder = new PF.AStarFinder({allowDiagonal: true});

        let path = finder.findPath(tile1X, tile1Y, tile2X, tile2Y, grid);

        // If the path is not an empty array, it exists
        return path.length > 0;
    }

}