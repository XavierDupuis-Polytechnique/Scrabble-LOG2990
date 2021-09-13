export class Letter {
    letter: string = ' ';
    value: number = 0;

    constructor(l?: string, v?: number) {
        if (l !== undefined && v !== undefined) {
            this.letter = l;
            this.value = v;
        }
    }
}
