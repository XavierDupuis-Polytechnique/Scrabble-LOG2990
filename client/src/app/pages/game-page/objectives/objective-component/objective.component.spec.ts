/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { User } from '@app/game-logic/player/user';
import { ObjectiveStatus } from '@app/pages/game-page/objectives/objectives-status.enum';
import { ObjectiveComponent } from './objective.component';

class MockObjective extends Objective {
    name = 'objTest';
    description = 'allo';
    progression = 0.1;
    points = 10;
    updateProgression(): void {
        return;
    }

    // eslint-disable-next-line no-unused-vars
    getPlayerProgression(name: string): number {
        return this.progression;
    }
}

describe('ObjectiveComponent', () => {
    let component: ObjectiveComponent;
    let fixture: ComponentFixture<ObjectiveComponent>;
    beforeEach(async () => {
        const mockInfoService = jasmine.createSpyObj('GameInfoService', ['getObjective']);
        mockInfoService.user = new User('test');
        await TestBed.configureTestingModule({
            providers: [{ provide: GameInfoService, useValue: mockInfoService }],
            declarations: [ObjectiveComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ObjectiveComponent);
        component = fixture.componentInstance;
        component.objective = new MockObjective(TestBed.inject(ObjectiveNotifierService));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle show description', () => {
        component.onMouseEnter();
        expect(component.showDescription).toBeTrue();
        component.onMouseLeave();
        expect(component.showDescription).toBeFalse();
    });

    it('should get objective status properly', () => {
        component.objective.owner = 'test';
        expect(component.status).toBe(ObjectiveStatus.Won);
        component.objective.owner = undefined;
        expect(component.status).toBe(ObjectiveStatus.NotClaimed);
        component.objective.owner = 'test2';
        expect(component.status).toBe(ObjectiveStatus.Lost);
    });

    it('should get objective progression properly', () => {
        expect(component.progression).toBe(0.1);
    });

    it('should get points properly', () => {
        expect(component.points).toBe(10);
    });

    it('should get name properly', () => {
        expect(component.name).toBe('objTest');
    });

    it('should get description properly', () => {
        expect(component.description).toBe('allo');
    });
});
