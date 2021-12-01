import { Direction } from '@app/game-logic/direction.enum';
import { Board } from '@app/game-logic/game/board/board';
import { CanvasDrawer } from '@app/pages/game-page/board/canvas-drawer';
describe('Canvas drawer test', () => {
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    const FONT_SIZE = 20;
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

        canvasDrawer.drawGrid(board, FONT_SIZE);
        expect(fillTextSpy).toHaveBeenCalledTimes(numberCall);
    });

    it('changed board should call fillText 154 times', () => {
        const fillTextSpy = spyOn(canvasDrawer.canvas, 'fillText');
        const numberCall = 154;
        board.grid[12][13].letterObject = { char: 'A', value: 2 };
        canvasDrawer.drawGrid(board, FONT_SIZE);
        expect(fillTextSpy).toHaveBeenCalledTimes(numberCall);
    });

    it('default board should call fillRect 61 times for the bonus', () => {
        const fillRectSpy = spyOn(canvasDrawer.canvas, 'fillRect');
        const fillRectOtherCount = 37;
        const fillRectBonusCount = 61;
        const numberCall = fillRectBonusCount + fillRectOtherCount;
        canvasDrawer.drawGrid(board, FONT_SIZE);
        expect(fillRectSpy).toHaveBeenCalledTimes(numberCall);
    });

    it('canvasDrawer should have the correct width and height', () => {
        expect(canvasDrawer.width).toEqual(CANVAS_WIDTH);
        expect(canvasDrawer.height).toEqual(CANVAS_WIDTH);
    });

    it('drawGrid should change pixel on screen', () => {
        let imageData = canvasDrawer.canvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        canvasDrawer.drawGrid(board, FONT_SIZE);
        imageData = canvasDrawer.canvas.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it('if indicator, should call fill', () => {
        canvasDrawer.setIndicator(0, 0);
        canvasDrawer.setDirection(Direction.Horizontal);

        const drawImageSpy = spyOn(canvasDrawer.canvas, 'fill');
        canvasDrawer.drawGrid(board, FONT_SIZE);

        canvasDrawer.setDirection(Direction.Vertical);
        canvasDrawer.drawGrid(board, FONT_SIZE);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalledTimes(2);
    });

    it('if indicator is not on board, should not call fill', () => {
        board.grid[0][0].letterObject = { char: 'A', value: 2, isTemp: false };
        canvasDrawer.setIndicator(0, 0);
        canvasDrawer.setDirection(Direction.Horizontal);

        const drawImageSpy = spyOn(canvasDrawer.canvas, 'fill');
        canvasDrawer.drawGrid(board, FONT_SIZE);
        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it('if 1 temp letter is placed, should call strokeRect', () => {
        const strokeRectSpy = spyOn(canvasDrawer.canvas, 'strokeRect');
        board.grid[0][0].letterObject = { char: 'A', value: 2, isTemp: true };
        canvasDrawer.drawGrid(board, FONT_SIZE);
        expect(strokeRectSpy).toHaveBeenCalledTimes(2);
    });

    it('if 2 temp letter is placed, should call strokeRect to time', () => {
        const strokeRectSpy = spyOn(canvasDrawer.canvas, 'strokeRect');
        const strokeRectCount = 4;
        board.grid[0][0].letterObject = { char: 'A', value: 2, isTemp: true };
        board.grid[0][1].letterObject = { char: 'A', value: 2, isTemp: true };
        canvasDrawer.drawGrid(board, FONT_SIZE);
        expect(strokeRectSpy).toHaveBeenCalledTimes(strokeRectCount);
    });
});
