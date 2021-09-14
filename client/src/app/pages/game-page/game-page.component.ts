import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    boardHeight: number;
    boardWidth: number;

    ngOnInit(): void {
        const myBoard = document.getElementById('gridContainer');
        if (myBoard?.clientWidth !== undefined && myBoard.clientWidth !== undefined) {
            this.boardHeight = myBoard?.clientHeight;
            this.boardWidth = myBoard?.clientWidth;
        }
    }
}
