import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDictComponent } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { AdminJvComponent } from '@app/pages/admin-page/admin-jv/admin-jv.component';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { HomepageComponent } from '@app/pages/homepage/homepage.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'classic', component: ClassicGameComponent },
    { path: 'log2990', component: HomepageComponent },
    { path: 'leaderboard', component: HomepageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: 'admin/dict', component: AdminDictComponent },
    { path: 'admin/jv', component: AdminJvComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
