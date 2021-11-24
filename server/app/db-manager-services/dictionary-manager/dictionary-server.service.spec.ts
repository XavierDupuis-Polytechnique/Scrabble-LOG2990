import { DictionaryServerService } from '@app/db-manager-services/dictionary-manager/dictionary-server.service';
import { expect } from 'chai';

describe('DictionaryServerService', () => {
    let service: DictionaryServerService;

    beforeEach(() => {
        service = new DictionaryServerService();
    });

    it('should be created', () => {
        expect(service).to.equal(service);
    });
});
