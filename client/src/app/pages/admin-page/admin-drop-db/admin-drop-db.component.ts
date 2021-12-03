import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { openErrorDialog } from '@app/game-logic/utils';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { BotHttpService } from '@app/services/bot-http.service';
import { DictHttpService } from '@app/services/dict-http.service';

@Component({
    selector: 'app-admin-drop-db',
    templateUrl: './admin-drop-db.component.html',
    styleUrls: ['./admin-drop-db.component.scss'],
})
export class AdminDropDbComponent {
    constructor(
        private botHttpService: BotHttpService,
        private dictHttpService: DictHttpService,
        private leaderboardService: LeaderboardService,
        private dialog: MatDialog,
    ) {}

    dropTables(): void {
        this.dialog
            .open(AlertDialogComponent, {
                width: '250px',
                data: {
                    message: `
                    Attention si vous continuez, vous allez perdre toutes les données de la base de données.
                    Voulez-vous continuer le processus?`,
                    button1: 'Non',
                    button2: 'Oui',
                },
            })
            .afterClosed()
            .subscribe(async (answer) => {
                if (answer) {
                    const isbotDropOk = await this.dropbotTable();
                    const isDictOk = await this.dropDictTable();
                    const isDeleteLBOk = await this.dropLeaderboardTables();
                    if (!isbotDropOk || !isDictOk || !isDeleteLBOk) {
                        openErrorDialog(
                            this.dialog,
                            '300px',
                            'Une erreur est survenue avec la base de données. Impossible de réinitialiser les données.',
                        );
                        return;
                    }
                    this.refresh();
                }
            });
    }

    private async dropbotTable() {
        return new Promise<boolean>((resolve) => {
            this.botHttpService.dropTable().subscribe(
                (response) => {
                    const answer = JSON.parse(response.toString());
                    resolve(answer);
                },
                () => {
                    resolve(false);
                },
            );
        });
    }

    private async dropDictTable() {
        return new Promise<boolean>((resolve) => {
            this.dictHttpService.dropTable().subscribe(
                (response) => {
                    const answer = JSON.parse(response.toString());
                    resolve(answer);
                },
                () => {
                    resolve(false);
                },
            );
        });
    }

    private async dropLeaderboardTables() {
        return new Promise<boolean>((resolve) => {
            this.leaderboardService.dropCollections().subscribe(
                (response) => {
                    const answer = response.ok;
                    resolve(answer);
                },
                () => {
                    resolve(false);
                },
            );
        });
    }

    private refresh(): void {
        window.location.reload();
    }
}
