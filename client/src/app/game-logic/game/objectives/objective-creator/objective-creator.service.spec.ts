import { ObjectiveCreator } from './objective-creator.service';

describe('ObjectiveManager', () => {
    let creator: ObjectiveCreator;

    beforeEach(() => {
        creator = new ObjectiveCreator();
    });

    it('should be created', () => {
        expect(creator).toBeTruthy();
    });
});
