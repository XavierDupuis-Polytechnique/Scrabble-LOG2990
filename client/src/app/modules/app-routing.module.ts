import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { HomepageComponent } from '@app/pages/homepage/homepage.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'new-game', component: ClassicGameComponent },
    { path: 'leaderboard', component: HomepageComponent },
    { path: 'game', component: GamePageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
