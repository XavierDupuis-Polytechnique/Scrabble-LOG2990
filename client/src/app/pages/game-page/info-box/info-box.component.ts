import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {
    public timerLeft: any;
    //TODO:Feed avec PlayerService
    myName = 'Player1';
    myScore = 55;
    activePlayer = 'Bot';
    constructor(/*private readonly timer: TimerService*/) {}
    ngOnInit() {
        // this.timerLeft = this.timer.source;
        // console.log('Info-box: ', this.timerLeft);
        // TODO: doesn't feed timer value..
    }
}
