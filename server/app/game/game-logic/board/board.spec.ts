/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Board, MULTIPLICATORS, MultiType } from '@app/game/game-logic/board/board';
import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { ASCII_CODE, BOARD_DIMENSION } from '@app/game/game-logic/constants';
import { isCharUpperCase } from '@app/game/game-logic/utils';
import { expect } from 'chai';

class MockLetterCreator extends LetterCreator {
    static readonly gameLettersValue = LetterCreator.gameLettersValue;
    indexRectifier = 'A'.charCodeAt(0);

    createLetter(char: string): Letter {
        if (isCharUpperCase(char)) {
            return {
                char: char.toUpperCase(),
                value: 0,
            };
        }
        char = char.toUpperCase();
        return {
            char,
            value: LetterCreator.gameLettersValue[char.charCodeAt(0) - this.indexRectifier],
        };
    }
}

describe('Board', () => {
    const randomBonus = false;
    const letterCreator = new MockLetterCreator();
    const board: Board = new Board(randomBonus);

    it('Board size', () => {
        expect(board.grid.length).to.be.equal(BOARD_DIMENSION);
        board.grid.forEach((row) => {
            expect(row.length).to.be.equal(BOARD_DIMENSION);
        });
    });

    it('Board default value at right place', () => {
        MULTIPLICATORS.forEach((elem) => {
            if (elem.type === MultiType.Letter) {
                expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].letterMultiplicator).to.be.equal(elem.v);
            } else {
                expect(board.grid[elem.x - 1][elem.y.charCodeAt(0) - ASCII_CODE].wordMultiplicator).to.be.equal(elem.v);
            }
        });
    });

    it('should x + 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(4, 5);
        expect(board.hasNeighbour(4, 5)).to.be.equal(true);
    });

    it('should x - 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(6, 5);
        expect(board.hasNeighbour(4, 5)).to.be.equal(true);
    });

    it('should y + 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(5, 4);
        expect(board.hasNeighbour(4, 5)).to.be.equal(true);
    });

    it('should y - 1 hasNeighbour', () => {
        board.grid[5][5].letterObject = letterCreator.createLetter('A');
        board.hasNeighbour(4, 6);
        expect(board.hasNeighbour(4, 5)).to.be.equal(true);
    });

    it('position should have random tile multiplicator', () => {
        const randomBoard = new Board(true);
        expect(randomBoard).not.to.deep.equal(board);
    });
});
