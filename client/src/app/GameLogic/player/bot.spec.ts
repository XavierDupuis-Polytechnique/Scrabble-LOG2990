import { Bot } from './bot';

describe('Bot', () => {
    it('should create an instance', () => {
        expect(new Bot('')).toBeTruthy();
    });

    it('should have a different name from opponent', () => {
        expect(new Bot(Bot.botNames[0]).name).not.toBe(Bot.botNames[0]);
        expect(new Bot(Bot.botNames[1]).name).not.toBe(Bot.botNames[1]);
        expect(new Bot(Bot.botNames[2]).name).not.toBe(Bot.botNames[2]);
    });
});
