import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { DictHttpService } from '@app/services/dict-http.service';
import { JvHttpService } from '@app/services/jv-http.service';
@Component({
    selector: 'app-admin-drop-db',
    templateUrl: './admin-drop-db.component.html',
    styleUrls: ['./admin-drop-db.component.scss'],
})
export class AdminDropDbComponent {
    constructor(private joueurVirtuelHttpService: JvHttpService, private dictHttpService: DictHttpService, private dialog: MatDialog) {}

    dropTables(): void {
        this.dialog
            .open(AlertDialogComponent, {
                width: '250px',
                data: {
                    message: `
                    Attention si vous continuez, vous aller perdre toutes les données de la base de données.
                    Voullez-vous continuer le processus?`,
                    button1: 'Non',
                    button2: 'Oui',
                },
            })
            .afterClosed()
            .subscribe(async (ans) => {
                if (ans === true) {
                    const isJvDropOk = await this.dropJvTable();
                    const isDictOk = await this.dropDictTable();
                    if (!isJvDropOk && !isDictOk) {
                        this.dialog.open(AlertDialogComponent, {
                            width: '250px',
                            data: { message: 'Une erreur est survenue avec la base de données', button1: 'Ok', button2: '' },
                        });
                    }
                }
            });
    }

    private async dropJvTable() {
        return new Promise<boolean>((resolve) => {
            this.joueurVirtuelHttpService.dropTable().subscribe((res) => {
                const ans = JSON.parse(res.toString());
                resolve(ans);
            });
        });
    }

    private async dropDictTable() {
        return new Promise<boolean>((resolve) => {
            // TODO change this when dictHttpService will be implemented
            resolve(this.dictHttpService.dropTable());
        });
    }
}
