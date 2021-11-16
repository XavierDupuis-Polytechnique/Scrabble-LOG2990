import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { AdminDictComponent, DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';
import { of } from 'rxjs';

describe('admin-dictionary component', () => {
    let component: AdminDictComponent;
    let fixture: ComponentFixture<AdminDictComponent>;
    let dictHttpServiceMock: jasmine.SpyObj<DictHttpService>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    beforeEach(async () => {
        dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['uploadDict', 'getListDict', 'getDictInfoList', 'delete']);
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            declarations: [AdminDictComponent],
            providers: [
                { provide: DictHttpService, useValue: dictHttpServiceMock },
                { provide: MatDialog, useValue: matDialog },
            ],
        });

        fixture = TestBed.createComponent(AdminDictComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('loadFile should open alert dialog if not file is not correct...', async () => {
        const dataTransfer = new DataTransfer();
        const myString = `{
            "title": "test",
            "description": "test",
            "words": ["allo"]
        }`;
        dataTransfer.items.add(new File([myString], 'test.json'));

        const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
        inputDebugEl.nativeElement.files = dataTransfer.files;

        inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
        dictHttpServiceMock.getListDict.and.returnValue([{ title: 'test', description: 'test', words: ['test'], id: 1 }]);
        fixture.detectChanges();

        dictHttpServiceMock.uploadDict.and.returnValue(false);
        await component.loadFile();
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('loadFile should not open alert dialog if file is correct', async () => {
        const dataTransfer = new DataTransfer();
        const myString = `{
            "title": "test",
            "description": "test",
            "words": ["allo"]
        }`;
        dataTransfer.items.add(new File([myString], 'test.json'));

        const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
        inputDebugEl.nativeElement.files = dataTransfer.files;

        inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
        dictHttpServiceMock.getListDict.and.returnValue([{ title: 'test', description: 'test', words: ['test'], id: 1 }]);
        fixture.detectChanges();

        dictHttpServiceMock.uploadDict.and.returnValue(true);
        await component.loadFile();
        expect(matDialog.open).not.toHaveBeenCalled();
    });

    it('showUpdateMenu should open dialog', () => {
        const dictInfoMock: DictInfo = { id: 1, canEdit: true, description: 'test', title: 'test' };

        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
            close: () => {
                return;
            },
        } as MatDialogRef<EditDictDialogComponent>);
        component.showUpdateMenu(dictInfoMock);
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('deleteDict should call http service', () => {
        const dictInfoMock: DictInfo = { id: 1, canEdit: true, description: 'test', title: 'test' };
        component.deleteDict(dictInfoMock);
        expect(dictHttpServiceMock.delete).toHaveBeenCalledWith(dictInfoMock);
    });
});
