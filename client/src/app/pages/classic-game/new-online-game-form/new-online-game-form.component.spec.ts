/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewOnlineGameFormComponent } from './new-online-game-form.component';

describe('NewOnlineGameFormComponent', () => {
    let component: NewOnlineGameFormComponent;
    let fixture: ComponentFixture<NewOnlineGameFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewOnlineGameFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewOnlineGameFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
