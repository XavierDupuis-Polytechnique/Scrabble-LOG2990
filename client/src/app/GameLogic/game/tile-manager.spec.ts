import { TileManager } from './tile-manager';

describe('TileManager', () => {
    let tileManager: TileManager;

    beforeEach(() => {
        tileManager = new TileManager();
    });

    it('should create an instance with the correct number of tiles', () => {
        expect(tileManager).toBeTruthy();
        let totalNumberOfTiles = 0;
        TileManager.tilesCount.forEach((tileCount) => (totalNumberOfTiles += tileCount));
        expect(tileManager.tilesBag.length).toBe(totalNumberOfTiles);
    });

    it('should draw the number correct tiles when drawing first tiles', () => {
        const initialNumberOfTiles = tileManager.tilesBag.length;
        expect(tileManager.drawGameTiles().length).toBe(TileManager.playerTileCount);
        expect(tileManager.tilesBag.length).toBe(initialNumberOfTiles - TileManager.playerTileCount);
    });

    it('should draw the number correct tiles when drawing during the game', () => {
        const initialNumberOfTiles = tileManager.tilesBag.length;
        const numberOfTilesDrawn = tileManager.drawTiles(tileManager.getRandomInt(initialNumberOfTiles)).length;
        expect(tileManager.tilesBag.length).toBe(initialNumberOfTiles - numberOfTilesDrawn);
    });

    it('should draw the number correct tiles when drawing all the tiles during the game', () => {
        const initialNumberOfTiles = tileManager.tilesBag.length;
        const numberOfTilesDrawn = tileManager.drawTiles(tileManager.tilesBag.length).length;
        expect(tileManager.tilesBag.length).toBe(initialNumberOfTiles - numberOfTilesDrawn);
    });

    it('should return an error when no more tiles can be drawn', () => {
        const numberOfTilesToBeDrawn = tileManager.tilesBag.length + 1;
        const tilesBagError = new Error(
            'Not enough tiles in bag (' + tileManager.tilesBag.length + ') to draw ' + numberOfTilesToBeDrawn + ' tiles.',
        );
        expect(function () {
            tileManager.drawTiles(numberOfTilesToBeDrawn).length;
        }).toThrow(tilesBagError);
    });
});
