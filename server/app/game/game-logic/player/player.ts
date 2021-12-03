import { Action } from '@app/game/game-logic/actions/action';
import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Subject } from 'rxjs';

export class Player {
    static defaultName = 'QWERTY';
    action$: Subject<Action> = new Subject();

    points: number = 0;
    isActive: boolean;
    letterRack: Letter[] = [];

    constructor(public name: string) {}

    play(action: Action) {
        this.action$.next(action);
    }

    getLettersFromRack(lettersToFind: Letter[]): Letter[] {
        const lettersInRack: Map<string, Letter[]> = new Map();
        for (const letter of this.letterRack) {
            const char: string = letter.char;
            const occcurences: Letter[] | undefined = lettersInRack.get(char);
            if (occcurences) {
                occcurences.push(letter);
                continue;
            }
            lettersInRack.set(char, [letter]);
        }

        const lettersFromRack = [];
        for (const letterToFind of lettersToFind) {
            const charToFind = letterToFind.char;
            const lettersLeft = lettersInRack.get(charToFind);
            if (!lettersLeft) {
                throw Error('Some letters are invalid');
            }
            const letterToAdd = lettersLeft.shift();
            if (!letterToAdd) {
                throw Error('Some letters are invalid');
            }
            lettersFromRack.push(letterToAdd);
        }
        return lettersFromRack;
    }

    removeLetterFromRack(letters: Letter[]) {
        const charIndexes: Map<string, number[]> = new Map();
        for (let rackIndex = 0; rackIndex < this.letterRack.length; rackIndex++) {
            const char = this.letterRack[rackIndex].char;
            const indexes = charIndexes.get(char);
            if (indexes) {
                indexes.push(rackIndex);
            } else {
                charIndexes.set(char, [rackIndex]);
            }
        }
        const indexesToRemove: number[] = [];
        for (const letter of letters) {
            const char = letter.char;
            const indexes = charIndexes.get(char);
            if (!indexes) {
                throw Error('The letter you trying to remove is not in letter rack');
            }
            const indexToRemove = indexes.shift();
            if (indexToRemove === undefined) {
                throw Error('The letter you trying to remove is not in letter rack');
            }
            indexesToRemove.push(indexToRemove);
        }
        indexesToRemove.sort();
        while (indexesToRemove.length) {
            this.letterRack.splice(indexesToRemove.pop() as number, 1);
        }
    }

    printLetterRack(): string {
        let letterRackString = '';
        for (const letter of this.letterRack) {
            letterRackString += letter.char + ',';
        }
        return letterRackString.slice(0, letterRackString.length - 1);
    }

    get isLetterRackEmpty(): boolean {
        return this.letterRack.length === 0;
    }

    get isLetterRackFull(): boolean {
        return this.letterRack.length === LetterBag.playerLetterCount;
    }
}
