import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClassicGameComponent } from './classic-game.component';

describe('ClassicGameComponent', () => {
    let component: ClassicGameComponent;
    let fixture: ComponentFixture<ClassicGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClassicGameComponent],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassicGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
