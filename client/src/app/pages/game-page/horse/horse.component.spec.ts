/* eslint-disable max-classes-per-file */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIAction } from '@app/game-logic/actions/ui-actions/ui-action';
import { UIExchange } from '@app/game-logic/actions/ui-actions/ui-exchange';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { UIMove } from '@app/game-logic/actions/ui-actions/ui-move';
import { UIPlace } from '@app/game-logic/actions/ui-actions/ui-place';
import { RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
import { InputComponent, InputType } from '@app/game-logic/interfaces/ui-input';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { getRandomInt } from '@app/game-logic/utils';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { HorseComponent } from './horse.component';

const mockPlayers: Player[] = [new User('Tim'), new User('George')];
mockPlayers[0].letterRack = [{ char: 'A', value: 3 }];

class MockGameManagerService {
    game = {
        players: mockPlayers,
    };
}

class MockGameInfoService {
    user = mockPlayers[0];
    players = mockPlayers;
}

class MockUIInputControllerService {
    activeAction: UIAction | null;
}

describe('HorseComponent', () => {
    let component: HorseComponent;
    let fixture: ComponentFixture<HorseComponent>;
    const mockUIInputControllerService = new MockUIInputControllerService();
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, CommonModule],
            declarations: [HorseComponent],
            providers: [
                { provide: GameManagerService, useClass: MockGameManagerService },
                { provide: UIInputControllerService, useValue: mockUIInputControllerService },
                { provide: GameInfoService, useClass: MockGameInfoService },
                { provide: DictionaryService, useValue: dict },
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
        component.ngAfterContentChecked();
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
        component.ngAfterContentChecked();
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
            TestBed.inject(GameInfoService),
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
        component.ngAfterContentChecked();
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
        component.ngAfterContentChecked();
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
        component.ngAfterContentChecked();
        mockUIInputControllerService.activeAction = new UIPlace(
            TestBed.inject(GameInfoService),
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
