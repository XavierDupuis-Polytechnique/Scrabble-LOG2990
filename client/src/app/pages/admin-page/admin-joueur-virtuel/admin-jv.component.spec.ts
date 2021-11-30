/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditJvDialogComponent } from '@app/components/modals/edit-jv-dialog/edit-jv-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { BotHttpService, BotInfo, BotType } from '@app/services/jv-http.service';
import { Observable, of } from 'rxjs';
import { AdminJoueurVirtuelComponent } from './admin-jv.component';

describe('AdminJvComponent', () => {
    let component: AdminJoueurVirtuelComponent;
    let fixture: ComponentFixture<AdminJoueurVirtuelComponent>;
    let matDialogMock: jasmine.SpyObj<MatDialog>;
    let botHttpServiceMock: jasmine.SpyObj<BotHttpService>;
    beforeEach(() => {
        matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        botHttpServiceMock = jasmine.createSpyObj('BotHttpService', ['deleteBot', 'getDataInfo']);

        const dummyData: BotInfo[] = [{ name: 'Test', canEdit: true, type: BotType.Easy }];
        const obs = new Observable<BotInfo[]>((sub) => {
            sub.next(dummyData);
        });
        botHttpServiceMock.getDataInfo.and.returnValue(obs);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [AdminJoueurVirtuelComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogMock },
                { provide: BotHttpService, useValue: botHttpServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminJoueurVirtuelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('addBot should open the dialog', () => {
        matDialogMock.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
        } as MatDialogRef<EditJvDialogComponent>);
        component.addBot();
        expect(matDialogMock.open).toHaveBeenCalled();
    });

    it('deleteBot should call http service', () => {
        const jvMock: BotInfo = { canEdit: true, name: 'test', type: BotType.Easy };
        // eslint-disable-next-line @typescript-eslint/ban-types
        const obs = new Observable<string>((subscribe) => {
            subscribe.next('');
        });
        botHttpServiceMock.deleteBot.and.returnValue(obs);
        component.deleteBot(jvMock);
        expect(botHttpServiceMock.deleteBot).toHaveBeenCalledWith(jvMock);
    });

    it('showUpdateMenu should open dialog', () => {
        const jvMock: BotInfo = { canEdit: true, name: 'test', type: BotType.Easy };

        matDialogMock.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
            close: () => {
                return;
            },
        } as MatDialogRef<EditJvDialogComponent>);

        component.showUpdateMenu(jvMock);
        expect(matDialogMock.open).toHaveBeenCalled();
    });
});
