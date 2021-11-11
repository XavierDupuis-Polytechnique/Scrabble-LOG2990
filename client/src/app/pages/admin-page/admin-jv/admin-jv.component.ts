import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditJvDialogComponent } from '@app/components/modals/edit-jv-dialog/edit-jv-dialog.component';
import { BotInfo, JvHttpService } from '@app/services/jv-http.service';

@Component({
    selector: 'app-admin-jv',
    templateUrl: './admin-jv.component.html',
    styleUrls: ['./admin-jv.component.scss'],
})
export class AdminJvComponent implements OnInit {
    easyBotList: BotInfo[];
    hardBotList: BotInfo[];
    constructor(private readonly jvHttpService: JvHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.updateList();
    }

    showUpdateMenu(bot: BotInfo): void {
        this.dialog
            .open(EditJvDialogComponent, {
                width: '250px',
                data: { dialogBot: bot, isEdit: true },
            })
            .afterClosed()
            .subscribe(() => {
                this.updateList();
            });
    }

    addBot(): void {
        this.dialog.open(EditJvDialogComponent, {
            width: '250px',
            data: { dialogBot: {}, isEdit: false },
        });
    }

    private updateList() {
        this.easyBotList = this.jvHttpService.getEasyBotList();
        this.hardBotList = this.jvHttpService.getHardBotList();
    }
}
