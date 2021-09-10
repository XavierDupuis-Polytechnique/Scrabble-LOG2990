import { Player } from '../player/player';
import { GameManager } from './game-manager';

describe('GameManager', () => {
    it('should create an instance', () => {
        expect(new GameManager(new Player(), new Player())).toBeTruthy();
    });
});
