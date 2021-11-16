import * as data from '@app/game/game-logic/validator/dictionary/dictionary.json';

export interface DictionaryDb {
    title: string;
    description: string;
    words?: string[];
    canEdit?: boolean;
}

export const DEFAULT_DICTIONARY = data as DictionaryDb;
