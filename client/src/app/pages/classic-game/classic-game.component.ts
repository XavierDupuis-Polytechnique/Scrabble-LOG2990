import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent {
    hideSoloGameForm: boolean = true;
    constructor(private router: Router) {}

    openSoloGameForm() {
        this.hideSoloGameForm = false;
    }

    closeSoloGameForm() {
        this.hideSoloGameForm = true;
    }

    startSoloGame() {
        this.router.navigate(['/game']);
    }
}
