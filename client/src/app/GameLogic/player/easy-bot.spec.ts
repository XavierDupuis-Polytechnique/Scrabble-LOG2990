import { EasyBot } from './easy-bot';

describe('EasyBot', () => {
    it('should create an instance', () => {
        expect(new EasyBot('Tim')).toBeTruthy();
    });
});
