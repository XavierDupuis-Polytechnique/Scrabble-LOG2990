import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { DictHttpService } from '@app/services/dict-http.service';
import { JvHttpService } from '@app/services/jv-http.service';
import { of } from 'rxjs';
import { AdminDropDbComponent } from './admin-drop-db.component';

describe('AdminDropDbComponent', () => {
    let component: AdminDropDbComponent;

    let jvHttpServiceMock: jasmine.SpyObj<JvHttpService>;
    let dictHttpServiceMock: jasmine.SpyObj<DictHttpService>;
    let matDialogMock: jasmine.SpyObj<MatDialog>;
    let fixture: ComponentFixture<AdminDropDbComponent>;

    beforeEach(async () => {
        jvHttpServiceMock = jasmine.createSpyObj('JvHttpService', ['dropTable']);
        dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['dropTable']);
        matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        const dummyAnswer = of(true);
        jvHttpServiceMock.dropTable.and.returnValue(dummyAnswer);
        dictHttpServiceMock.dropTable.and.returnValue(dummyAnswer);

        await TestBed.configureTestingModule({
            declarations: [AdminDropDbComponent],
            providers: [
                { provide: JvHttpService, useValue: jvHttpServiceMock },
                { provide: DictHttpService, useValue: dictHttpServiceMock },
                { provide: MatDialog, useValue: matDialogMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDropDbComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dropTables should show alert dialog and call dropTable to service', () => {
        matDialogMock.open.and.returnValue({
            afterClosed: () => {
                return of(true);
            },
        } as MatDialogRef<AlertDialogComponent>);
        component.dropTables();

        expect(matDialogMock.open).toHaveBeenCalled();
        expect(jvHttpServiceMock.dropTable).toHaveBeenCalled();
    });

    it('dropTables should not call dropTable to service', () => {
        matDialogMock.open.and.returnValue({
            afterClosed: () => {
                return of(false);
            },
        } as MatDialogRef<AlertDialogComponent>);
        component.dropTables();

        expect(jvHttpServiceMock.dropTable).not.toHaveBeenCalled();
        expect(dictHttpServiceMock.dropTable).not.toHaveBeenCalled();
    });

    it('dropTables cover if path', async () => {
        const dummyAnswer = of(false);
        jvHttpServiceMock.dropTable.and.returnValue(dummyAnswer);
        dictHttpServiceMock.dropTable.and.returnValue(dummyAnswer);
        matDialogMock.open.and.returnValue({
            afterClosed: () => {
                return of(true);
            },
        } as MatDialogRef<AlertDialogComponent>);
        component.dropTables();
        expect(matDialogMock.open).toHaveBeenCalled();
    });
});
