import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waiting-for-player',
  templateUrl: './waiting-for-player.component.html',
  styleUrls: ['./waiting-for-player.component.scss']
})
export class WaitingForPlayerComponent implements OnInit {
  spinnerStrokeWidth = 7;
  spinnerDiameter = 40;

  constructor() {}

  ngOnInit(): void {
  }
  convertToModeSolo() {

  }
  cancel() {}
}
