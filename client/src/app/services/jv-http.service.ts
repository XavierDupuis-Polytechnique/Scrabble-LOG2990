import { Injectable } from '@angular/core';

export interface BotInfo {
    id: number;
    name: string;
    type: string;
    canEdit: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class JvHttpService {
    editBot(bot: BotInfo): boolean {
        return true;
    }

    addBot(bot: BotInfo): boolean {
        return true;
    }

    deleteBot(bot: BotInfo): boolean {
        return false;
    }

    getDataInfo(): BotInfo[] {
        return [
            { name: 'Bernard', type: 'facile', id: 1, canEdit: true },
            { name: 'Bernard', type: 'Expert', id: 1, canEdit: true },
            { name: 'Bernard', type: 'facile', id: 1, canEdit: true },
            { name: 'Bernard', type: 'facile', id: 1, canEdit: true },
            { name: 'Bernard', type: 'facile', id: 1, canEdit: true },
            { name: 'Bernard', type: 'facile', id: 1, canEdit: true },
            { name: 'Bernard', type: 'facile', id: 1, canEdit: true },
        ];
    }
}
