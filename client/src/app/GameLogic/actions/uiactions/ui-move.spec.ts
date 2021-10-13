import { User } from '@app/GameLogic/player/user';
import { UIMove } from './ui-move';

describe('UIMove', () => {
    it('should create an instance', () => {
        expect(new UIMove(new User('p1'))).toBeTruthy();
    });
});
