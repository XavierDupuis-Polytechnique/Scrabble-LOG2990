import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoldPipe } from '@app/components/bold-pipe/bold.pipe';
import { HeaderBarComponent } from '@app/components/header-bar/header-bar.component';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ClickAndClickoutDirective } from '@app/directives/click-and-clickout.directive';
import { MouseRollDirective } from '@app/directives/mouse-roll.directive';
import { PreventContextMenuDirective } from '@app/directives/prevent-context-menu.directive';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { GameLogicModule } from '@app/GameLogic/game-logic.module';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';
import { BoardComponent } from '@app/pages/game-page/board/board.component';
import { ChatBoxComponent } from '@app/pages/game-page/chat-box/chat-box.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { HorseComponent } from '@app/pages/game-page/horse/horse.component';
import { InfoBoxComponent } from '@app/pages/game-page/info-box/info-box.component';
import { PlayerInfoComponent } from '@app/pages/game-page/player-info/player-info.component';
import { HomepageComponent } from '@app/pages/homepage/homepage.component';
import { LeaderboardComponent } from '@app/pages/leaderboard/leaderboard.component';
import { Log2990GameComponent } from '@app/pages/log2990-game/log2990-game.component';

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
        SidebarComponent,
        PlayerInfoComponent,
        InfoBoxComponent,
        ChatBoxComponent,
        BoardComponent,
        HorseComponent,
        NewSoloGameFormComponent,
        HomepageComponent,
        ClassicGameComponent,
        Log2990GameComponent,
        LeaderboardComponent,
        HeaderBarComponent,
        BoldPipe,
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
