import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { ObjectivesListComponent } from './objectives-list.component';

describe('ObjectivesListComponent', () => {
    let component: ObjectivesListComponent;
    let fixture: ComponentFixture<ObjectivesListComponent>;
    let mockGameInfo: jasmine.SpyObj<GameInfoService>;
    beforeEach(async () => {
        mockGameInfo = jasmine.createSpyObj(
            'GameInfoService',
            ['getPrivateObjectives'],
            ['publicObjectives', 'privateObjectives', 'opponent', 'user'],
        );
        const mockObjective = {} as unknown as Objective;
        mockGameInfo.getPrivateObjectives.and.callFake(() => {
            return [mockObjective];
        });
        (Object.getOwnPropertyDescriptor(mockGameInfo, 'publicObjectives')?.get as jasmine.Spy<() => Objective[]>).and.returnValue([
            mockObjective,
            mockObjective,
        ]);
        (Object.getOwnPropertyDescriptor(mockGameInfo, 'privateObjectives')?.get as jasmine.Spy<() => Objective[]>).and.returnValue([
            mockObjective,
            mockObjective,
            mockObjective,
        ]);
        (Object.getOwnPropertyDescriptor(mockGameInfo, 'user')?.get as jasmine.Spy<() => Player>).and.returnValue(new User('p1'));
        (Object.getOwnPropertyDescriptor(mockGameInfo, 'opponent')?.get as jasmine.Spy<() => Player>).and.returnValue(new User('p2'));
        await TestBed.configureTestingModule({
            providers: [{ provide: GameInfoService, useValue: mockGameInfo }],
            declarations: [ObjectivesListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectivesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get public objectives properly', () => {
        expect(component.publicObjectives.length).toEqual(2);
    });

    it('should get user private objectives properly', () => {
        expect(component.userPrivateObjectives.length).toEqual(1);
    });

    it('should get opponent private objectives properly', () => {
        expect(component.opponentPrivateObjectives.length).toEqual(1);
    });

    it('should get opponent private objectives properly', () => {
        expect(component.isOwnedByOpponent).toBeFalsy();
        component.opponentPrivateObjectives[0].owner = mockGameInfo.opponent.name;
        expect(component.isOwnedByOpponent).toBeTruthy();
    });
});
