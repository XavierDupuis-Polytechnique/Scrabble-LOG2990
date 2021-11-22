export enum BotType {
    Easy = 'Facile',
    Expert = 'Expert',
}

export interface BotInfo {
    name: string;
    type: BotType;
    canEdit: boolean;
}
