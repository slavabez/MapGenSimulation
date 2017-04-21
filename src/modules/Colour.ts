/**
 * Created by slava on 19/04/2017.
 */

export interface Colour {
    name: string;
    hex: string;
    rgb: string;
    r: number;
    g: number;
    b: number;
}

export class ColourHelper {


    static getRandomColour(): Colour{
        let number = ColourHelper.getAllColours().length;
        return ColourHelper.getAllColours()[Math.floor(Math.random()*number)];
    }

    static getColourByName(name: string){
        const allColours = ColourHelper.getAllColours();

        let colour: Colour;

        for (let c of allColours){
            if (c.name == name){
                colour =  c;
            } else {
                // Return white if colour not found
                return {
                    name: 'white',
                    hex: '#ffffff',
                    rgb: '255,255,255',
                    r: 255,
                    g: 255,
                    b: 255
                };
            }
        }

        return colour;
    }

    static getAllColours(): Array<Colour> {
        return [
            {
                name: 'red',
                hex: '#ff0000',
                rgb: '255,0,0',
                r: 255,
                g: 0,
                b: 0
            },
            {
                name: 'orange',
                hex: '#ff7d04',
                rgb: '255,125,4',
                r: 255,
                g: 125,
                b: 4
            },
            {
                name: 'blue',
                hex: '#0e03ff',
                rgb: '14,3,255',
                r: 14,
                g: 3,
                b: 255
            },
            {
                name: 'yellow',
                hex: '#fffb05',
                rgb: '255,255,5',
                r: 255,
                g: 255,
                b: 5
            }
        ];
    }

}