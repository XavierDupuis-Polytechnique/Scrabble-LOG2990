import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';

describe('DictHttpService', () => {
    let service: DictHttpService;
    let httpClientMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(DictHttpService);
        httpClientMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('uploadDict should receive answer', () => {
        const dict: Dictionary = { title: 'testTitle', description: 'testDesc', words: ['test', 'test2'] };
        service.uploadDict(dict).subscribe((res) => {
            expect(res).toEqual(true);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/dictionary');
        expect(req.request.method).toEqual('POST');
        req.flush(true);
    });

    it('deleteDict should receive answer', () => {
        const dictTitle = 'testTitle';
        service.deleteDict(dictTitle).subscribe((res) => {
            expect(res).toEqual('');
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/dictionary?title=testTitle');
        expect(req.request.method).toEqual('DELETE');
        req.flush('');
    });

    it('getDict should return data', () => {
        const dict: DictInfo = { title: 'testTitle', description: 'testDesc', canEdit: true };

        service.getDict(dict.title).subscribe((res) => {
            expect(res).toEqual(dict);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/dictionary?title=testTitle');
        expect(req.request.method).toEqual('GET');
        req.flush(dict);
    });

    it('getDictInfoList should return data', () => {
        const dict: DictInfo[] = [{ title: 'testTitle', description: 'testDesc', canEdit: true }];

        service.getDictInfoList().subscribe((res) => {
            expect(res).toEqual(dict);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/dictionary');
        expect(req.request.method).toEqual('GET');
        req.flush(dict);
    });

    it('dropTable should send drop request', () => {
        service.dropTable().subscribe((res) => {
            expect(res).toEqual(true);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/dictionary/drop');
        expect(req.request.method).toEqual('GET');
        req.flush(true);
    });

    it('editDict should send request', () => {
        const oldDict: DictInfo = { title: 'testTitle', description: 'testDesc', canEdit: true };
        const newDict: DictInfo = { title: 'testTitle2', description: 'testDesc2', canEdit: true };

        service.editDict(oldDict, newDict).subscribe((res) => {
            expect(res).toEqual(true);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/dictionary');
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual([oldDict, newDict]);
    });
});
