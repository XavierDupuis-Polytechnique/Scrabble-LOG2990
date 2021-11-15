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
export class JvHttpService {
    constructor(private http: HttpClient) {}
    async editBot(oldBot: BotInfo, newBot: BotInfo): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.http.put(`${environment.serverUrl}/botinfo`, [oldBot, newBot], { responseType: 'text' }).subscribe((res) => {
                resolve(true);
            });
        });
    }

    async addBot(bot: BotInfo): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.http.post(`${environment.serverUrl}/botinfo`, bot, { responseType: 'text' }).subscribe((res) => {
                console.log(res);
                resolve(true);
            });
        });
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    deleteBot(bot: BotInfo) {
        return this.http.delete(`${environment.serverUrl}/botinfo/${bot.name}`, { responseType: 'text' });
    }

    async getDataInfo(): Promise<BotInfo[]> {
        return new Promise<BotInfo[]>((resolve) => {
            this.http.get<BotInfo[]>(`${environment.serverUrl}/botinfo`).subscribe((res) => {
                resolve(res);
            });
        });
    }
}
