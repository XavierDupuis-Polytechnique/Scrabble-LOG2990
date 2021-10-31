import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { of } from 'rxjs';
import { WaitingForPlayerComponent } from './waiting-for-player.component';

const mockDialogRef = {
    close: jasmine.createSpy('close'),
};

const dialogRefStub = {
    afterClosed: (bot: string) => {
        const botDifficulty = bot;
        return of(botDifficulty);
    },
    close: jasmine.createSpy('close').and.returnValue(() => {
        return;
    }),
};

const dialogStub = { open: () => dialogRefStub };
fdescribe('WaitingForPlayerComponent', () => {
    let component: WaitingForPlayerComponent;
    let fixture: ComponentFixture<WaitingForPlayerComponent>;
    let onlineSocketHandlerSpy: jasmine.SpyObj<'OnlineGameInitService'>;

    beforeEach(async () => {
        onlineSocketHandlerSpy = jasmine.createSpyObj(
            'OnlineGameInitService',
            ['createGameMulti', 'listenForPendingGames', 'disconnect', 'joinPendingGames'],
            ['pendingGames$'],
        );
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, AppMaterialModule],

            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MatDialog, useValue: dialogStub },
                { provide: OnlineGameInitService, useValue: onlineSocketHandlerSpy },
            ],
            declarations: [WaitingForPlayerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingForPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('cancel', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const cancelButton = dom.querySelectorAll('button')[0];
        spyOn(component, 'cancel');
        cancelButton.click();
        expect(component.cancel).toHaveBeenCalled();
        expect(onlineSocketHandlerSpy).toHaveBeenCalled();
    });

    it('converToSolo should call convertToSolo', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const convertButton = dom.querySelectorAll('button')[1];
        spyOn(component, 'convertToModeSolo');
        convertButton.click();
        expect(component.convertToModeSolo).toHaveBeenCalled();
    });

    it('converToSolo should open convertToSolo dialog', () => {
        const botDifficulty = 'easy';
        component.convertToModeSolo();
        let botDifficultyFromDialog: string;
        dialogRefStub.afterClosed(botDifficulty).subscribe((botDifficultyResult) => {
            botDifficultyFromDialog = botDifficultyResult;
            expect(botDifficultyFromDialog).toEqual(botDifficulty);
        });
        dialogRefStub.close();
    });
});
