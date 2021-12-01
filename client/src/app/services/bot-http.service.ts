import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export enum BotType {
    Easy = 'Facile',
    Expert = 'Expert',
}

export interface BotInfo {
    name: string;
    type: BotType;
    canEdit: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class BotHttpService {
    constructor(private http: HttpClient) {}

    editBot(oldBot: BotInfo, newBot: BotInfo) {
        return this.http.put(`${environment.serverUrl}/botinfo`, [oldBot, newBot]);
    }

    addBot(bot: BotInfo) {
        return this.http.post(`${environment.serverUrl}/botinfo`, bot);
    }

    deleteBot(bot: BotInfo) {
        return this.http.delete(`${environment.serverUrl}/botinfo/${bot.name}`, { responseType: 'text' });
    }

    getDataInfo() {
        return this.http.get(`${environment.serverUrl}/botinfo`);
    }

    dropTable() {
        return this.http.get(`${environment.serverUrl}/botinfo/drop`);
    }
}
