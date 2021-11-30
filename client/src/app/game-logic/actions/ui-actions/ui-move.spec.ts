/* eslint-disable @typescript-eslint/no-magic-numbers */
import { UIAction } from '@app/game-logic/actions/ui-actions/ui-action';
import { ARROWLEFT, ARROWRIGHT, BACKSPACE, ENTER, JOKER_CHAR, RACK_LETTER_COUNT, SHIFT, SPACE } from '@app/game-logic/constants';
import { WheelRoll } from '@app/game-logic/interfaces/ui-input';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { getRandomInt } from '@app/game-logic/utils';
import { UIMove } from './ui-move';

describe('UIMove', () => {
    let player: Player;
    let action: UIAction;
    beforeEach(() => {
        player = new User('p1');
        player.letterRack = [
            { char: 'A', value: 0 },
            { char: 'B', value: 0 },
            { char: 'C', value: 0 },
            { char: JOKER_CHAR, value: 0 },
            { char: 'E', value: 0 },
            { char: 'F', value: 0 },
            { char: 'G', value: 0 },
        ];
        action = new UIMove(player);
    });

    it('should create an instance', () => {
        expect(action).toBeTruthy();
    });

    it('should return the appropriate canBeCreated boolean', () => {
        expect(action.canBeCreated).toBeFalsy();
        action.concernedIndexes.add(0);
        expect(action.canBeCreated).toBeTruthy();
        action.concernedIndexes.delete(0);
        expect(action.canBeCreated).toBeFalsy();
    });

    it('should not do anything when receiving a RightClick', () => {
        action.receiveRightClick();
        expect().nothing();
    });

    it('should update the concernedIndexes (unique) following a receiveLeftClick call', () => {
        const firstIndex = 0;
        const secondIndex = getRandomInt(RACK_LETTER_COUNT - 1, 1);
        action.receiveLeftClick(firstIndex);
        expect(action.concernedIndexes.has(firstIndex)).toBeTruthy();
        action.receiveLeftClick(firstIndex);
        expect(action.concernedIndexes.has(firstIndex)).toBeFalsy();
        action.receiveLeftClick(firstIndex);
        action.receiveLeftClick(secondIndex);
        expect(action.concernedIndexes.has(firstIndex)).toBeFalsy();
        expect(action.concernedIndexes.has(secondIndex)).toBeTruthy();
        expect(action.concernedIndexes.size).toBe(1);
    });

    it('should properly select a letter from the player LetterRack', () => {
        const index = getRandomInt(RACK_LETTER_COUNT - 1);
        action.receiveKey(player.letterRack[index].char.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(index)).toBeTruthy();
    });

    it('should properly select a letter from the player LetterRack and select, if possible, the next occurence', () => {
        const firstIndex = 0;
        const secondIndex = 3;
        const thirdIndex = 6;
        const repeatedChar = player.letterRack[firstIndex].char;
        player.letterRack[secondIndex].char = repeatedChar;
        player.letterRack[thirdIndex].char = repeatedChar;

        action.receiveKey(repeatedChar.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(firstIndex)).toBeTruthy();

        action.receiveKey(repeatedChar.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(secondIndex)).toBeTruthy();

        action.receiveKey(repeatedChar.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(thirdIndex)).toBeTruthy();

        action.receiveKey(repeatedChar.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(firstIndex)).toBeTruthy();
    });

    it('should properly select a joker from the player LetterRack and select, if possible, the next occurence', () => {
        const firstIndex = 0;
        const secondIndex = 3;
        const repeatedJoker = player.letterRack[secondIndex].char;
        player.letterRack[firstIndex].char = repeatedJoker;

        action.receiveKey(repeatedJoker.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(firstIndex)).toBeTruthy();

        action.receiveKey(repeatedJoker.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(secondIndex)).toBeTruthy();

        action.receiveKey(repeatedJoker.toLowerCase());
        expect(action.concernedIndexes.size).toBe(1);
        expect(action.concernedIndexes.has(firstIndex)).toBeTruthy();
    });

    it('should unselect a letter from the player LetterRack if a key/number outside of the LetterRack is pressed', () => {
        const index = 0;
        const char = player.letterRack[index].char;

        const keysOutsideOfLetterRack = [SPACE, ENTER, BACKSPACE, '-', '#', '/', '.', '+', '!', '"'];

        for (const outChar of keysOutsideOfLetterRack) {
            action.receiveKey(char.toLowerCase());
            expect(action.concernedIndexes.size).toBe(1);
            expect(action.concernedIndexes.has(index)).toBeTruthy();

            action.receiveKey(outChar);
            expect(action.concernedIndexes.size).toBe(0);
        }

        for (let num = 0; num < 10; num++) {
            action.receiveKey(char.toLowerCase());
            expect(action.concernedIndexes.size).toBe(1);
            expect(action.concernedIndexes.has(index)).toBeTruthy();

            action.receiveKey(String(num));
            expect(action.concernedIndexes.size).toBe(0);
        }
    });

    it('should unselect a letter from the player LetterRack if a letter outside of the LetterRack is pressed', () => {
        const index = 0;
        const char = player.letterRack[index].char;
        const charOutsideOfLetterRack = ['h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

        for (const outChar of charOutsideOfLetterRack) {
            action.receiveKey(char.toLowerCase());
            expect(action.concernedIndexes.size).toBe(1);
            expect(action.concernedIndexes.has(index)).toBeTruthy();

            action.receiveKey(outChar);
            expect(action.concernedIndexes.size).toBe(0);
        }
    });

    it('should move the selected letter to the right after receiving an ARROWRIGHT keypress', () => {
        const index = getRandomInt(RACK_LETTER_COUNT - 1);
        const concernedLetter = player.letterRack[index];
        action.receiveKey(concernedLetter.char.toLowerCase());

        for (let i = 0; i < 2 * RACK_LETTER_COUNT; i++) {
            const currentIndex = action.concernedIndexes.values().next().value;
            const newIndex = (currentIndex + 1) % RACK_LETTER_COUNT;
            action.receiveKey(ARROWRIGHT);
            expect(action.concernedIndexes.size).toBe(1);
            expect(action.concernedIndexes.values().next().value).toBe(newIndex);
            expect(player.letterRack[newIndex]).toEqual(concernedLetter);
        }
    });

    it('should move the selected letter to the left after receiving an ARROWLEFT keypress', () => {
        const index = getRandomInt(RACK_LETTER_COUNT - 1);
        const concernedLetter = player.letterRack[index];
        action.receiveKey(concernedLetter.char.toLowerCase());

        for (let i = 0; i < 2 * RACK_LETTER_COUNT; i++) {
            const currentIndex = action.concernedIndexes.values().next().value;
            const newIndex = (currentIndex + RACK_LETTER_COUNT - 1) % RACK_LETTER_COUNT;
            action.receiveKey(ARROWLEFT);
            expect(action.concernedIndexes.size).toBe(1);
            expect(action.concernedIndexes.values().next().value).toBe(newIndex);
            expect(player.letterRack[newIndex]).toEqual(concernedLetter);
        }
    });

    it('should move the selected letter to the right after receiving a downwards mousewheel roll', () => {
        const index = getRandomInt(RACK_LETTER_COUNT - 1);
        const concernedLetter = player.letterRack[index];
        action.receiveKey(concernedLetter.char.toLowerCase());

        for (let i = 0; i < 2 * RACK_LETTER_COUNT; i++) {
            const currentIndex = action.concernedIndexes.values().next().value;
            const newIndex = (currentIndex + 1) % RACK_LETTER_COUNT;
            action.receiveRoll(WheelRoll.DOWN);
            expect(action.concernedIndexes.size).toBe(1);
            expect(action.concernedIndexes.values().next().value).toBe(newIndex);
            expect(player.letterRack[newIndex]).toEqual(concernedLetter);
        }
    });

    it('should move the selected letter to the left after receiving an upwards mousewheel roll', () => {
        const index = getRandomInt(RACK_LETTER_COUNT - 1);
        const concernedLetter = player.letterRack[index];
        action.receiveKey(concernedLetter.char.toLowerCase());

        for (let i = 0; i < 2 * RACK_LETTER_COUNT; i++) {
            const currentIndex = action.concernedIndexes.values().next().value;
            const newIndex = (currentIndex + RACK_LETTER_COUNT - 1) % RACK_LETTER_COUNT;
            action.receiveRoll(WheelRoll.UP);
            expect(action.concernedIndexes.size).toBe(1);
            expect(action.concernedIndexes.values().next().value).toBe(newIndex);
            expect(player.letterRack[newIndex]).toEqual(concernedLetter);
        }
    });

    it('should not do anything when the create method is called', () => {
        action.create();
        expect().nothing();
    });

    it('should not do anything when the SHIFT key is received', () => {
        action.receiveKey(SHIFT);
        expect().nothing();
    });
});
