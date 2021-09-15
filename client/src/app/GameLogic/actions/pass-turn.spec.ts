import { User } from '@app/GameLogic/player/user';
import { PassTurn } from './pass-turn';

describe('PassTurn', () => {
    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });
});
