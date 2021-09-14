import { Tile } from './tile';

describe('Tile class', () => {
    it('default constructor', () => {
        const t = new Tile();
        expect(t.letterMultiplicator).toBe(1);
        expect(t.wordMultiplicator).toBe(1);
    });

    it('letter multiplicator constructor', () => {
        const t = new Tile(2);
        expect(t.letterMultiplicator).toBe(2);
        expect(t.wordMultiplicator).toBe(1);
    });

    it('word multiplicator constructor', () => {
        const t = new Tile(1, 2);
        expect(t.letterMultiplicator).toBe(1);
        expect(t.wordMultiplicator).toBe(2);
    });
});
