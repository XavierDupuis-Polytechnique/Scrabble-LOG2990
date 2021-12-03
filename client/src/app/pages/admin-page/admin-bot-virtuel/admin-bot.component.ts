import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditBotDialogComponent } from '@app/components/modals/edit-bot-dialog/edit-bot-dialog.component';
import { openErrorDialog } from '@app/game-logic/utils';
import { BotHttpService, BotInfo } from '@app/services/bot-http.service';

@Component({
    selector: 'app-admin-bot',
    templateUrl: './admin-bot.component.html',
    styleUrls: ['./admin-bot.component.scss'],
})
export class AdminBotComponent implements OnInit {
    botDataInfo: BotInfo[];
    botDisplayedColumns: string[] = ['name', 'type', 'edit', 'delete'];

    constructor(private readonly botHttpService: BotHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.updateList();
    }

    showUpdateMenu(bot: BotInfo): void {
        this.dialog
            .open(EditBotDialogComponent, {
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
            .open(EditBotDialogComponent, {
                width: '250px',
                data: { dialogBot: {}, isEdit: false },
            })
            .afterClosed()
            .subscribe(() => {
                this.updateList();
            });
    }

    deleteBot(bot: BotInfo) {
        this.botHttpService.deleteBot(bot).subscribe(
            () => {
                this.updateList();
            },
            () => {
                openErrorDialog(this.dialog, '250px', 'Une erreur est survenue avec le serveur, veuillez réessayer plus tard.');
            },
        );
    }

    private updateList() {
        this.botHttpService.getDataInfo().subscribe(
            (response) => {
                const list = response as BotInfo[];
                this.botDataInfo = list;
            },
            () => {
                return;
            },
        );
    }
}
