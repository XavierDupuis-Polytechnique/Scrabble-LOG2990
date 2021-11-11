import { Injectable } from '@angular/core';

export interface BotInfo {
    name: string;
    type: string;
}

@Injectable({
    providedIn: 'root',
})
export class JvHttpService {
    // TODO GET HTTP request
    getEasyBotList(): BotInfo[] {
        return [{ name: 'Bernard', type: 'facile' }];
    }
    // TODO GET HTTP request
    getHardBotList(): BotInfo[] {
        return [{ name: 'Terminator', type: 'expert' }];
    }

    editBot(bot: BotInfo): boolean {
        return true;
    }

    addBot(bot: BotInfo): boolean {
        return true;
    }

    deleteBot(bot: BotInfo): boolean {
        return false;
    }
}
