import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { JOKER_CHAR } from '@app/GameLogic/constants';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { UIPlace } from './ui-place';

describe('UIPlace', () => {
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
        action = new UIPlace(player);
    });

    it('should create an instance', () => {
        expect(action).toBeTruthy();
    });
});
