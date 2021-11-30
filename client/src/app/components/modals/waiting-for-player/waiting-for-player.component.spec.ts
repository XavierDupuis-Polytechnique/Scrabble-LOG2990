import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConvertToSoloFormComponent } from '@app/components/modals/convert-to-solo-form/convert-to-solo-form.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { NewOnlineGameSocketHandler } from '@app/socket-handler/new-online-game-socket-handler/new-online-game-socket-handler.service';
import { of } from 'rxjs';
import { WaitingForPlayerComponent } from './waiting-for-player.component';

const mockDialogRef = {
    close: jasmine.createSpy('close'),
};

describe('WaitingForPlayerComponent', () => {
    let component: WaitingForPlayerComponent;
    let fixture: ComponentFixture<WaitingForPlayerComponent>;
    let onlineSocketHandlerSpy: jasmine.SpyObj<NewOnlineGameSocketHandler>;
    let matDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        onlineSocketHandlerSpy = jasmine.createSpyObj(
            'NewOnlineGameSocketHandler',
            ['createGameMulti', 'listenForPendingGames', 'disconnectSocket', 'joinPendingGames'],
            ['pendingGames$'],
        );
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, AppMaterialModule],

            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MatDialog, useValue: matDialog },
                { provide: NewOnlineGameSocketHandler, useValue: onlineSocketHandlerSpy },
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
        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of('easy');
            },
            close: () => {
                mockDialogRef.close();
                return;
            },
        } as MatDialogRef<ConvertToSoloFormComponent>);

        component.convertToModeSolo();
        expect(component.botDifficulty).toEqual('easy');
        expect(component.isSoloStarted).toBeTrue();
        expect(mockDialogRef.close).toHaveBeenCalledWith('easy');
    });

    it('converToSolo with no bot difficulty', () => {
        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of(undefined);
            },
            close: () => {
                mockDialogRef.close();
                return;
            },
        } as MatDialogRef<ConvertToSoloFormComponent>);
        component.convertToModeSolo();
        expect(component.botDifficulty).toBeUndefined();
        expect(component.isSoloStarted).toBeFalse();
    });
});
