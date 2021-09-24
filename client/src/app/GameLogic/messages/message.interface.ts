export interface Message {
    content: string;
    from: string;
    type?: MessageType;
}
export enum MessageType {
    System = 'System',
    Player1 = 'Player1',
    Player2 = 'Player2',
}
