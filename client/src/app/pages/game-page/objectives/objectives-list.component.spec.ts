import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectivesListComponent } from './objectives-list.component';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';


describe('ObjectivesListComponent', () => {
    let component: ObjectivesListComponent;
    let fixture: ComponentFixture<ObjectivesListComponent>;
    let mockGameInfo: jasmine.SpyObj<GameInfoService>;
    beforeEach(async () => {
        mockGameInfo = jasmine.createSpyObj('GameInfoService', [], ['publicObjectives', 'privateObjectives']);
        const mockObjective = {} as unknown as Objective;
        (Object.getOwnPropertyDescriptor(mockGameInfo, 'publicObjectives')?.get as jasmine.Spy<() => Objective[]>).and.returnValue([
            mockObjective,
            mockObjective,
        ]);
        (Object.getOwnPropertyDescriptor(mockGameInfo, 'privateObjectives')?.get as jasmine.Spy<() => Objective[]>).and.returnValue([
            mockObjective,
            mockObjective,
            mockObjective,
        ]);
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

    it('should get private objectives properly', () => {
        expect(component.privateObjectives.length).toEqual(3);
    });
});
