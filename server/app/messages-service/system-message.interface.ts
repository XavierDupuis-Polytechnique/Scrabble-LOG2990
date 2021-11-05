export interface SystemMessage {
    content: string;
}

export interface GlobalSystemMessage extends SystemMessage {
    gameToken: string;
}

export interface IndividualSystemMessage extends GlobalSystemMessage {
    playerName: string;
}
