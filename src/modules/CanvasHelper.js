/**
 * Created by slava on 16/04/17.
 */

import UI from './UserInterface';

export default class CanvasHelper {

    static getCanvasContext(canvasId){
        return document.getElementById(canvasId).getContext('2d');
    }

    /**
     * Convert the cells on the map to the array compatible with canvas. The array can be loaded straight into the canvas
     * @param map
     */
    static convertMapToUint8ClampedArray(map){
        const context = CanvasHelper.getCanvasContext(map.canvasId);

        // Create an empty imageData array
        let imageData = context.createImageData(map.width, map.height);

        for (let h = 0; h < map.height; h++) {
            // Row by row
            for (let w = 0; w < map.width; w++) {

                const tileType = map.tiles[h][w].type;
                // Find the number of the element in the data array
                // The formula to find the position of the first value (R) is 4 * (MaxWidth * Height + Width)
                let startPosition = 4 * ( map.width * h + w );

                // Set Red
                imageData.data[startPosition] = tileType.r;
                // Set Green
                imageData.data[startPosition + 1] = tileType.g;
                // Set Blue
                imageData.data[startPosition + 2] = tileType.b;
                // 4th position is transparency
                imageData.data[startPosition + 3] = 255;
            }
        }

        return imageData;
    }

    static drawMap(map) {

        // Get Canvas context
        const context = CanvasHelper.getCanvasContext(map.canvasId);
        // Generate the canvas array
        const mapImageData = CanvasHelper.convertMapToUint8ClampedArray(map);
        // Plug it in
        context.putImageData(mapImageData, 0, 0);
        UI.stopGenerateButtonLoading();
    }
}