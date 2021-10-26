import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { HomepageComponent } from '@app/pages/homepage/homepage.component';
import { LeaderboardComponent } from '@app/pages/leaderboard/leaderboard.component';
import { Log2990GameComponent } from '@app/pages/log2990-game/log2990-game.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'classic', component: ClassicGameComponent },
    { path: 'log2990', component: Log2990GameComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: 'game', component: GamePageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
