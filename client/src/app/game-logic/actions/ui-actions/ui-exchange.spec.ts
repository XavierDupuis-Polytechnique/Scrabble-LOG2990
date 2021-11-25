import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { UIAction } from '@app/game-logic/actions/ui-actions/ui-action';
import { JOKER_CHAR, RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { getRandomInt } from '@app/game-logic/utils';
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
        expect(action.concernedIndexes.size).toBe(2);
    });

    it('should not do anything when receiving a LeftClick', () => {
        action.receiveLeftClick('');
        expect().nothing();
    });

    it('should not do anything when receiving a KeyPress', () => {
        action.receiveKey('');
        expect().nothing();
    });

    it('should not do anything when receiving a MouseRoll', () => {
        action.receiveRoll();
        expect().nothing();
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
