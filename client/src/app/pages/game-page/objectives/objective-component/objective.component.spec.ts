import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { User } from '@app/game-logic/player/user';
import { ObjectiveComponent } from './objective.component';

class MockObjective extends Objective {
    update(): void {
        return;
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
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectiveComponent);
        component = fixture.componentInstance;
        component.objective = new MockObjective();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
