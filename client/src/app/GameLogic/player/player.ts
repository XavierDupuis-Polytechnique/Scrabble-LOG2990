import { Action } from '@app/GameLogic/actions/action';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Subject } from 'rxjs';

export abstract class Player {
    static defaultName = 'QWERTY';
    action$: Subject<Action> = new Subject();
    // nextAction: Action;

    points: number = 0;
    name: string = Player.defaultName;
    isActive: boolean;
    letterRack: Letter[] = [];

    constructor(name?: string) {
        if (name) {
            this.name = name;
        }
    }

    play(action: Action) {
        this.action$.next(action);
    }

    // TODO: log into message service
    displayGameLetters(): void {
        console.log(this.letterRack);
    }

    getLettersFromRack(mockLetters: Letter[]): Letter[] {
        const lettersInRack: Map<string, Letter[]> = new Map();
        for (const letter of this.letterRack) {
            const char: string = letter.char;
            const occcurences: Letter[] | undefined = lettersInRack.get(char);
            if (occcurences) {
                occcurences.push(letter);
            } else {
                lettersInRack.set(char, [letter]);
            }
        }

        const lettersFromRack = [];
        for (const mockLetter of mockLetters) {
            const mockChar = mockLetter.char;
            const lettersLeft = lettersInRack.get(mockChar);
            if (lettersLeft) {
                const letterToAdd = lettersLeft.pop();
                if (!letterToAdd) {
                    throw Error('Some letters are invalid');
                }
                lettersFromRack.push(letterToAdd);
            } else {
                throw Error('Some letters are invalid');
            }
        }
        return lettersFromRack;
    }

    removeLetterFromRack(letters: Letter[]) {
        console.log('letters to remove', letters);
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
        console.log(charIndexes);
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
            this.letterRack.splice(indexToRemove, 1);
        }
        console.log('letterRack', this.letterRack);
    }

    get isLetterRackEmpty(): boolean {
        return this.letterRack.length === 0;
    }

    get isLetterRackFull(): boolean {
        return this.letterRack.length === LetterBag.playerLetterCount;
    }
}
