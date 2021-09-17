export interface Command {
    type: CommandType;
    args?: string[]; // dans le cas de debug, le args est optionnel
}
// Peut etre ajouter un type 'undefined' pour pouvoir creer une commande qui n'est pas defini
export enum CommandType {
    Debug = '!debug',
    Help = '!aide',
    Place = '!placer',
    Exchange = '!échanger',
    Pass = '!passer',
}
