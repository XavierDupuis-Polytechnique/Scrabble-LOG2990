import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JvHttpService } from '@app/services/jv-http.service';
import { EditJvDialogComponent } from './edit-jv-dialog.component';

describe('EditJvDialogComponent', () => {
    let component: EditJvDialogComponent;
    let fixture: ComponentFixture<EditJvDialogComponent>;

    let matDialogMock: jasmine.SpyObj<MatDialog>;
    let matDialogRefMock: jasmine.SpyObj<MatDialogRef<EditJvDialogComponent>>;

    let jvHttpMock: jasmine.SpyObj<JvHttpService>;
    beforeEach(async () => {
        matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
        jvHttpMock = jasmine.createSpyObj('JvHttpService', ['editBot', 'addBot']);

        await TestBed.configureTestingModule({
            declarations: [EditJvDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: String },
                { provide: MatDialog, useValue: matDialogMock },
                { provide: MatDialogRef, useValue: matDialogRefMock },
                { provide: JvHttpService, useValue: jvHttpMock },
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
        jvHttpMock.editBot.and.returnValue(true);
        const mockBot = { id: 1, canEdit: true, name: 'test', type: 'facile' };
        component.bot = mockBot;
        component.editBot();
        expect(jvHttpMock.editBot).toHaveBeenCalledOnceWith(mockBot);
        expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('editbot should open alert dialog if problem', () => {
        const mockBot = { id: 1, canEdit: true, name: 'test', type: 'facile' };
        component.bot = mockBot;
        jvHttpMock.editBot.and.returnValue(false);
        component.editBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('addBot should call http service and close dialog if ok', () => {
        jvHttpMock.addBot.and.returnValue(true);
        const mockBot = { id: 1, canEdit: true, name: 'test', type: 'facile' };
        component.bot = mockBot;
        component.addBot();
        expect(jvHttpMock.addBot).toHaveBeenCalledOnceWith(mockBot);
        expect(matDialogRefMock.close).toHaveBeenCalled();
    });

    it('addBot should open alert dialog if problem', () => {
        const mockBot = { id: 1, canEdit: true, name: 'test', type: 'facile' };
        component.bot = mockBot;
        jvHttpMock.addBot.and.returnValue(false);
        component.addBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });
});
