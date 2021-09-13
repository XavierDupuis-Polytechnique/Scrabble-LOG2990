import { Vec2 } from "@app/classes/vec2";

export const VERTICAL = true;
export const HORIZONTAL = false;

export interface ValidWord {
    word:string;
    adjacentWords:string[];
    lettersToAdd:string;
    startingTile:Vec2;
    isVertical:boolean;
    value:number;
}
