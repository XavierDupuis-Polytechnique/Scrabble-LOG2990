// import * as data from 'assets/dictionary.json';

export interface DictionaryServer {
    title: string;
    description: string;
    words?: string[];
    canEdit?: boolean;
    date?: Date;
}

export interface LiveDict {
    currentUsage: number;
    dynamicWordList: Set<string>[];
}
// TODO Remove possibly dead code
// export const DEFAULT_DICTIONARY = { title: data.title, description: data.description, words: data.words  }as DictionaryServer;
