import { User } from '@app/GameLogic/player/user';
import { PlaceLetter } from './place-letter';

describe('PlaceLetter', () => {
    it('should create an instance', () => {
        expect(new PlaceLetter(new User('Tim'))).toBeTruthy();
    });
});
