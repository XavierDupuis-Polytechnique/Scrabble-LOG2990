import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { EditJvDialogComponent } from '@app/components/modals/edit-jv-dialog/edit-jv-dialog.component';
import { BotHttpService, BotInfo } from '@app/services/jv-http.service';

@Component({
    selector: 'app-admin-jv',
    templateUrl: './admin-jv.component.html',
    styleUrls: ['./admin-jv.component.scss'],
})
export class AdminJoueurVirtuelComponent implements OnInit {
    botDataInfo: BotInfo[];
    dataSource: BotInfo[];
    botDisplayedColumns: string[] = ['name', 'type', 'edit', 'delete'];

    constructor(private readonly botHttpService: BotHttpService, private dialog: MatDialog) {}

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
        this.botHttpService.deleteBot(bot).subscribe(() => {
            this.updateList();
        });
    }

    private updateList() {
        this.botHttpService.getDataInfo().subscribe(
            (res) => {
                const list = res as BotInfo[];
                this.botDataInfo = list;
                this.dataSource = [...this.botDataInfo];
            },
            () => {
                if (!this.dialog.getDialogById('404')) {
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                            message: 'Le connection avec le serveur a échoué',
                            button1: 'Ok',
                            button2: '',
                        },
                        id: '404',
                    });
                }
            },
        );
    }
}
