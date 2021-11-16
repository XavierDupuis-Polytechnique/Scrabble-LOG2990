import { ObjectiveCreator } from './objective-manager.service';

describe('ObjectiveManager', () => {
    let creator: ObjectiveCreator;

    beforeEach(() => {
        creator = new ObjectiveCreator();
    });

    it('should be created', () => {
        expect(creator).toBeTruthy();
    });
});
