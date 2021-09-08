import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent implements OnInit {
    hideSoloGameForm: boolean = true;
    ngOnInit(): void {
        return;
    }

    openSoloGameForm() {
        this.hideSoloGameForm = false;
    }

    closeSoloGameForm() {
        this.hideSoloGameForm = true;
        console.log("hidden");
    }
}
