import * as data from 'assets/dictionary.json';

export interface DictionaryServer {
    title: string;
    description: string;
    words?: string[];
    canEdit?: boolean;
    date?: Date;
}

export const DEFAULT_DICTIONARY = data as DictionaryServer;
