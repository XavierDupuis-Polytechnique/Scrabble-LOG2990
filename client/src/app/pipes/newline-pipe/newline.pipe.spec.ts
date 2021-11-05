import { NewlinePipe } from './newline.pipe';

describe('NewlinePipe', () => {
    let pipe: NewlinePipe;
    beforeEach(() => {
        pipe = new NewlinePipe();
    });
    it('create an instance', () => {
        expect(new NewlinePipe()).toBeTruthy();
    });

    it('should transform properly one occurence', () => {
        const str = 'This is a line \\n This is another';
        const expected = 'This is a line <br> This is another';
        expect(pipe.transform(str)).toBe(expected);
    });

    it('should transform properly multiple occurence', () => {
        const str = 'This is a line \\n This is another \\n This is the last';
        const expected = 'This is a line <br> This is another <br> This is the last';
        expect(pipe.transform(str)).toBe(expected);
    });
});
