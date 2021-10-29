/* eslint-disable max-classes-per-file */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { UIExchange } from '@app/GameLogic/actions/ui-actions/ui-exchange';
import { UIInputControllerService } from '@app/GameLogic/actions/ui-actions/ui-input-controller.service';
import { UIMove } from '@app/GameLogic/actions/ui-actions/ui-move';
import { UIPlace } from '@app/GameLogic/actions/ui-actions/ui-place';
import { RACK_LETTER_COUNT } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { InputComponent, InputType } from '@app/GameLogic/interface/ui-input';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { getRandomInt } from '@app/GameLogic/utils';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { HorseComponent } from './horse.component';

const mockPlayers: Player[] = [new User('Tim'), new User('George')];
mockPlayers[0].letterRack = [{ char: 'A', value: 3 }];

class MockGameManagerService {
    game = {
        players: mockPlayers,
    };
}

class MockUIInputControllerService {
    activeAction: UIAction | null;
}

const testSpy: jasmine.SpyObj<GameInfoService> = jasmine.createSpyObj('GameInfoService', ['getPlayer'], { user: { letterRack: 3 } });

describe('HorseComponent', () => {
    let component: HorseComponent;
    let fixture: ComponentFixture<HorseComponent>;
    const mockUIInputControllerService = new MockUIInputControllerService();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, CommonModule],
            declarations: [HorseComponent],
            providers: [
                { provide: GameManagerService, useClass: MockGameManagerService },
                { provide: UIInputControllerService, useValue: mockUIInputControllerService },
                { provide: GameInfoService, useValue: testSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(HorseComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialise player rack', () => {
        component.ngAfterContentInit();
        expect(component.playerRack).toBeDefined();
    });

    it('should detect click on horse letters', () => {
        spyOn(component.clickLetter, 'emit');
        const args = getRandomInt(RACK_LETTER_COUNT);
        const type = InputType.LeftClick;
        const input = { from: InputComponent.Horse, type, args };
        component.click(type, args);
        expect(component.clickLetter.emit).toHaveBeenCalledWith(input);
    });

    it('should return the correct boolean for a rackLetter selection depending on the current UIAction', () => {
        component.ngAfterContentInit();
        const index = getRandomInt(RACK_LETTER_COUNT);
        mockUIInputControllerService.activeAction = new UIMove(mockPlayers[0]);
        mockUIInputControllerService.activeAction.concernedIndexes.add(index);
        expect(component.isLetterSelectedForMove(index)).toBeTruthy();
        expect(component.isLetterSelectedForExchange(index)).toBeFalsy();
        expect(component.isLetterSelectedForPlace(index)).toBeFalsy();

        mockUIInputControllerService.activeAction = new UIExchange(mockPlayers[0]);
        mockUIInputControllerService.activeAction.concernedIndexes.add(index);
        expect(component.isLetterSelectedForMove(index)).toBeFalsy();
        expect(component.isLetterSelectedForExchange(index)).toBeTruthy();
        expect(component.isLetterSelectedForPlace(index)).toBeFalsy();

        mockUIInputControllerService.activeAction = new UIPlace(
            mockPlayers[0],
            TestBed.inject(PointCalculatorService),
            TestBed.inject(WordSearcher),
            TestBed.inject(BoardService),
        );
        mockUIInputControllerService.activeAction.concernedIndexes.add(index);
        expect(component.isLetterSelectedForMove(index)).toBeFalsy();
        expect(component.isLetterSelectedForExchange(index)).toBeFalsy();
        expect(component.isLetterSelectedForPlace(index)).toBeTruthy();
    });

    it('should return the correct boolean for a rackLetter selection (UIMove)', () => {
        component.ngAfterContentInit();
        mockUIInputControllerService.activeAction = new UIMove(mockPlayers[0]);
        for (let index = 0; index < RACK_LETTER_COUNT; index++) {
            mockUIInputControllerService.activeAction.concernedIndexes.add(index);
            expect(component.isLetterSelectedForMove(index)).toBeTruthy();
            mockUIInputControllerService.activeAction.concernedIndexes.delete(index);
        }
        for (let index = 0; index < RACK_LETTER_COUNT; index++) {
            expect(component.isLetterSelectedForMove(index)).toBeFalsy();
        }
    });

    it('should return the correct boolean for a rackLetter selection (UIExchange)', () => {
        component.ngAfterContentInit();
        mockUIInputControllerService.activeAction = new UIExchange(mockPlayers[0]);
        for (let index = 0; index < RACK_LETTER_COUNT; index++) {
            if (index % 2) {
                mockUIInputControllerService.activeAction.concernedIndexes.add(index);
            }
        }
        for (let index = 0; index < RACK_LETTER_COUNT; index++) {
            if (index % 2) {
                expect(component.isLetterSelectedForExchange(index)).toBeTruthy();
            } else {
                expect(component.isLetterSelectedForExchange(index)).toBeFalsy();
            }
        }
    });

    it('should return the correct boolean for a rackLetter selection (UIPlace)', () => {
        component.ngAfterContentInit();
        mockUIInputControllerService.activeAction = new UIPlace(
            mockPlayers[0],
            TestBed.inject(PointCalculatorService),
            TestBed.inject(WordSearcher),
            TestBed.inject(BoardService),
        );
        for (let index = 0; index < RACK_LETTER_COUNT; index++) {
            if (index % 2) {
                mockUIInputControllerService.activeAction.concernedIndexes.add(index);
            }
        }
        for (let index = 0; index < RACK_LETTER_COUNT; index++) {
            if (index % 2) {
                expect(component.isLetterSelectedForPlace(index)).toBeTruthy();
            } else {
                expect(component.isLetterSelectedForPlace(index)).toBeFalsy();
            }
        }
    });
});
