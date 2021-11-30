/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditBotDialogComponent } from '@app/components/modals/edit-bot-dialog/edit-bot-dialog.component';
import { BotHttpService, BotInfo, BotType } from '@app/services/bot-http.service';
import { Observable, of } from 'rxjs';
import { AdminBotComponent } from './admin-bot.component';

describe('AdminbotComponent', () => {
    let component: AdminBotComponent;
    let fixture: ComponentFixture<AdminBotComponent>;
    let matDialogMock: jasmine.SpyObj<MatDialog>;
    let botHttpServiceMock: jasmine.SpyObj<BotHttpService>;
    beforeEach(() => {
        matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        botHttpServiceMock = jasmine.createSpyObj('BotHttpService', ['deleteBot', 'getDataInfo']);

        const dummyData: BotInfo[] = [{ name: 'Test', canEdit: true, type: BotType.Easy }];
        const obs = new Observable<BotInfo[]>((sub) => {
            sub.next(dummyData);
        });
        botHttpServiceMock.getDataInfo.and.returnValue(obs);
        TestBed.configureTestingModule({
            declarations: [AdminBotComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogMock },
                { provide: BotHttpService, useValue: botHttpServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminBotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('addBot should open the dialog', () => {
        matDialogMock.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
        } as MatDialogRef<EditBotDialogComponent>);
        component.addBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('deleteBot should call http service', () => {
        const botMock: BotInfo = { canEdit: true, name: 'test', type: BotType.Easy };
        // eslint-disable-next-line @typescript-eslint/ban-types
        const obs = new Observable<string>((subscribe) => {
            subscribe.next('');
        });
        botHttpServiceMock.deleteBot.and.returnValue(obs);
        component.deleteBot(botMock);
        expect(botHttpServiceMock.deleteBot).toHaveBeenCalledWith(botMock);
    });

    it('showUpdateMenu should open dialog', () => {
        const botMock: BotInfo = { canEdit: true, name: 'test', type: BotType.Easy };

        matDialogMock.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
            close: () => {
                return;
            },
        } as MatDialogRef<EditBotDialogComponent>);

        component.showUpdateMenu(botMock);
        expect(matDialogMock.open).toHaveBeenCalled();
    });
});
