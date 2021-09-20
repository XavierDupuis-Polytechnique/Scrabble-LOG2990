export class PossibleWord {
    word: string;
    indexFound: number;
    emptyCount: number;

    constructor(word: string, indexFound?: number, emptyCount?: number) {
        this.word = word;
        this.indexFound = indexFound || 0;
        this.emptyCount = emptyCount || 0;
    }
}
