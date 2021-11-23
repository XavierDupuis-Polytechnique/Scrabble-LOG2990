import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JoinOnlineGameComponent } from '@app/components/modals/join-online-game/join-online-game.component';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { NewOnlineGameSocketHandler } from '@app/socket-handler/new-online-game-socket-handler/new-online-game-socket-handler.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-pending-games',
    templateUrl: './pending-games.component.html',
    styleUrls: ['./pending-games.component.scss'],
})
export class PendingGamesComponent implements AfterContentChecked, OnInit, AfterViewInit {
    @ViewChild(MatSort) tableSort: MatSort;
    columnsToDisplay = ['id', 'playerName', 'randomBonus', 'timePerTurn', 'dictionary'];
    selectedRow: OnlineGameSettings | undefined;
    dataSource = new MatTableDataSource<OnlineGameSettings>();
    columns: {
        columnDef: string;
        header: string;
        cell: (form: OnlineGameSettings) => string;
        tooltip: (form: OnlineGameSettings, columnDef: string) => string;
    }[];
    datePipe = new DatePipe('en_US');
    constructor(
        @Inject(MAT_DIALOG_DATA) public gameMode: GameMode,
        private dialogRef: MatDialogRef<PendingGamesComponent>,
        private dialog: MatDialog,
        private cdref: ChangeDetectorRef,
        private onlineSocketHandler: NewOnlineGameSocketHandler,
        private liveAnnouncer: LiveAnnouncer,
    ) {
        this.columns = [
            {
                columnDef: 'id',
                header: 'Id',
                cell: (form: OnlineGameSettings) => `${form.id}`,
                tooltip: (form: OnlineGameSettings, columnDef: string) => this.getToolTip(form, columnDef),
            },
            {
                columnDef: 'playerName',
                header: 'Joueur 1',
                cell: (form: OnlineGameSettings) => `${form.playerName}`,
                tooltip: (form: OnlineGameSettings, columnDef: string) => this.getToolTip(form, columnDef),
            },
            {
                columnDef: 'randomBonus',
                header: 'Bonus Aléatoire',
                cell: (form: OnlineGameSettings) => (form.randomBonus === true ? 'activé' : 'désactivé'),
                tooltip: (form: OnlineGameSettings, columnDef: string) => this.getToolTip(form, columnDef),
            },
            {
                columnDef: 'dictionary',
                header: 'Dictionnaire utilisé',
                cell: (form: OnlineGameSettings) => `${form.dictTitle}`,
                tooltip: (form: OnlineGameSettings, columnDef: string) => this.getToolTip(form, columnDef),
            },
            {
                columnDef: 'timePerTurn',
                header: 'Temps par tour',
                cell: (form: OnlineGameSettings) => `${this.datePipe.transform(form.timePerTurn, 'm:ss')} `,
                tooltip: (form: OnlineGameSettings, columnDef: string) => this.getToolTip(form, columnDef),
            },
        ];
    }
    getToolTip(form: OnlineGameSettings, columnDef: string): string {
        if (columnDef === 'dictionary') {
            return form.dictDesc as string;
        }
        return '';
    }

    ngOnInit() {
        this.pendingGames$.subscribe((gameSettings) => {
            const filteredGameSettings = gameSettings.filter((gameSetting) => gameSetting.gameMode === this.gameMode);
            this.dataSource.data = filteredGameSettings;
        });
        this.onlineSocketHandler.listenForPendingGames();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.tableSort;
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    cancel(): void {
        this.dialogRef.close();
    }

    setSelectedRow(row: OnlineGameSettings) {
        if (this.selectedRow === row) {
            this.selectedRow = undefined;
        } else {
            this.selectedRow = row;
        }
    }

    joinGame() {
        const joinPendingGameRef = new MatDialogConfig();
        joinPendingGameRef.autoFocus = true;
        joinPendingGameRef.disableClose = true;
        joinPendingGameRef.data = this.selectedRow;
        const joinPendingGame = this.dialog.open(JoinOnlineGameComponent, joinPendingGameRef);
        joinPendingGame.beforeClosed().subscribe((name) => {
            if (name) {
                this.dialogRef.close(name);
            }
        });
    }

    isSelectedRow(row: OnlineGameSettings) {
        return row === this.selectedRow;
    }

    get pendingGames$(): BehaviorSubject<OnlineGameSettings[]> {
        return this.onlineSocketHandler.pendingGames$;
    }

    announceSortChange(sortState: Sort) {
        this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    }
}
