import { Board } from '@app/GameLogic/game/board/board';
import { CanvasDrawer } from '@app/pages/game-page/board/canvas-drawer';
// import { defaultCanvas, defaultWithTileCanvas } from '@app/pages/game-page/board/CanvasTestImg/DefaultCanvas';
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

// import { TestBed } from '@angular/core/testing';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { GridService } from '@app/services/grid.service';

// describe('GridService', () => {
//     let service: GridService;
//     let ctxStub: CanvasRenderingContext2D;

//     const CANVAS_WIDTH = 500;
//     const CANVAS_HEIGHT = 500;

//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(GridService);
//         ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
//         service.gridContext = ctxStub;
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it(' width should return the width of the grid canvas', () => {
//         expect(service.width).toEqual(CANVAS_WIDTH);
//     });

//     it(' height should return the height of the grid canvas', () => {
//         expect(service.width).toEqual(CANVAS_HEIGHT);
//     });

//     it(' drawWord should call fillText on the canvas', () => {
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         service.drawWord('test');
//         expect(fillTextSpy).toHaveBeenCalled();
//     });

//     it(' drawWord should not call fillText if word is empty', () => {
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         service.drawWord('');
//         expect(fillTextSpy).toHaveBeenCalledTimes(0);
//     });

//     it(' drawWord should call fillText as many times as letters in a word', () => {
//         const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
//         const word = 'test';
//         service.drawWord(word);
//         expect(fillTextSpy).toHaveBeenCalledTimes(word.length);
//     });

//     it(' drawWord should color pixels on the canvas', () => {
//         let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const beforeSize = imageData.filter((x) => x !== 0).length;
//         service.drawWord('test');
//         imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const afterSize = imageData.filter((x) => x !== 0).length;
//         expect(afterSize).toBeGreaterThan(beforeSize);
//     });

//     it(' drawGrid should call moveTo and lineTo 4 times', () => {
//         const expectedCallTimes = 4;
//         const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
//         const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
//         service.drawGrid();
//         expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
//         expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
//     });

//     it(' drawGrid should color pixels on the canvas', () => {
//         let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const beforeSize = imageData.filter((x) => x !== 0).length;
//         service.drawGrid();
//         imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const afterSize = imageData.filter((x) => x !== 0).length;
//         expect(afterSize).toBeGreaterThan(beforeSize);
//     });
// });
