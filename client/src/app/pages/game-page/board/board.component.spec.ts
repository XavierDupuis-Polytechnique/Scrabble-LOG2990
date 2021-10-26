import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    const dict = new DictionaryService();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoardComponent, MatSlider, MatGridList, MatGridTile],
            providers: [{ provide: DictionaryService, useValue: dict }],
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

    it('should call our method that changes the font of the board', () => {
        const increasedFontSize = 13;
        const event = new MatSliderChange();
        event.value = increasedFontSize;
        component.updateSetting(event);
        expect(component.fontSize).toBe(increasedFontSize);
    });

    it('should not change font size if value of slider(event) is undefined', () => {
        const defaultValue = 10.5;
        const event = new MatSliderChange();
        event.value = null;
        component.updateSetting(event);
        expect(component.fontSize).toBe(defaultValue);
    });
});
