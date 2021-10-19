// import { Board } from '@app/GameLogic/game/board/board';
// import { CanvasDrawer } from '@app/pages/game-page/board/canvas-drawer';
// import { defaultCanvas, defaultWithTileCanvas } from '@app/pages/game-page/board/CanvasTestImg/DefaultCanvas';
// describe('Canvas drawer test', () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 500;
//     canvas.height = 500;
//     let canvasDrawer: CanvasDrawer;
//     const context = canvas.getContext('2d');
//     if (context) {
//         canvasDrawer = new CanvasDrawer(context, canvas.width, canvas.height);
//     }
//     fit('should create default canvas', () => {
//         canvasDrawer.drawGrid(new Board());
//         expect(canvas.toDataURL('image/png')).toEqual(defaultCanvas);
//     });

//     fit('should create default canvas with tile', () => {
//         const board = new Board();
//         board.grid[1][0].letterObject = { char: 'A', value: 10 };
//         canvasDrawer.drawGrid(board);
//         expect(canvas.toDataURL('image/png')).toEqual(defaultWithTileCanvas);
//     });

//     fit('should calculate font size base on tilesize', () => {
//         let fontSize = 200;
//         const answerFontSize = 19;
//         while (!canvasDrawer.checkFontSize(fontSize)) {
//             fontSize--;
//         }
//         expect(fontSize).toEqual(answerFontSize);
//     });
// });
