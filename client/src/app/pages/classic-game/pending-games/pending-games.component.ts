import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GameSettingsMulti } from '@app/modeMulti/interface/game-settings-multi.interface';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-pending-games',
    templateUrl: './pending-games.component.html',
    styleUrls: ['./pending-games.component.scss'],
})
export class PendingGamesComponent implements AfterContentChecked, OnInit {
    columnsToDisplay = ['id', 'playerName', 'randomBonus', 'timePerTurn'];
    dataSource = new MatTableDataSource<GameSettingsMulti>();
    columns = [
        {
            columnDef: 'id',
            header: 'Id',
            cell: (form: GameSettingsMulti) => `${form.id}`,
        },
        {
            columnDef: 'playerName',
            header: 'Joueur 1',
            cell: (form: GameSettingsMulti) => `${form.playerName}`,
        },
        {
            columnDef: 'randomBonus',
            header: 'Bonus Aléatoire',
            cell: (form: GameSettingsMulti) => `${form.randomBonus}`,
        },
        {
            columnDef: 'timePerTurn',
            header: 'Temps par tour',
            cell: (form: GameSettingsMulti) => `${form.timePerTurn}`,
        },
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: GameSettingsMulti,
        private dialogRef: MatDialogRef<PendingGamesComponent>,
        private cdref: ChangeDetectorRef,
        private onlineSocketHandler: OnlineGameInitService,
    ) {}

    ngOnInit() {
        this.pendingGames$.subscribe((gameSettings) => {
            this.dataSource.data = gameSettings;
            console.log(gameSettings);
        });
        this.onlineSocketHandler.connect(); // TODO change in socketHandler
        this.onlineSocketHandler.listenForPendingGames();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    cancel(): void {
        this.dialogRef.close();
    }
    get pendingGames$(): BehaviorSubject<GameSettingsMulti[]> {
        return this.onlineSocketHandler.pendingGames$;
    }
}
