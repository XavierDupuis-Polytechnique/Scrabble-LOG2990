import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { User } from '@app/game-logic/player/user';
import { first } from 'rxjs/operators';

describe('User', () => {
    let user: User;
    beforeEach(() => {
        user = new User('');

        const rackLetters = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'B', value: 1 },
            { char: 'C', value: 1 },
            { char: 'A', value: 1 },
        ];
        user.letterRack = rackLetters;
    });

    it('should create an instance', () => {
        expect(user).toBeTruthy();
    });

    it('should get one letter from rack', () => {
        const mockLetters = [{ char: 'A', value: 1 }];
        const expectedLetters = [user.letterRack[4]];
        expect(user.getLettersFromRack(mockLetters)[0]).toEqual(expectedLetters[0]);
    });

    it('should get all letters from rack', () => {
        const letterRack = user.letterRack;
        const expectedLetters = [letterRack[0], letterRack[1], letterRack[2], letterRack[3], letterRack[4]];
        const mockLetters = [...user.letterRack];
        const value = user.getLettersFromRack(mockLetters);
        let testValue = true;
        for (let i = 0; i < expectedLetters.length; i++) {
            testValue = testValue && expectedLetters[i] === value[i];
        }
        expect(testValue).toEqual(true);
    });

    it('should throw an error when mock letter not in rack', () => {
        const mockLetters = [{ char: 'Z', value: 1 }];
        expect(() => {
            user.getLettersFromRack(mockLetters);
        }).toThrowError();
    });

    it('should throw an error when no more letters in rack', () => {
        const mockLetters = [...user.letterRack];
        mockLetters.push({ char: 'Z', value: 1 });
        expect(() => {
            user.getLettersFromRack(mockLetters);
        }).toThrowError();
    });

    it('should send actions in action$ when play', () => {
        const sentAction = new PassTurn(user);
        user.action$.pipe(first()).subscribe((action) => {
            expect(action).toBe(sentAction);
        });
        user.play(sentAction);
    });
});
