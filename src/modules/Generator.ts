/**
 * Created by slava on 16/04/17.
 */

import MathsHelper from './MathsHelper';
import Noise from './Noise';


export default class Generator {

    /**
     *
     * @param width
     * @param height
     * @param seed
     * @param scale
     * @param octaves
     * @param persistence
     * @param lacunarity
     * @returns {Array<Array<number>>}
     */
    static createPerlinNoiseMatrix (
        width: number,
        height: number,
        seed: number = 3175,
        scale: number,
        octaves: number,
        persistence: number,
        lacunarity: number
    ): Array<Array<number>> {

        let noise = new Noise(seed);
        // let noise = new Noise(seed);

        let array: Array<Array<number>> = [];

        let maxNoiseHeight = Number.MIN_VALUE;
        let minNoiseHeight = Number.MAX_VALUE;

        for (let h = 0; h < height; h++) {
            array[h] = [];
            for (let w = 0; w < width; w++) {
                array[h][w] = 1;

                let amplitude = 1;
                let frequency = 1;
                let noiseHeight = 0;

                for (let o = 0; o < octaves; o++) {
                    let sampleX = h / scale * frequency;
                    let sampleY = w / scale * frequency;
                    let perlinValue = noise.perlin2(sampleX, sampleY);

                    noiseHeight += perlinValue * amplitude;
                    amplitude *= persistence;
                    frequency *= lacunarity;

                    array[h][w] = noiseHeight;

                    if (noiseHeight > maxNoiseHeight) {
                        maxNoiseHeight = noiseHeight;
                    } else if (noiseHeight < minNoiseHeight) {
                        minNoiseHeight = noiseHeight;
                    }
                }
            }
        }

        return array;
    }

    /**
     * Creates a falloff map for the map dimensions given. Uses the evaluateFalloff method from MathsHelper
     * @param width
     * @param height
     * @returns {Array<Array<number>>}
     */
    static createFalloffMap(width: number, height: number): Array<Array<number>> {
        let falloffMap: Array<Array<number>> = [];

        for (let h = 0; h < height; h++) {
            falloffMap[h] = [];
            for (let w = 0; w < width; w++) {

                let x = h / height * 2 - 1;
                let y = w / width * 2 - 1;

                let mapValue = Math.max(Math.abs(x), Math.abs(y));
                falloffMap[h][w] = MathsHelper.evaluateFalloff(mapValue);
            }
        }

        return falloffMap;
    }
}