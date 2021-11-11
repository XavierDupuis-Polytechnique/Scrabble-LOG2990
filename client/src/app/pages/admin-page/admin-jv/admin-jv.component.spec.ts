/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminJvComponent } from './admin-jv.component';


describe('AdminJvComponent', () => {
    let component: AdminJvComponent;
    let fixture: ComponentFixture<AdminJvComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AdminJvComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminJvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
