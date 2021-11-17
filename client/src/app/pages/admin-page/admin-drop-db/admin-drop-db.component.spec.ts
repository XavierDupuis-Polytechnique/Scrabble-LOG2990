import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDropDbComponent } from './admin-drop-db.component';
import { JvHttpService } from '@app/services/jv-http.service';
import { DictHttpService } from '@app/services/dict-http.service';
import { MatDialog } from '@angular/material/dialog';

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
});
