import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDictDialogComponent } from '@app/components/modals/add-dict-dialog/add-dict-dialog.component';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { Dictionary } from '@app/game-logic/validator/dictionary';
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
    listDict: Dictionary[];
    selectedFile: string = '';
    displayedColumns: string[] = ['position', 'name', 'weight', 'edit', 'delete'];

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
        this.dictHttpService.deleteDict(dict.title).subscribe(() => {
            this.updateDictMap();
        })
    }

    private updateDictMap(): void {
        this.dictHttpService.getDictInfoList().subscribe((res) => {
            const list = res as DictInfo[];
            this.dictDataSource = list;
        });
    }
}
