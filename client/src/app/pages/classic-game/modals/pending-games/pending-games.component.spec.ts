/* tslint:disable:no-unused-variable */
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OnlineGameSettings } from '@app/modeMulti/interface/game-settings-multi.interface';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { Observable, Subject } from 'rxjs';
import { PendingGamesComponent } from './pending-games.component';

const mockDialogRef = {
    close: jasmine.createSpy('close').and.returnValue(() => {
        return;
    }),
};

describe('PendingGamesComponent', () => {
    let component: PendingGamesComponent;
    let fixture: ComponentFixture<PendingGamesComponent>;
    let onlineSocketHandlerSpy: jasmine.SpyObj<'OnlineGameInitService'>;
    const testPendingGames$ = new Subject<OnlineGameSettings[]>();

    beforeEach(
        waitForAsync(() => {
            onlineSocketHandlerSpy = jasmine.createSpyObj(
                'OnlineGameInitService',
                ['createGameMulti', 'listenForPendingGames', 'disconnect', 'joinPendingGames'],
                ['pendingGames$'],
            );
            TestBed.configureTestingModule({
                imports: [AppMaterialModule, BrowserAnimationsModule, CommonModule],

                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: mockDialogRef },
                    { provide: OnlineGameInitService, useValue: onlineSocketHandlerSpy },
                ],
                declarations: [PendingGamesComponent, DatePipe],
            }).compileComponents();

            (
                Object.getOwnPropertyDescriptor(onlineSocketHandlerSpy, 'pendingGames$')?.get as jasmine.Spy<() => Observable<OnlineGameSettings[]>>
            ).and.returnValue(testPendingGames$);
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(PendingGamesComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('cancel should close the dialog', () => {
        spyOn(component, 'cancel');
        component.cancel();
        expect(component.cancel).toHaveBeenCalled();
    });

    it('JoinGame should not be responsive if game not selected', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const buttons = dom.querySelectorAll('button');
        const spy = spyOn(component, 'joinGame');
        buttons[1].click();
        expect(spy.calls.count()).toBe(0);
    });

    it('should be an empty table ', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const tables = dom.querySelectorAll('tr');
        expect(tables.length).toBe(2);

        const numberHeaders = 4;
        const tableGames = tables[0];
        expect(tableGames.cells.length).toBe(numberHeaders);

        const tableAucunePartie = tables[1];
        expect(tableAucunePartie.cells[0].innerHTML).toBe('Aucune partie en attente');
    });

    it('should be a full table ', () => {
        testPendingGames$.next([
            { id: '1', playerName: 'Tom', randomBonus: true, timePerTurn: 60000 },
            { id: '4', playerName: 'Jerry', randomBonus: false, timePerTurn: 65000 },
        ]);
        const tableLength = 4; // headers + 2 gameSettings + hiddenNoGameAvailable
        const dom = fixture.nativeElement as HTMLElement;
        const tables = dom.querySelectorAll('tr');
        expect(tables.length).toBe(tableLength);
    });
});
