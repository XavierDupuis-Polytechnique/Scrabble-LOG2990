/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditJvDialogComponent } from '@app/components/modals/edit-jv-dialog/edit-jv-dialog.component';
import { BotInfo, BotType, JvHttpService } from '@app/services/jv-http.service';
import { Observable, of } from 'rxjs';
import { AdminJvComponent } from './admin-jv.component';

describe('AdminJvComponent', () => {
    let component: AdminJvComponent;
    let fixture: ComponentFixture<AdminJvComponent>;
    let matDialogMock: jasmine.SpyObj<MatDialog>;
    let jvHttpServiceMock: jasmine.SpyObj<JvHttpService>;
    beforeEach(() => {
        matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        jvHttpServiceMock = jasmine.createSpyObj('JvHttpService', ['deleteBot', 'getDataInfo']);

        const dummyData: BotInfo[] = [{ name: 'Test', canEdit: true, type: BotType.Easy }];
        const obs = new Observable<BotInfo[]>((sub) => {
            sub.next(dummyData);
        });
        jvHttpServiceMock.getDataInfo.and.returnValue(obs);
        TestBed.configureTestingModule({
            declarations: [AdminJvComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogMock },
                { provide: JvHttpService, useValue: jvHttpServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminJvComponent);
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
        const obs = new Observable<Object>((subscribe) => {
            subscribe.next({});
        });
        jvHttpServiceMock.deleteBot.and.returnValue(obs);
        component.deleteBot(jvMock);
        expect(jvHttpServiceMock.deleteBot).toHaveBeenCalledWith(jvMock);
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
