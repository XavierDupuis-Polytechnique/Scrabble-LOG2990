import { GameLetter } from './game-letter';

describe('GameLetter', () => {
    it('should create an instance', () => {
        expect(new GameLetter('', 0)).toBeTruthy();
    });
});
