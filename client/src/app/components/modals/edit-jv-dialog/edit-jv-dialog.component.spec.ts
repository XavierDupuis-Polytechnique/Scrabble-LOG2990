import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BotHttpService, BotType } from '@app/services/jv-http.service';
import { Observable } from 'rxjs';
import { EditJvDialogComponent } from './edit-jv-dialog.component';

describe('EditJvDialogComponent', () => {
    let component: EditJvDialogComponent;
    let fixture: ComponentFixture<EditJvDialogComponent>;

    let matDialogMock: jasmine.SpyObj<MatDialog>;
    let matDialogRefMock: jasmine.SpyObj<MatDialogRef<EditJvDialogComponent>>;

    let jvHttpMock: jasmine.SpyObj<BotHttpService>;
    beforeEach(async () => {
        matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
        jvHttpMock = jasmine.createSpyObj('BotHttpService', ['editBot', 'addBot']);

        await TestBed.configureTestingModule({
            declarations: [EditJvDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: String },
                { provide: MatDialog, useValue: matDialogMock },
                { provide: MatDialogRef, useValue: matDialogRefMock },
                { provide: BotHttpService, useValue: jvHttpMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditJvDialogComponent);
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
        jvHttpMock.editBot.and.returnValue(obs);
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        const oldMockBot = { canEdit: true, name: 'old', type: BotType.Easy };

        component.editBotInfo = oldMockBot;
        component.bot = mockBot;
        component.editBot();
        expect(jvHttpMock.editBot).toHaveBeenCalledOnceWith(oldMockBot, mockBot);
        expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('editbot should open alert dialog if problem', () => {
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        component.bot = mockBot;
        const obs = new Observable<boolean>((subscriber) => {
            subscriber.next(false);
        });
        jvHttpMock.editBot.and.returnValue(obs);
        component.editBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('addBot should call http service and close dialog if ok', () => {
        const obs = new Observable<boolean>((subscriber) => {
            subscriber.next(true);
        });
        jvHttpMock.addBot.and.returnValue(obs);
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        component.bot = mockBot;
        component.addBot();
        expect(jvHttpMock.addBot).toHaveBeenCalledOnceWith(mockBot);
        expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('addBot should open alert dialog if problem', () => {
        const mockBot = { canEdit: true, name: 'test', type: BotType.Easy };
        component.bot = mockBot;
        const obs = new Observable<boolean>((subscriber) => {
            subscriber.next(false);
        });
        jvHttpMock.addBot.and.returnValue(obs);
        component.addBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });
});
