
import Tile from "./Tile";
import {TileTypeEnum} from "./TileTypeEnum";
/**
 * Created by slava on 16/04/17.
 */



export default class TileType {

    id: number;
    hex: string;
    rgb: string;
    r: number;
    g: number;
    b: number;
    maxAltitude: number;
    name: string;
    passable: boolean;

    constructor(t: TileTypeObject) {
        this.id = t.id;
        this.hex = t.hex;
        this.rgb = t.rgb;
        this.r = t.r;
        this.g = t.g;
        this.b = t.b;
        this.maxAltitude = t.maxAltitude;
        this.name = t.name;
        this.passable = t.passable;

    }

    static getTypeById(id: TileTypeEnum){
        return TileType.getAllTileTypesMap().get(id);
    }


    static getAllTileTypesMap(): Map<number,TileType> {
        let allTypes = new Map();
        let all = TileType.getAllTileTypesAsArray();

        all.forEach((item) => {
            allTypes.set(item.id, item);
        });

        return allTypes;
    }

    static getAllTileTypesAsArray(): Array<TileTypeObject>{
        return [
            {
                id: TileTypeEnum.DEEP_WATER,
                hex: '#344B7F',
                rgb: '52,75,127',
                r: 52,
                g: 75,
                b: 127,
                maxAltitude: -1500,
                name: 'Deep Water',
                passable: false
            },
            {
                id: TileTypeEnum.WATER,
                hex: '#436fc7',
                rgb: '67,111,199',
                r: 67,
                g: 111,
                b: 199,
                maxAltitude: -700,
                name: 'Water',
                passable: false
            },
            {
                id: TileTypeEnum.SHALLOW_WATER,
                hex: '#4484DE',
                rgb: '68,132,222',
                r: 68,
                g: 132,
                b: 222,
                maxAltitude: 0,
                name: 'Shallow Water',
                passable: false
            },
            {
                id: TileTypeEnum.SAND,
                hex: '#CDB883',
                rgb: '205,184,131',
                r: 205,
                g: 184,
                b: 131,
                maxAltitude: 200,
                name: 'Sand',
                passable: true
            },
            {
                id: TileTypeEnum.GRASS,
                hex: '#4F6B38',
                rgb: '79,107,56',
                r: 79,
                g: 107,
                b: 56,
                maxAltitude: 1000,
                name: 'Grass',
                passable: true
            },
            {
                id: TileTypeEnum.PLAINS,
                hex: '#3F5435',
                rgb: '63,84,53',
                r: 63,
                g: 84,
                b: 53,
                maxAltitude: 2500,
                name: 'Forest / Plains',
                passable: true
            },
            {
                id: TileTypeEnum.MOUNTAIN,
                hex: '#7E7855',
                rgb: '126,120,85',
                r: 126,
                g: 120,
                b: 85,
                maxAltitude: 4000,
                name: 'Mountain',
                passable: true
            },
            {
                id: TileTypeEnum.SNOW,
                hex: '#F1F1ED',
                rgb: '241,241,237',
                r: 241,
                g: 241,
                b: 237,
                maxAltitude: 5000,
                name: 'Snow',
                passable: false
            }
        ];
    }

    static getRandomTileType(){
        let position = Math.floor(Math.random() * TileType.getAllTileTypesAsArray().length);
        return TileType.getAllTileTypesAsArray()[position];
    }


    static getTileTypeByAltitude(altitude: number): TileType {
        // Get the array of all objects, sort just in case
        let arr: Array<TileType> = TileType.getAllTileTypesAsArray();
        // Sort in ASC order
        arr.sort((a: TileTypeObject, b: TileTypeObject) => {
            return a.maxAltitude - b.maxAltitude;
        });

        for (let a of arr){
            if (altitude <= a.maxAltitude){
                return new TileType(a);
            }
        }

        return TileType.getTypeById(TileTypeEnum.DEEP_WATER);
    }

}

export interface TileTypeObject {
    id: TileTypeEnum,
    hex: string;
    rgb: string;
    r: number;
    g: number;
    b: number;
    maxAltitude: number;
    name: string;
    passable: boolean;
}

