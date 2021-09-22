/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
=======
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

>>>>>>> parent of b6cd97e (Revert "Merge branch 'dev' into Issue-4--Valider-Mot")
import { PlayerInfoComponent } from './player-info.component';

describe('PlayerInfoComponent', () => {
    let component: PlayerInfoComponent;
    let fixture: ComponentFixture<PlayerInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlayerInfoComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
