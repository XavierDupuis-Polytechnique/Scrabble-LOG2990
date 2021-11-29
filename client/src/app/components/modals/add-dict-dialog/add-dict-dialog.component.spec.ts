import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DictHttpService } from '@app/services/dict-http.service';
import { of } from 'rxjs';

import { AddDictDialogComponent } from './add-dict-dialog.component';

describe('AddDictDialogComponent', () => {
    let component: AddDictDialogComponent;
    let fixture: ComponentFixture<AddDictDialogComponent>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddDictDialogComponent>>;
    let dictHttpServiceSpy: jasmine.SpyObj<DictHttpService>;
    beforeEach(async () => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        dictHttpServiceSpy = jasmine.createSpyObj('DictHttpService', ['uploadDict', 'getDict']);
        await TestBed.configureTestingModule({
            declarations: [AddDictDialogComponent],
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: DictHttpService, useValue: dictHttpServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddDictDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
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
        const dummyDict = of([{ title: 'test', description: 'test', words: ['test'] }]);
        dictHttpServiceSpy.getDict.and.returnValue(dummyDict);
        fixture.detectChanges();
        component.input.files = dataTransfer.files;

        const dummyAnswer = of(false);
        dictHttpServiceSpy.uploadDict.and.returnValue(dummyAnswer);
        await component.uploadFile();
        expect(dialogSpy.open).toHaveBeenCalled();
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
        const dummyDict = of([{ title: 'test', description: 'test', words: ['test'], id: 1 }]);
        dictHttpServiceSpy.getDict.and.returnValue(dummyDict);
        fixture.detectChanges();

        component.input.files = dataTransfer.files;
        const dummyAnswer = of(true);
        dictHttpServiceSpy.uploadDict.and.returnValue(dummyAnswer);
        await component.uploadFile();
        expect(dialogSpy.open).not.toHaveBeenCalled();
    });
});
