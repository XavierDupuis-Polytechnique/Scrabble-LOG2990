import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDictDialogComponent } from '@app/components/modals/add-dict-dialog/add-dict-dialog.component';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { openErrorDialog } from '@app/game-logic/utils';
import { DictHttpService } from '@app/services/dict-http.service';

export interface DictInfo {
    title: string;
    description: string;
    canEdit: boolean;
}

@Component({
    selector: 'app-admin-dict',
    templateUrl: './admin-dict.component.html',
    styleUrls: ['./admin-dict.component.scss'],
})
export class AdminDictComponent implements OnInit {
    dictDataSource: DictInfo[];
    dictDisplayedColumns: string[] = ['title', 'description', 'edit', 'delete'];

    constructor(private readonly dictHttpService: DictHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.updateDictMap();
    }

    showUpdateMenu(dict: DictInfo): void {
        this.dialog
            .open(EditDictDialogComponent, { width: '250px', data: dict })
            .afterClosed()
            .subscribe(() => {
                this.updateDictMap();
            });
    }

    showAddMenu(): void {
        this.dialog
            .open(AddDictDialogComponent, {
                width: '250px',
            })
            .afterClosed()
            .subscribe(() => {
                this.updateDictMap();
            });
    }

    async deleteDict(dict: DictInfo) {
        this.dictHttpService.deleteDict(dict.title).subscribe(
            () => {
                this.updateDictMap();
            },
            () => {
                this.updateDictMap();
            },
        );
    }

    private updateDictMap(): void {
        this.dictHttpService.getDictInfoList().subscribe(
            (response) => {
                const list = response as DictInfo[];
                this.dictDataSource = list;
            },
            () => {
                this.openErrorModal('Le connection avec le serveur a échoué');
            },
        );
    }

    private openErrorModal(errorContent: string) {
        openErrorDialog(this.dialog, '250px', errorContent);
    }
}
