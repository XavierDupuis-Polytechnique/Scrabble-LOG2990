/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConvertToSoloFormComponent } from './convert-to-solo-form.component';

describe('ConvertToSoloFormComponent', () => {
    let component: ConvertToSoloFormComponent;
    let fixture: ComponentFixture<ConvertToSoloFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConvertToSoloFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConvertToSoloFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
