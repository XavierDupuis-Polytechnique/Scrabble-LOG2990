import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BotHttpService, BotInfo, BotType } from '@app/services/bot-http.service';

describe('BotHttpService', () => {
    let service: BotHttpService;
    let httpClientMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(BotHttpService);
        httpClientMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('addBot should receive answer', () => {
        const bot: BotInfo = { type: BotType.Expert, canEdit: true, name: 'Test' };
        service.addBot(bot).subscribe((res) => {
            expect(res).toEqual(true);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/botinfo');
        expect(req.request.method).toEqual('POST');
        req.flush(true);
    });

    it('deleteBot should receive answer', () => {
        const bot: BotInfo = { type: BotType.Expert, canEdit: true, name: 'Test' };
        service.deleteBot(bot).subscribe((res) => {
            expect(res).toEqual('');
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/botinfo/Test');
        expect(req.request.method).toEqual('DELETE');
        req.flush('');
    });

    it('getDataInfo should return data', () => {
        const botList: BotInfo[] = [
            { type: BotType.Expert, canEdit: true, name: 'Test' },
            { type: BotType.Easy, canEdit: false, name: 'Test2' },
        ];
        service.getDataInfo().subscribe((res) => {
            expect(res).toEqual(botList);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/botinfo');
        expect(req.request.method).toEqual('GET');
        req.flush(botList);
    });

    it('dropTable should send drop request', () => {
        service.dropTable().subscribe((res) => {
            expect(res).toEqual(true);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/botinfo/drop');
        expect(req.request.method).toEqual('GET');
        req.flush(true);
    });

    it('editBot should send request', () => {
        const oldBot: BotInfo = { type: BotType.Expert, canEdit: true, name: 'old' };
        const newBot: BotInfo = { type: BotType.Expert, canEdit: true, name: 'new' };

        service.editBot(oldBot, newBot).subscribe((res) => {
            expect(res).toEqual(true);
        });

        const req = httpClientMock.expectOne('http://localhost:3000/api/botinfo');
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual([oldBot, newBot]);
    });
});
