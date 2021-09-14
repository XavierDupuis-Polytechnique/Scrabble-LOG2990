import { Letter } from './letter';

describe('Letter class', () => {
    it('Default constructor', () => {
        const l = new Letter();
        expect(l.letter).toBe(' ');
        expect(l.value).toBe(0);
    });

    it('Construtor with values', () => {
        const randomNumber = 10;
        const l = new Letter('A', randomNumber);
        expect(l.letter).toBe('A');
        expect(l.value).toBe(randomNumber);
    });
});
