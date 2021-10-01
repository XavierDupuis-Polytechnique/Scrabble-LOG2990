import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should increase font size', () => {
    //     const currentFontSize = component.fontSize;
    //     component.increaseFont();
    //     const newFontSize = component.fontSize;
    //     expect(currentFontSize < newFontSize).toBeTrue();
    // });

    // it('should decrease font size', () => {
    //     const currentFontSize = component.fontSize;
    //     component.decreaseFont();
    //     const newFontSize = component.fontSize;
    //     expect(currentFontSize > newFontSize).toBeTrue();
    // });

    // it('should stop increase when value is hit', () => {
    //     component.fontSize = component.maxFontSize;
    //     const currentFontSize = component.fontSize;
    //     component.increaseFont();
    //     const newFontSize = component.fontSize;
    //     expect(currentFontSize === newFontSize).toBeTrue();
    // });

    // it('should stop decrease when value is hit', () => {
    //     component.fontSize = component.minFontSize;
    //     const currentFontSize = component.fontSize;
    //     component.decreaseFont();
    //     const newFontSize = component.fontSize;
    //     expect(currentFontSize === newFontSize).toBeTrue();
    // });
});
