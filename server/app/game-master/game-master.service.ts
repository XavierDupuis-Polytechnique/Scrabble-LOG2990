/* eslint-disable no-unused-vars */
import { OnlineGameSettings } from '@app/game-manager/game-settings-multi.interface';
import { Service } from 'typedi';

@Service()
export class GameMaster {
    createGame(gameToken: string, gameSettings: OnlineGameSettings) {
        // Creer object GAME
    }
}
