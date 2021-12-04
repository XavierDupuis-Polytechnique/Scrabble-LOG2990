import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditBotDialogComponent } from '@app/components/modals/edit-bot-dialog/edit-bot-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { BotHttpService, BotInfo, BotType } from '@app/services/bot-http.service';
import { Observable, of, throwError } from 'rxjs';
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
            imports: [AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: matDialogMock },
                { provide: BotHttpService, useValue: botHttpServiceMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it('updatelist should return if error', () => {
        botHttpServiceMock.getDataInfo.and.returnValues(throwError({ status: 404 }));
        // eslint-disable-next-line dot-notation
        component['updateList']();
        expect(matDialogMock.open).not.toHaveBeenCalled();
    });
});
