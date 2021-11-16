import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDropDbComponent } from './admin-drop-db.component';

describe('AdminDropDbComponent', () => {
    let component: AdminDropDbComponent;
    let fixture: ComponentFixture<AdminDropDbComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminDropDbComponent],
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
