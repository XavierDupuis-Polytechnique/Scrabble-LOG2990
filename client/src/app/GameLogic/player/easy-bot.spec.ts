import { EasyBot } from './easy-bot';

describe('EasyBot', () => {
    let easyBot: EasyBot;
    let spyPlay: jasmine.Spy;
    let spyExchange: jasmine.Spy;
    let spyPass: jasmine.Spy;
    beforeEach(() => {
        easyBot = new EasyBot('Tim');
        spyPlay = spyOn(easyBot, 'play');
        spyExchange = spyOn(easyBot, 'exchange');
        spyPass = spyOn(easyBot, 'pass');
    });

    it('should create an instance', () => {
        expect(new EasyBot('Tim')).toBeTruthy();
    });

    it('should call actions based on setting', () => {
        const mul = 10;
        const numberOfTime = 1000;
        for (let i = 0; i < numberOfTime; i++) {
            easyBot.randomActionPicker();
        }
        let value = Math.round((spyPass.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProabibility.pass);
        value = Math.round((spyExchange.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProabibility.exchange);
        value = Math.round((spyPlay.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProabibility.play);
    });
});
