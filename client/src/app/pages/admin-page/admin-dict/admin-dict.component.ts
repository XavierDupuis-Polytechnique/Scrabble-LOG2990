import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDictDialogComponent } from '@app/components/modals/add-dict-dialog/add-dict-dialog.component';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { MAX_FILE_LENGTH } from '@app/game-logic/constants';
import { dictionaryToDownloadedDict, openErrorDialog } from '@app/game-logic/utils';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictHttpService } from '@app/services/dict-http.service';

export interface DictInfo {
    title: string;
    description: string;
    canEdit: boolean;
}

export interface DownloadedDict {
    title: string;
    description: string;
    words: string[];
}

@Component({
    selector: 'app-admin-dict',
    templateUrl: './admin-dict.component.html',
    styleUrls: ['./admin-dict.component.scss'],
})
export class AdminDictComponent implements OnInit {
    @ViewChild('downloadAncher') downloadRef: ElementRef;
    dictDataSource: DictInfo[];
    dictDisplayedColumns: string[] = ['title', 'description', 'edit', 'delete', 'download'];

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

    async downloadDict(dict: DictInfo) {
        this.dictHttpService.getDict(dict.title).subscribe(
            (response) => {
                const downloadedDict = dictionaryToDownloadedDict(response as Dictionary);

                const dictStringified = JSON.stringify(downloadedDict);
                const blob = new Blob([dictStringified], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const downloadAncher = this.downloadRef.nativeElement as HTMLAnchorElement;
                downloadAncher.href = url;
                const title = downloadedDict.title.replace(/\s/g, '').slice(0, MAX_FILE_LENGTH);
                downloadAncher.download = title;
                downloadAncher.click();
            },
            () => {
                return;
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
