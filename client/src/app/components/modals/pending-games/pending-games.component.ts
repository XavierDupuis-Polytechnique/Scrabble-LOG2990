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
    columnsToDisplay = ['id', 'playerName', 'randomBonus', 'timePerTurn'];
    selectedRow: OnlineGameSettings | undefined;
    dataSource = new MatTableDataSource<OnlineGameSettings>();
    columns: { columnDef: string; header: string; cell: (form: OnlineGameSettings) => string }[];
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
            },
            {
                columnDef: 'playerName',
                header: 'Joueur 1',
                cell: (form: OnlineGameSettings) => `${form.playerName}`,
            },
            {
                columnDef: 'randomBonus',
                header: 'Bonus Aléatoire',
                cell: (form: OnlineGameSettings) => (form.randomBonus === true ? 'activé' : 'désactivé'),
            },
            {
                columnDef: 'timePerTurn',
                header: 'Temps par tour',
                cell: (form: OnlineGameSettings) => `${this.datePipe.transform(form.timePerTurn, 'm:ss')} `,
            },
        ];
    }

    ngOnInit() {
        this.pendingGames$.subscribe((gameSettings) => {
            this.dataSource.data = gameSettings;
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
