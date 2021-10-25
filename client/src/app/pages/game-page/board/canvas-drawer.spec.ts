import { Board } from '@app/GameLogic/game/board/board';
import { CanvasDrawer } from '@app/pages/game-page/board/canvas-drawer';
describe('Canvas drawer test', () => {
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    let ctxStub;
    let canvasDrawer: CanvasDrawer;
    let board: Board;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        ctxStub = canvas.getContext('2d') as CanvasRenderingContext2D;

        canvasDrawer = new CanvasDrawer(ctxStub, CANVAS_WIDTH, CANVAS_HEIGHT);
        board = new Board();
    });

    it('default board should call fillText 152 times', () => {
        const fillTextSpy = spyOn(canvasDrawer.canvas, 'fillText');
        const numberCall = 152;
        canvasDrawer.drawGrid(board);
        expect(fillTextSpy).toHaveBeenCalledTimes(numberCall);
    });

    it('changed board should call fillText 154 times', () => {
        const fillTextSpy = spyOn(canvasDrawer.canvas, 'fillText');
        const numberCall = 154;
        board.grid[12][13].letterObject = { char: 'A', value: 2 };
        canvasDrawer.drawGrid(board);
        expect(fillTextSpy).toHaveBeenCalledTimes(numberCall);
    });

    it('default board should call fillRect 61 times for the bonus', () => {
        const fillRectSpy = spyOn(canvasDrawer.canvas, 'fillRect');
        const numberCall = 62;
        canvasDrawer.drawGrid(board);
        expect(fillRectSpy).toHaveBeenCalledTimes(numberCall);
    });

    it('canvasDrawer should have the correct width and height', () => {
        expect(canvasDrawer.width).toEqual(CANVAS_WIDTH);
        expect(canvasDrawer.height).toEqual(CANVAS_WIDTH);
    });

    it('drawGrod should change pixel on screen', () => {
        let imageData = canvasDrawer.canvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        canvasDrawer.drawGrid(board);
        imageData = canvasDrawer.canvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });
});
