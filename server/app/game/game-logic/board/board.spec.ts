// /* eslint-disable @typescript-eslint/no-magic-numbers */
// // import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';

// import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
// import { Letter } from '@app/game/game-logic/board/letter.interface';
// import { ASCII_CODE, BOARD_DIMENSION } from '@app/game/game-logic/constants';
// import { isCharUpperCase } from '@app/game/game-logic/utils';
// import { Board, multiplicators, MultiType } from './board';

// class MockLetterCreator extends LetterCreator {
//     // eslint-disable-next-line @typescript-eslint/no-magic-numbers
//     static readonly gameLettersValue = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 10, 1, 2, 1, 1, 3, 8, 1, 1, 1, 1, 4, 10, 10, 10, 10, 0];
//     indexRectifier = 'A'.charCodeAt(0);

//     createLetter(char: string): Letter {
//         if (isCharUpperCase(char)) {
//             return {
//                 char: char.toUpperCase(),
//                 value: 0,
//             };
//         }
//         char = char.toUpperCase();
//         return {
//             char,
//             value: LetterCreator.gameLettersValue[char.charCodeAt(0) - this.indexRectifier],
//         };
//     }
// }
// describe('Board test', () => {
//     const randomBonus = false;
//     const letterCreator = new MockLetterCreator();
//     const board: Board = new Board(randomBonus);

//     it('Board size', () => {
//         expect(board.grid.length).toBe(BOARD_DIMENSION);
//         board.grid.forEach((row) => {
//             expect(row.length).toBe(BOARD_DIMENSION);
//         });
//     });

//     it('Board default value at right place', () => {
//         multiplicators.forEach((elem) => {
//             if (elem.type === MultiType.Letter) {
//                 expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].letterMultiplicator).toBe(elem.v);
//             } else {
//                 expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].wordMultiplicator).toBe(elem.v);
//             }
//         });
//     });

//     it('should x + 1 hasNeighbour', () => {
//         board.grid[5][5].letterObject = letterCreator.createLetter('A');
//         board.hasNeighbour(4, 5);
//         expect(board.hasNeighbour(4, 5)).toBeTruthy();
//     });

//     it('should x - 1 hasNeighbour', () => {
//         board.grid[5][5].letterObject = letterCreator.createLetter('A');
//         board.hasNeighbour(6, 5);
//         expect(board.hasNeighbour(4, 5)).toBeTruthy();
//     });

//     it('should y + 1 hasNeighbour', () => {
//         board.grid[5][5].letterObject = letterCreator.createLetter('A');
//         board.hasNeighbour(5, 4);
//         expect(board.hasNeighbour(4, 5)).toBeTruthy();
//     });

//     it('should y - 1 hasNeighbour', () => {
//         board.grid[5][5].letterObject = letterCreator.createLetter('A');
//         board.hasNeighbour(4, 6);
//         expect(board.hasNeighbour(4, 5)).toBeTruthy();
//     });

//     it('position should have random tile multiplicator', () => {
//         const randomBoard = new Board(true);
//         expect(randomBoard).not.toEqual(board);
//     });
// });
