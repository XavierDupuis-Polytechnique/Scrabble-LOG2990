import { Player } from '../../player/player';
import { Game } from './game';

describe('Game', () => {
    it('should create an instance', () => {
        expect(new Game(new Player(), new Player())).toBeTruthy();
    });
});
