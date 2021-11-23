/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable deprecation/deprecation */
import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '@app/modules/app-routing.module';
import { AppComponent } from '@app/pages/app/app.component';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';
import { HomepageComponent } from '@app/pages/homepage/homepage.component';

describe('Router: App', () => {
    let location: Location;
    let router: Router;
    let fixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
            declarations: [HomepageComponent, ClassicGameComponent],
        });

        router = TestBed.get(Router);
        location = TestBed.get(Location);

        fixture = TestBed.createComponent(AppComponent);
        router.initialNavigation();
        fixture.detectChanges();
    });

    it('fakeAsync works', fakeAsync(() => {
        const promise = new Promise((resolve) => {
            setTimeout(resolve, 10);
        });
        let done = false;
        promise.then(() => (done = true));
        tick(50);
        expect(done).toBeTruthy();
    }));

    it('navigate to "" redirects you to /home', fakeAsync(() => {
        router.navigate(['']).then(() => {
            tick(1);
            expect(location.path()).toBe('/home');
        });
    }));

    it('navigate to "home" redirects you to /home', fakeAsync(() => {
        router.navigate(['/home']).then(() => {
            tick(1);
            expect(location.path()).toBe('/home');
        });
    }));

    it('navigate to "notAValidRoute" redirects you to /home', fakeAsync(() => {
        router.navigate(['/notAValidRoute']).then(() => {
            tick(1);
            expect(location.path()).toBe('/home');
        });
    }));

    it('navigate to "new-game" takes you to /new-game', fakeAsync(() => {
        router.navigate(['/new-game']).then(() => {
            tick(1);
            expect(location.path()).toBe('/new-game');
        });
    }));

    it('navigate to "leaderboard" takes you to /leaderboard', fakeAsync(() => {
        router.navigate(['/leaderboard']).then(() => {
            tick(1);
            expect(location.path()).toBe('/leaderboard');
        });
    }));
});
