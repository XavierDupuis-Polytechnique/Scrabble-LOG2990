import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { AppMaterialModule } from '@app/modules/material.module';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, FormsModule, CommonModule],
            declarations: [BoardComponent, MatSlider, MatGridList, MatGridTile],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
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
