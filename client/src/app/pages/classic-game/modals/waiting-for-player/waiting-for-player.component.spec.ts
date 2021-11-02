import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { WaitingForPlayerComponent } from './waiting-for-player.component';

const mockDialogRef = {
    close: jasmine.createSpy('close'),
};

const convertSoloDialogRefStub = {
    afterClosed: (bot: string) => {
        const botDifficulty = bot;
        return {
            subscribe: (func: (result: string) => void) => func(botDifficulty),
        };
    },
    close: jasmine.createSpy('close').and.returnValue(() => {
        mockDialogRef.close();
        return;
    }),
};

const dialogStub = { open: () => convertSoloDialogRefStub, close: jasmine.createSpy('close') };
describe('WaitingForPlayerComponent', () => {
    let component: WaitingForPlayerComponent;
    let fixture: ComponentFixture<WaitingForPlayerComponent>;
    let onlineSocketHandlerSpy: jasmine.SpyObj<OnlineGameInitService>;

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
    });
    it('should disconnect socket on cancel', () => {
        component.cancel();
        expect(onlineSocketHandlerSpy.disconnectSocket).toHaveBeenCalled();
    });

    it('converToSolo should call convertToSolo', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const convertButton = dom.querySelectorAll('button')[1];
        spyOn(component, 'convertToModeSolo');
        convertButton.click();
        expect(component.convertToModeSolo).toHaveBeenCalled();
    });

    it('converToSolo should open convertToSolo dialog and get bot difficulty', () => {
        const botDifficulty = 'easy';
        component.convertToModeSolo();
        let botDifficultyFromDialog: string;
        convertSoloDialogRefStub.afterClosed(botDifficulty).subscribe((botDifficultyResult) => {
            botDifficultyFromDialog = botDifficultyResult;
            expect(botDifficultyFromDialog).toEqual(botDifficulty);
        });
        convertSoloDialogRefStub.close();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('isSoloStrated should be true', () => {
        component.convertToModeSolo();
        expect(component.isSoloStarted).toBeTrue();
    });

    it('converToSolo with no bot difficulty', () => {
        const botDifficulty = undefined as unknown;
        component.convertToModeSolo();
        let botDifficultyFromDialog: string;
        convertSoloDialogRefStub.afterClosed(botDifficulty as string).subscribe((botDifficultyResult) => {
            botDifficultyFromDialog = botDifficultyResult;
            expect(botDifficultyFromDialog).toBeUndefined();
        });
        convertSoloDialogRefStub.close();
    });
});
