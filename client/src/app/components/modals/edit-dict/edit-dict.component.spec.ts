import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';
import { of } from 'rxjs';

describe('EditDictDialogComponent', () => {
    let component: EditDictDialogComponent;
    let fixture: ComponentFixture<EditDictDialogComponent>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let dictHttpMock: jasmine.SpyObj<DictHttpService>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<EditDictDialogComponent>>;
    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        dictHttpMock = jasmine.createSpyObj('DictHttpService', ['editDict', 'delete']);
        await TestBed.configureTestingModule({
            declarations: [EditDictDialogComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialog, useValue: matDialog },
                { provide: MAT_DIALOG_DATA, useValue: String },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: DictHttpService, useValue: dictHttpMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditDictDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('uploadEdit should close dialog if ok', async () => {
        const dummyAnswer = of(true);
        component.tempDict = { title: 'test', description: 'test', canEdit: true };
        dictHttpMock.editDict.and.returnValue(dummyAnswer);
        component.uploadEdit();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('uploadedit should open alert dialog if not ok', async () => {
        const dummyAnswer = of(false);
        component.tempDict = { title: 'test', description: 'test', canEdit: true };
        dictHttpMock.editDict.and.returnValue(dummyAnswer);
        component.uploadEdit();
        expect(matDialog.open).toHaveBeenCalled();
    });
});
