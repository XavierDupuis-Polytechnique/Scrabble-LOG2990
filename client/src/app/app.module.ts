import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoldPipe } from '@app/components/bold-pipe/bold.pipe';
import { NewOnlineGameFormComponent } from '@app/components/new-online-game-form/new-online-game-form.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { NewSoloGameFormComponent } from './components/new-solo-game-form/new-solo-game-form.component';
import { GameLogicModule } from './GameLogic/game-logic.module';
import { ClassicGameComponent } from './pages/classic-game/classic-game.component';
import { WaitingForPlayerComponent } from './pages/classic-game/waiting-online-game/waiting-for-player/waiting-for-player.component';
import { BoardComponent } from './pages/game-page/board/board.component';
import { TileComponent } from './pages/game-page/board/tile/tile.component';
import { ChatBoxComponent } from './pages/game-page/chat-box/chat-box.component';
import { HorseComponent } from './pages/game-page/horse/horse.component';
import { InfoBoxComponent } from './pages/game-page/info-box/info-box.component';
import { PlayerInfoComponent } from './pages/game-page/player-info/player-info.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { Log2990GameComponent } from './pages/log2990-game/log2990-game.component';
/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MaterialPageComponent,
        SidebarComponent,
        PlayerInfoComponent,
        InfoBoxComponent,
        ChatBoxComponent,
        BoardComponent,
        HorseComponent,
        NewSoloGameFormComponent,
        NewOnlineGameFormComponent,
        HomepageComponent,
        ClassicGameComponent,
        Log2990GameComponent,
        LeaderboardComponent,
        HeaderBarComponent,
        TileComponent,
        BoldPipe,
        WaitingForPlayerComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        GameLogicModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                return () => {
                    return;
                };
            },
            deps: [CommandExecuterService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
