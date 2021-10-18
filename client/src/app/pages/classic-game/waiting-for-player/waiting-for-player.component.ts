import { Component } from '@angular/core';

@Component({
  selector: 'app-waiting-for-player',
  templateUrl: './waiting-for-player.component.html',
  styleUrls: ['./waiting-for-player.component.scss'],
})
export class WaitingForPlayerComponent {
  spinnerStrokeWidth = 7;
  spinnerDiameter = 40;
  toModeSolo = false;
  // constructor() {}
  convertToModeSolo() {
    this.toModeSolo = true;
  }
}
