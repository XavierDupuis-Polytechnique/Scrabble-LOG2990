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
    botDataInfo: BotInfo[];
    dataSource: BotInfo[];
    botDisplayedColumns: string[] = ['name', 'type', 'edit', 'delete'];

    constructor(private readonly jvHttpService: JvHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.updateList();
    }

    showUpdateMenu(bot: BotInfo): void {
        this.dialog
            .open(EditJvDialogComponent, {
                width: '250px',
                data: bot,
            })
            .afterClosed()
            .subscribe(() => {
                this.updateList();
            });
    }

    addBot(): void {
        this.dialog
            .open(EditJvDialogComponent, {
                width: '250px',
                data: { dialogBot: {}, isEdit: false },
            })
            .afterClosed()
            .subscribe(() => {
                this.updateList();
            });
    }

    deleteBot(bot: BotInfo) {
        this.jvHttpService.deleteBot(bot).subscribe(() => {
            this.updateList();
        });
    }

    private updateList() {
        this.jvHttpService.getDataInfo().subscribe((res) => {
            const list = res as BotInfo[];
            this.botDataInfo = list;
            this.dataSource = [...this.botDataInfo];
        });
    }
}
