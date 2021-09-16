import { Injectable } from '@angular/core';
import { Bot } from './bot';
import { EasyBot } from './easy-bot';
import { HardBot } from './hard-bot';

@Injectable({
    providedIn: 'root',
})
export class BotService {
    createBot(playerName: string, botDifficulty: string): Bot {
        if (botDifficulty === 'hard') {
            return new HardBot(playerName);
        } else {
            return new EasyBot(playerName);
        }
    }
}
