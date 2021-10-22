/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JoinOnlineGameComponent } from './join-online-game.component';

describe('JoinOnlineGameComponent', () => {
    let component: JoinOnlineGameComponent;
    let fixture: ComponentFixture<JoinOnlineGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JoinOnlineGameComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinOnlineGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
