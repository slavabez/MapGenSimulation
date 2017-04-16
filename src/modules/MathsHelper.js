/**
 * Created by slava on 16/04/17.
 */


export default class MathsHelper {

    /**
     * Clamp between a max and a min number. Min and max default to the -1 to 1 range
     * @param num
     * @param min
     * @param max
     */
    static clampNumber(num, min = -1, max = 1){
        return num <= min ? min : num >= max ? max : num;
    }

    /**
     * Creates the falloff value matrix using this fancy formula that can be tweaked
     * @param value
     * @returns {number}
     */
    static evaluateFalloff(value){
        let a = 3;
        let b = 2.2;

        return Math.pow(value, a) / (Math.pow(value,a) + (Math.pow((b - b * value), a)) );
    }





}