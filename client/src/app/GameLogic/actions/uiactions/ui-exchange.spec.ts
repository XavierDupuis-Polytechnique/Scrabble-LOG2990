import { User } from '@app/GameLogic/player/user';
import { UIExchange } from './ui-exchange';

describe('UIExchange', () => {
    it('should create an instance', () => {
        expect(new UIExchange(new User('p1'))).toBeTruthy();
    });
});
