/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { ClickAndClickoutDirective } from '@app/directives/click-and-clickout.directive';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { UIPlace } from '@app/game-logic/actions/ui-actions/ui-place';
import { NOT_FOUND } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { CanvasDrawer } from '@app/pages/game-page/board/canvas-drawer';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
    let canvasDrawerMock: CanvasDrawer;
    let inputControllerMock: UIInputControllerService;
    beforeEach(async () => {
        canvasDrawerMock = jasmine.createSpyObj('CanvasDrawer', ['setIndicator', 'setDirection', 'drawGrid']);
        inputControllerMock = jasmine.createSpyObj('UIInputControllerService', [], ['activeAction']);
        await TestBed.configureTestingModule({
            declarations: [BoardComponent, ClickAndClickoutDirective],
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: UIInputControllerService, useValue: inputControllerMock },
            ],
            imports: [AppMaterialModule, FormsModule, CommonModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        const defaultValue = 18;
        const event = new MatSliderChange();
        event.value = null;
        component.updateSetting(event);
        expect(component.fontSize).toBe(defaultValue);
    });

    it('onResize should call setupCanvas', () => {
        const spy = spyOn<any>(component, 'setupCanvasDrawer');
        component.onResize();
        expect(spy).toHaveBeenCalled();
    });

    it('getFont should return the correct font size', () => {
        const FONT_SIZE = 25;
        component.fontSize = FONT_SIZE;
        expect(component.getFont()).toEqual(`font-size: ${FONT_SIZE}px;`);
    });

    it('canvasClick should emit input', () => {
        const spy = spyOn(component.clickTile, 'emit');

        const mouseEvent = {
            offsetX: 250,
            offsetY: 250,
        };

        component.canvasClick(mouseEvent as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('convertAscii should return correct char value', () => {
        const CHARCODE_A = 0;
        const answer = component.convertASCIIToChar(CHARCODE_A);
        expect(answer).toEqual('A');
    });

    it('ngDoCheck should enter all condition', () => {
        component.canvasDrawer = canvasDrawerMock;
        const dirAnswer: Direction = Direction.Horizontal;

        const test = new UIPlace(
            jasmine.createSpyObj('GameInfoService', ['void']),
            jasmine.createSpyObj('PointCalculatorService', ['void']),
            jasmine.createSpyObj('WordSearcher', ['void']),
            jasmine.createSpyObj('BoardService', ['void']),
        );

        test.pointerPosition = { x: 1, y: 1 };
        test.direction = Direction.Horizontal;
        (Object.getOwnPropertyDescriptor(inputControllerMock, 'activeAction')?.get as jasmine.Spy<() => UIPlace>).and.returnValue(test);
        component.ngDoCheck();
        expect(canvasDrawerMock.setDirection).toHaveBeenCalledWith(dirAnswer);
        expect(canvasDrawerMock.setIndicator).toHaveBeenCalledWith(1, 1);
        expect(canvasDrawerMock.drawGrid).toHaveBeenCalledTimes(1);
    });

    it('ngDoCheck should enter all condition expect if pointerPosition', () => {
        component.canvasDrawer = canvasDrawerMock;

        const test = new UIPlace(
            jasmine.createSpyObj('GameInfoService', ['void']),
            jasmine.createSpyObj('PointCalculatorService', ['void']),
            jasmine.createSpyObj('WordSearcher', ['void']),
            jasmine.createSpyObj('BoardService', ['void']),
        );

        (Object.getOwnPropertyDescriptor(inputControllerMock, 'activeAction')?.get as jasmine.Spy<() => UIPlace>).and.returnValue(test);
        component.ngDoCheck();
        expect(canvasDrawerMock.setDirection).not.toHaveBeenCalled();
        expect(canvasDrawerMock.setIndicator).not.toHaveBeenCalled();
        expect(canvasDrawerMock.drawGrid).toHaveBeenCalledTimes(1);
    });

    it('ngDoCheck should NOT enter second condition if pointerPosition is not defined', () => {
        component.canvasDrawer = canvasDrawerMock;
        const test = {} as UIPlace;

        (Object.getOwnPropertyDescriptor(inputControllerMock, 'activeAction')?.get as jasmine.Spy<() => UIPlace>).and.returnValue(test);
        component.ngDoCheck();
        expect(canvasDrawerMock.setDirection).not.toHaveBeenCalled();
        expect(canvasDrawerMock.setIndicator).toHaveBeenCalledWith(NOT_FOUND, NOT_FOUND);
        expect(canvasDrawerMock.drawGrid).toHaveBeenCalledTimes(1);
    });
});
