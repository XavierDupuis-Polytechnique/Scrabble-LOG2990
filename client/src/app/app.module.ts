import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderBarComponent } from '@app/components/header-bar/header-bar.component';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { ClickAndClickoutDirective } from '@app/directives/click-and-clickout.directive';
import { MouseRollDirective } from '@app/directives/mouse-roll.directive';
import { PreventContextMenuDirective } from '@app/directives/prevent-context-menu.directive';
import { CommandExecuterService } from '@app/GameLogic/commands/command-executer/command-executer.service';
import { GameLogicModule } from '@app/GameLogic/game-logic.module';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';
import { ConvertToSoloFormComponent } from '@app/pages/classic-game/modals/convert-to-solo-form/convert-to-solo-form.component';
import { ErrorDialogComponent } from '@app/pages/classic-game/modals/error-dialog/error-dialog.component';
import { JoinOnlineGameComponent } from '@app/pages/classic-game/modals/join-online-game/join-online-game.component';
import { NewOnlineGameFormComponent } from '@app/pages/classic-game/modals/new-online-game-form/new-online-game-form.component';
import { PendingGamesComponent } from '@app/pages/classic-game/modals/pending-games/pending-games.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { BoldPipe } from '@app/pipes/bold-pipe/bold.pipe';
import { DisconnectedFromServerComponent } from './pages/classic-game/modals/disconnected-from-server/disconnected-from-server.component';
import { WaitingForPlayerComponent } from './pages/classic-game/modals/waiting-for-player/waiting-for-player.component';
import { BoardComponent } from './pages/game-page/board/board.component';
import { ChatBoxComponent } from './pages/game-page/chat-box/chat-box.component';
import { HorseComponent } from './pages/game-page/horse/horse.component';
import { InfoBoxComponent } from './pages/game-page/info-box/info-box.component';
import { PlayerInfoComponent } from './pages/game-page/player-info/player-info.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

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
        PlayerInfoComponent,
        InfoBoxComponent,
        ChatBoxComponent,
        BoardComponent,
        HorseComponent,
        NewSoloGameFormComponent,
        NewOnlineGameFormComponent,
        HomepageComponent,
        ClassicGameComponent,
        HeaderBarComponent,
        BoldPipe,
        PreventContextMenuDirective,
        ClickAndClickoutDirective,
        MouseRollDirective,
        WaitingForPlayerComponent,
        ConvertToSoloFormComponent,
        PendingGamesComponent,
        JoinOnlineGameComponent,
        DisconnectedFromServerComponent,
        ErrorDialogComponent,
        PreventContextMenuDirective,
        ClickAndClickoutDirective,
        MouseRollDirective,
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
