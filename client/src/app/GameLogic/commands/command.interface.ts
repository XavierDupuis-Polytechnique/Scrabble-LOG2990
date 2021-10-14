export interface Command {
    from: string;
    type: CommandType;
    args?: string[];
}

export enum CommandType {
    Debug = '!debug',
    Help = '!aide',
    Place = '!placer',
    Exchange = '!échanger',
    Pass = '!passer',
    Reserve = '!réserve',
}
