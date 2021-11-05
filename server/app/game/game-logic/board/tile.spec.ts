import { Tile } from '@app/game/game-logic/board/tile';
import { expect } from 'chai';

describe('Tile class', () => {
    it('default constructor', () => {
        const t = new Tile();
        expect(t.letterMultiplicator).to.be.equal(1);
        expect(t.wordMultiplicator).to.be.equal(1);
    });

    it('letter multiplicator constructor', () => {
        const t = new Tile(2);
        expect(t.letterMultiplicator).to.be.equal(2);
        expect(t.wordMultiplicator).to.be.equal(1);
    });

    it('word multiplicator constructor', () => {
        const t = new Tile(1, 2);
        expect(t.letterMultiplicator).to.be.equal(1);
        expect(t.wordMultiplicator).to.be.equal(2);
    });
});
