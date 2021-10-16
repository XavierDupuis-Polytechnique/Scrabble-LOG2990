import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { JOKER_CHAR, RACK_LETTER_COUNT, TWO } from '@app/GameLogic/constants';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { getRandomInt } from '@app/GameLogic/utils';
import { UIExchange } from './ui-exchange';

describe('UIExchange', () => {
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
        action = new UIExchange(player);
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

    it('should update the concernedIndexes following a receiveRightClick call', () => {
        const firstIndex = 0;
        const secondIndex = getRandomInt(RACK_LETTER_COUNT - 1, 1);
        action.receiveRightClick(firstIndex);
        expect(action.concernedIndexes.has(firstIndex)).toBeTruthy();
        action.receiveRightClick(firstIndex);
        expect(action.concernedIndexes.has(firstIndex)).toBeFalsy();
        action.receiveRightClick(firstIndex);
        action.receiveRightClick(secondIndex);
        expect(action.concernedIndexes.has(firstIndex)).toBeTruthy();
        expect(action.concernedIndexes.has(secondIndex)).toBeTruthy();
        expect(action.concernedIndexes.size).toBe(TWO);
    });

    it('should throw error when receiving a LeftClick', () => {
        expect(() => {
            action.receiveLeftClick('');
        }).toThrowError('UIExchange should not be able to receive a LeftClick');
    });

    it('should throw error when receiving a KeyPress', () => {
        expect(() => {
            action.receiveKey('');
        }).toThrowError('UIExchange should not be able to receive a KeyPress');
    });

    it('should throw error when receiving a MouseRoll', () => {
        expect(() => {
            action.receiveRoll('');
        }).toThrowError('UIExchange should not be able to receive a MouseRoll');
    });

    it('should create the corresponding ExchangeLetter action', () => {
        const firstIndex = 0;
        const secondIndex = getRandomInt(RACK_LETTER_COUNT - 1, 1);
        action.receiveRightClick(firstIndex);
        action.receiveRightClick(secondIndex);
        const expected = new ExchangeLetter(player, [player.letterRack[firstIndex], player.letterRack[secondIndex]]);
        expect(action.create()).toEqual(expected);
    });
});
