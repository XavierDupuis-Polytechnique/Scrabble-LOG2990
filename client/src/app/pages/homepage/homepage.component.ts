import { Component, OnInit } from '@angular/core';
import { User } from '@app/GameLogic/player/user';


@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {

    ngOnInit(): void {
        let user:User = new User("test");
        user.hello();
        return;
    }
}
