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
                    message: 'Le nom du joueur virtuel est déjà utilisé',
                    button1: 'Non',
                    button2: 'Oui',
                },
            })
            .afterClosed()
            .subscribe((ans) => {
                if (ans === true) {
                    this.joueurVirtuelHttpService.dropTalbe();
                    this.dictHttpService.dropTable();
                }
            });
    }
}
