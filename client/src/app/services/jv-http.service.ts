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
    editBot(bot: BotInfo): boolean {
        return true;
    }

    async addBot(bot: BotInfo): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.http.post(`${environment.serverUrl}/botinfo`, bot, { responseType: 'text' }).subscribe((res) => {
                console.log(res);
                resolve(true);
            });
        });
    }

    deleteBot(bot: BotInfo): boolean {
        return false;
    }

    async getDataInfo(): Promise<BotInfo[]> {
        return new Promise<BotInfo[]>((resolve) => {
            this.http.get<BotInfo[]>(`${environment.serverUrl}/botinfo`).subscribe((res) => {
                resolve(res);
            });
        });
    }
}
