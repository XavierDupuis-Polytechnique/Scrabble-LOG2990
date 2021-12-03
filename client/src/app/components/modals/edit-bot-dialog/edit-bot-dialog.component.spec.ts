import { HttpStatusCode } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { BotHttpService, BotInfo, BotType } from '@app/services/bot-http.service';
import { Observable, throwError } from 'rxjs';
import { EditBotDialogComponent } from './edit-bot-dialog.component';

describe('EditbotDialogComponent', () => {
    let component: EditBotDialogComponent;
    let fixture: ComponentFixture<EditBotDialogComponent>;

    let matDialogMock: jasmine.SpyObj<MatDialog>;
    let matDialogRefMock: jasmine.SpyObj<MatDialogRef<EditBotDialogComponent>>;

    let botHttpMock: jasmine.SpyObj<BotHttpService>;
    beforeEach(async () => {
        matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
        botHttpMock = jasmine.createSpyObj('BotHttpService', ['editBot', 'addBot']);

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule, FormsModule],
            declarations: [EditBotDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: String },
                { provide: MatDialog, useValue: matDialogMock },
                { provide: MatDialogRef, useValue: matDialogRefMock },
                { provide: BotHttpService, useValue: botHttpMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditBotDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('editBot should call http service and close dialog if ok', () => {
        const obs = new Observable<boolean>((subscriber) => {
            subscriber.next(true);
        });
        botHttpMock.editBot.and.returnValue(obs);
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        const oldMockBot = { canEdit: true, name: 'old', type: BotType.Easy };

        component.editBotInfo = oldMockBot;
        component.bot = mockBot;
        component.editBot();
        expect(botHttpMock.editBot).toHaveBeenCalledOnceWith(oldMockBot, mockBot);
        expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('editbot should open alert dialog if problem', () => {
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        component.bot = mockBot;
        const obs = new Observable<boolean>((subscriber) => {
            subscriber.next(false);
        });
        botHttpMock.editBot.and.returnValue(obs);
        component.editBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('addBot should call http service and close dialog if ok', () => {
        const obs = new Observable<boolean>((subscriber) => {
            subscriber.next(true);
        });
        botHttpMock.addBot.and.returnValue(obs);
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        component.bot = mockBot;
        component.addBot();
        expect(botHttpMock.addBot).toHaveBeenCalledOnceWith(mockBot);
        expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('addBot should open alert dialog if problem', () => {
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        component.bot = mockBot;
        const obs = new Observable<boolean>((subscriber) => {
            subscriber.next(false);
        });
        botHttpMock.addBot.and.returnValue(obs);
        component.addBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('editBot should open dialog if error', () => {
        botHttpMock.editBot.and.returnValue(throwError({ status: HttpStatusCode.NotFound }));
        component.editBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('editBot should open error dialog if error is not NOTFound', () => {
        botHttpMock.editBot.and.returnValue(throwError({ status: HttpStatusCode.RequestTimeout }));
        component.editBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('isBotFill should return false if bot is correctly defined', () => {
        const errorBot = {
            name: 'test',
            type: BotType.Easy,
        };
        component.bot = errorBot as unknown as BotInfo;
        expect(!component.isValuesValid).toBe(false);
    });

    it('isBotFill should return true if bot is not correctly defined', () => {
        const errorBot = {
            name: undefined,
            type: BotType.Easy,
        };
        component.bot = errorBot as unknown as BotInfo;
        expect(!component.isValuesValid).toBe(true);
    });

    it('isBotFill should return true if bot is only space', () => {
        const errorBot = {
            name: ' ',
            type: BotType.Easy,
        };
        component.bot = errorBot as unknown as BotInfo;
        expect(!component.isValuesValid).toBe(true);
    });
});
