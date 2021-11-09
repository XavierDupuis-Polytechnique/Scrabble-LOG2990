import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdminDictComponent } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';

fdescribe('admin-dictionary component', () => {
    let component: AdminDictComponent;
    let fixture: ComponentFixture<AdminDictComponent>;
    let dictHttpServiceMock: DictHttpService;

    beforeEach(async () => {
        dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['uploadDict', 'getListDict']);

        await TestBed.configureTestingModule({
            declarations: [AdminDictComponent],
            providers: [{ provide: DictHttpService, useValue: dictHttpServiceMock }],
        });

        fixture = TestBed.createComponent(AdminDictComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('loadFile', async () => {
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
        fixture.detectChanges();

        await component.loadFile();
        expect(dictHttpServiceMock.uploadDict).toHaveBeenCalled();
    });
});
