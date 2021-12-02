/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { AppMaterialModule } from '@app/modules/material.module';
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
            imports: [AppMaterialModule],
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

    it('showSelectedFile should not continue if file is null', () => {
        const t = document.createElement('input');
        t.files = null;
        spyOnProperty(component, 'input').and.returnValue(t);
        component.showSelectedFile();
        expect(component.selectedFile).toBe('');
    });

    it('showSelectedFile should not continue if file is not json', () => {
        const dataTransfer = new DataTransfer();
        const myString = `{
            "title": "test",
            "description": "test",
            "words": ["allo"]
        }`;
        dataTransfer.items.add(new File([myString], 'test.txt'));

        const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
        inputDebugEl.nativeElement.files = dataTransfer.files;
        component.showSelectedFile();
        expect(component.selectedFile).toBe('');
    });

    it('upload file should return if file is null', () => {
        const t = document.createElement('input');
        t.files = null;
        spyOnProperty(component, 'input').and.returnValue(t);
        component.uploadFile();
        expect(dictHttpServiceSpy.uploadDict).not.toHaveBeenCalled();
    });

    it('uploadDict should open modal when dict.title is undefine', () => {
        const dict = {
            title: undefined,
            description: 'test',
            words: [''],
        };
        component['uploadDictionary'](dict as unknown as Dictionary);
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('uploadDict should open modal when dict.title have special character', () => {
        const dict = {
            title: '@#@',
            description: 'test',
            words: [''],
        };
        component['uploadDictionary'](dict as unknown as Dictionary);
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('uploadDict should open modal when dict.title have special character', () => {
        const dict = {
            title: 'testTitle',
            description: undefined,
            words: [''],
        };
        component['uploadDictionary'](dict as unknown as Dictionary);
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('uploadDict should open modal when dict.title have special character', () => {
        const dict = {
            title: 'testTitle',
            description: 'test',
            words: undefined,
        };
        component['uploadDictionary'](dict as unknown as Dictionary);
        expect(dialogSpy.open).toHaveBeenCalled();
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
