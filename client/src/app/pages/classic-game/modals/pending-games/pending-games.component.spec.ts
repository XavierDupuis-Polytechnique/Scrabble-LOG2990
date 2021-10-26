/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { PendingGamesComponent } from './pending-games.component';

const mockDialogRef = {
    close: jasmine.createSpy('close').and.returnValue(() => {
        return;
    }),
};
const mockOnlineGameService = {
    
    
};
fdescribe('PendingGamesComponent', () => {
    let component: PendingGamesComponent;
    let fixture: ComponentFixture<PendingGamesComponent>;
    // let pendingGamesSpy: jasmine.SpyObj<'OnlineGameInitService'>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [AppMaterialModule],

                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: mockDialogRef },
                    { provide: OnlineGameInitService, useValue: mockOnlineGameService },
                ],
                declarations: [PendingGamesComponent],
            }).compileComponents();

            // pendingGamesSpy = jasmine.createSpyObj('onlineService', ['getPendingGames']);
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
    it('JoinGame should close the dialog', () => {
        spyOn(mockDialogRef, 'close');
        component.joinGame();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
    it('cancel should close the dialog and reset form', () => {
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

    // it('selectedrow should return correct row', () => {
    //     const dom = fixture.nativeElement as HTMLElement;
    //     const games = dom.querySelectorAll('table');

    //     const spy = spyOn(component, 'joinGame');

    //     expect(spy.calls.count()).toBe(0);
    // });
});
