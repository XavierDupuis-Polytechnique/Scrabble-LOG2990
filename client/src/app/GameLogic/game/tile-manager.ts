import { Tile } from "./tile";

export class TileManager {
    static tilesLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','*']
    static tilesCount =   [ 9, 2, 2, 3, 15, 2, 2, 2, 8, 1, 1, 5, 3, 6, 6, 2, 1, 6, 6, 6, 6, 2, 1, 1, 1, 1, 2]
    static tilesValue =   [ 1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 10, 1, 2, 1, 1, 3, 8, 1, 1, 1, 1, 4, 10, 10, 10, 10, 0]
    static playerTileCount = 7;
   
    tilesBag:Tile[] = [];

    constructor(){
        for(let letterIndex = 0; letterIndex < TileManager.tilesLetters.length; letterIndex++){
            for(let count = 0; count < TileManager.tilesCount[letterIndex]; count++){
                this.tilesBag.push(new Tile(TileManager.tilesLetters[letterIndex], TileManager.tilesValue[letterIndex]))
            }
        }
        this.displayNumberTilesLeft();
    }

    displayNumberTilesLeft() {
        console.log("There are " + this.tilesBag.length + " tiles left")
    }

    drawGameTiles(): Tile[] {
        return this.drawTiles(TileManager.playerTileCount)
    }

    drawTiles(count:number=1):Tile[] {
        let drawedTiles:Tile[] = [];
        let drawedTileIndex = -1;
        for(let i = 0; i < count; i++){
            drawedTileIndex = this.getRandomInt(this.tilesBag.length);
            drawedTiles.push(this.tilesBag.splice(drawedTileIndex,1)[0]);
        }
        return drawedTiles;
    }

    getRandomInt(max:number) {
        return Math.floor(Math.random() * max);
    }

}
