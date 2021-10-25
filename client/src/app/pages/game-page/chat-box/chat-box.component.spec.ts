import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { User } from '@app/GameLogic/player/user';
import { AppMaterialModule } from '@app/modules/material.module';
import { BehaviorSubject } from 'rxjs';
import { ChatBoxComponent } from './chat-box.component';

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    let messageServiceSpy: jasmine.SpyObj<MessagesService>;
    let gameInfoServiceSpy: jasmine.SpyObj<GameInfoService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

    beforeEach(() => {
        messageServiceSpy = jasmine.createSpyObj('MessagesService', ['receiveMessagePlayer']);
        messageServiceSpy.messages$ = new BehaviorSubject<Message[]>([{ content: 'Test', from: 'test from', type: MessageType.Player1 }]);
        gameInfoServiceSpy = jasmine.createSpyObj('GameInfoService', ['getPlayer']);
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule, FormsModule],
            declarations: [ChatBoxComponent],
            providers: [
                { provide: MessagesService, useValue: messageServiceSpy },
                { provide: GameInfoService, useValue: gameInfoServiceSpy },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        gameInfoServiceSpy.user = new User('SAMUEL');
        fixture = TestBed.createComponent(ChatBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create instance', () => {
        expect(component).toBeTruthy();
    });

    it('should send message to message service if message valid', () => {
        component.messageContent = 'Test message';
        component.sendMessage();
        expect(messageServiceSpy.receiveMessagePlayer).toHaveBeenCalled();
    });

    it('should not send a message if message is not valid', () => {
        component.sendMessage();
        expect(messageServiceSpy.receiveMessagePlayer.calls.count()).toBe(0);
    });

    it('should change color of number of character if it exceeds limit', () => {
        const maxCharPlusOne = 514;

        expect(fixture.debugElement.query(By.css('#red'))).toBeNull();
        component.isError(maxCharPlusOne);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#red'))).toBeDefined();
    });
});
