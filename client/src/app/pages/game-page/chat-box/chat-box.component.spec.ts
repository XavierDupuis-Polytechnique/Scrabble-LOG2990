import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ChatBoxComponent } from './chat-box.component';

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatBoxComponent],
            imports: [ReactiveFormsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not send message if more than 512 character', () => {
        let testString = '';
        for (let i = 0; i < 513; i++) {
            testString += '+';
        }
        const el = fixture.nativeElement.querySelector('input');
        el.value = testString;
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.sendMessage();
        expect(component.messageValid).toBeFalse();
    });

    it('should send message if correct format', () => {
        const testString = 'hello';
        const el = fixture.nativeElement.querySelector('input');
        el.value = testString;
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.sendMessage();
        expect(component.messageValid).toBeTrue();
    });
});
