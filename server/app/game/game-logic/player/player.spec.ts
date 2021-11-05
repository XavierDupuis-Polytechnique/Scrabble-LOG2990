import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Player } from '@app/game/game-logic/player/player';
import { assert, expect } from 'chai';

describe('Player', () => {
    let player: Player;

    beforeEach(() => {
        player = new Player('p1');
    });

    it('should create an instance', () => {
        expect(player).to.be.instanceof(Player);
    });

    it('should have an empty letterRack', () => {
        assert(player.isLetterRackEmpty);
    });

    it('should have a full letterRack', () => {
        const letterRack: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        player.letterRack = letterRack;
        assert(player.isLetterRackFull);
    });

    it('should throw Some letters are invalid (getLettersFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        const invalidRack: Letter[] = [
            { char: '?', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        player.letterRack = letterRack;
        const result = () => {
            player.getLettersFromRack(invalidRack);
        };
        expect(result).to.throw('Some letters are invalid');
    });

    it('should throw Some letters are invalid (getLettersFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        const invalidRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        player.letterRack = letterRack;
        const result = () => {
            player.getLettersFromRack(invalidRack);
        };

        expect(result).to.throw('Some letters are invalid');
    });

    it('should throw Some letters are invalid (removeLetterFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        const removeFromRack: Letter[] = [
            { char: '?', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        player.letterRack = letterRack;
        const result = () => {
            player.removeLetterFromRack(removeFromRack);
        };

        expect(result).to.throw('The letter you trying to remove is not in letter rack');
    });

    it('should throw Some letters are invalid (removeLetterFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        const removeFromRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        player.letterRack = letterRack;
        const result = () => {
            player.removeLetterFromRack(removeFromRack);
        };

        expect(result).to.throw('The letter you trying to remove is not in letter rack');
    });
});
