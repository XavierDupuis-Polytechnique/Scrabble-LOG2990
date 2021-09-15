import { User } from '@app/GameLogic/player/user';
import { Letter } from '../game/letter.interface';
import { ExchangeLetter } from './exchange-letter';

describe('ExchangeLetter', () => {
    it('should create an instance', () => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        expect(new ExchangeLetter(new User('Time'), letters)).toBeTruthy();
    });
});
