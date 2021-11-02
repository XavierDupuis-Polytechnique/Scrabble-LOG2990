import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisconnectedFromServerComponent } from './disconnected-from-server.component';

describe('DisconnectedFromServerComponent', () => {
    let component: DisconnectedFromServerComponent;
    let fixture: ComponentFixture<DisconnectedFromServerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisconnectedFromServerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DisconnectedFromServerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
