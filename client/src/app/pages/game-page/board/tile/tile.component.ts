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

    ngOnInit() {
        if (this.tile.letterMultiplicator !== 1) {
            this.class = `letterX${this.tile.letterMultiplicator}`;
        } else if (this.tile.wordMultiplicator !== 1) {
            this.class = `wordX${this.tile.wordMultiplicator}`;
        }
    }
}
