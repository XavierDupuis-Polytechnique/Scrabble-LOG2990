import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderBarComponent } from '@app/components/header-bar/header-bar.component';
import { AbandonDialogComponent } from '@app/components/modals/abandon-dialog/abandon-dialog.component';
import { ConvertToSoloFormComponent } from '@app/components/modals/convert-to-solo-form/convert-to-solo-form.component';
import { DisconnectedFromServerComponent } from '@app/components/modals/disconnected-from-server/disconnected-from-server.component';
import { ErrorDialogComponent } from '@app/components/modals/error-dialog/error-dialog.component';
import { JoinOnlineGameComponent } from '@app/components/modals/join-online-game/join-online-game.component';
import { LeaderboardComponent } from '@app/components/modals/leaderboard/leaderboard.component';
import { NewOnlineGameFormComponent } from '@app/components/modals/new-online-game-form/new-online-game-form.component';
import { NewSoloGameFormComponent } from '@app/components/modals/new-solo-game-form/new-solo-game-form.component';
import { PendingGamesComponent } from '@app/components/modals/pending-games/pending-games.component';
import { WaitingForPlayerComponent } from '@app/components/modals/waiting-for-player/waiting-for-player.component';
import { ClickAndClickoutDirective } from '@app/directives/click-and-clickout.directive';
import { MouseRollDirective } from '@app/directives/mouse-roll.directive';
import { PreventContextMenuDirective } from '@app/directives/prevent-context-menu.directive';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminBotComponent } from '@app/pages/admin-page/admin-bot-virtuel/admin-bot.component';
import { AdminDictComponent } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { AppComponent } from '@app/pages/app/app.component';
import { BoardComponent } from '@app/pages/game-page/board/board.component';
import { ChatBoxComponent } from '@app/pages/game-page/chat-box/chat-box.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { HorseComponent } from '@app/pages/game-page/horse/horse.component';
import { InfoBoxComponent } from '@app/pages/game-page/info-box/info-box.component';
import { ObjectiveComponent } from '@app/pages/game-page/objectives/objective-component/objective.component';
import { PlayerInfoComponent } from '@app/pages/game-page/player-info/player-info.component';
import { HomepageComponent } from '@app/pages/homepage/homepage.component';
import { NewGamePageComponent } from '@app/pages/new-game-page/new-game-page.component';
import { BoldPipe } from '@app/pipes/bold-pipe/bold.pipe';
import { AddDictDialogComponent } from './components/modals/add-dict-dialog/add-dict-dialog.component';
import { AlertDialogComponent } from './components/modals/alert-dialog/alert-dialog.component';
import { EditBotDialogComponent } from './components/modals/edit-bot-dialog/edit-bot-dialog.component';
import { EditDictDialogComponent } from './components/modals/edit-dict/edit-dict.component';
import { LoadingGameComponent } from './components/modals/loading-game/loading-game.component';
import { WinnerDialogComponent } from './components/modals/winner-dialog/winner-dialog.component';
import { AdminDropDbComponent } from './pages/admin-page/admin-drop-db/admin-drop-db.component';
import { ObjectivesListComponent } from './pages/game-page/objectives/objectives-list.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        AdminDictComponent,
        GamePageComponent,
        PlayerInfoComponent,
        InfoBoxComponent,
        ChatBoxComponent,
        BoardComponent,
        HorseComponent,
        NewSoloGameFormComponent,
        NewOnlineGameFormComponent,
        HomepageComponent,
        NewGamePageComponent,
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
        LeaderboardComponent,
        PreventContextMenuDirective,
        ClickAndClickoutDirective,
        MouseRollDirective,
        AdminPageComponent,
        EditDictDialogComponent,
        AlertDialogComponent,
        AdminBotComponent,
        EditBotDialogComponent,
        AdminDropDbComponent,
        ObjectivesListComponent,
        ObjectiveComponent,
        AddDictDialogComponent,
        AbandonDialogComponent,
        LoadingGameComponent,
        WinnerDialogComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatTableModule,
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
