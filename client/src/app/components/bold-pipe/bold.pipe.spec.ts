import { BoldPipe } from './bold.pipe';

describe('BoldPipe', () => {
    let pipe: BoldPipe;
    beforeEach(() => {
        pipe = new BoldPipe();
    });
    it('create an instance', () => {
        expect(new BoldPipe()).toBeTruthy();
    });

    it('should transform properly', () => {
        const str = 'Salut #allo# comment #ca va#?';
        const expected = 'Salut <b>allo</b> comment <b>ca va</b>?';
        expect(pipe.transform(str)).toBe(expected);
    });

    it('should not transform', () => {
        const str = 'Salut #allo comment';
        const expected = 'Salut #allo comment';
        expect(pipe.transform(str)).toBe(expected);
    });
});
