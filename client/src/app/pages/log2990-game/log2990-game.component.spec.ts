import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Log2990GameComponent } from './log2990-game.component';

describe('Log2990GameComponent', () => {
    let component: Log2990GameComponent;
    let fixture: ComponentFixture<Log2990GameComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [Log2990GameComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(Log2990GameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
