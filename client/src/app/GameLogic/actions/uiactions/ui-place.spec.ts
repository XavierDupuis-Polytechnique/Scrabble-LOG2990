import { User } from '@app/GameLogic/player/user';
import { UIPlace } from './ui-place';

describe('UIPlace', () => {
    it('should create an instance', () => {
        expect(new UIPlace(new User("p1"))).toBeTruthy();
    });
});
