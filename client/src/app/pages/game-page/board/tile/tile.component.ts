import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '@app/GameLogic/game/tile';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {
    @Input() tile: Tile = new Tile();

    class: string = '';
    multiplicatorType: string = '';
    numberMultiplicator: string = '';
    ngOnInit() {
        if (this.tile.letterMultiplicator !== 1) {
            this.class = `letterX${this.tile.letterMultiplicator}`;
            this.multiplicatorType = 'lettre';
        } else if (this.tile.wordMultiplicator !== 1) {
            this.class = `wordX${this.tile.wordMultiplicator}`;
            this.multiplicatorType = 'mot';
        }
        if (this.tile.wordMultiplicator === 2 || this.tile.letterMultiplicator === 2) {
            this.numberMultiplicator = 'X2';
        }
        if (this.tile.wordMultiplicator === 3 || this.tile.letterMultiplicator === 3) {
            this.numberMultiplicator = 'X3';
        }
    }
}
