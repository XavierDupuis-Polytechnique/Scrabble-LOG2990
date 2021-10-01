import { Component } from '@angular/core';
import imagesData from 'src/assets/preload-images.json';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    path: string = '/assets/img/';
    images: string[];
    constructor() {
        this.images = imagesData.map((img) => this.path + img);
    }
}
