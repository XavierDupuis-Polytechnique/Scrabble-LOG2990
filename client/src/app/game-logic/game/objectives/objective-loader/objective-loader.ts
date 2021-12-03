import { Injectable } from '@angular/core';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { PlayerNames } from '@app/game-logic/game/objectives/objective-loader/players-names.interface';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { ObjectiveType } from '@app/game-logic/game/objectives/objective-creator/objective-type';
import { HalfAlphabet } from '@app/game-logic/game/objectives/objectives/half-alphabet/half-alphabet';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';
import { TransitionObjective } from '@app/game-logic/game/objectives/objectives/transition-objectives';

@Injectable({
    providedIn: 'root',
})
export class ObjectiveLoader {
    constructor(private objectiveCreator: ObjectiveCreator) {}

    loadObjectivesIntoGame(game: SpecialOfflineGame, transitionObjectives: TransitionObjective[], playerNames: PlayerNames) {
        const userName = playerNames.userName;
        const botName = playerNames.botName;
        game.privateObjectives = new Map<string, Objective[]>();
        game.publicObjectives = [];

        for (const transitionObjective of transitionObjectives) {
            const progressions = transitionObjective.progressions;
            let objective = this.objectiveCreator.createObjective(transitionObjective.objectiveType);
            objective.progressions = new Map<string, number>();
            objective.owner = transitionObjective.owner;
            objective = this.transitionHalfAlphabetLetters(game, transitionObjective, objective);
            objective = this.transitionTenWords(game, transitionObjective, objective);

            progressions.forEach((player) => {
                if (player.playerName === userName) {
                    objective.progressions.set(userName, player.progression);
                } else {
                    objective.progressions.set(botName, player.progression);
                }
            });

            if (progressions.length === 2) {
                game.publicObjectives.push(objective);
            } else {
                const privateObjectives: Objective[] = [];
                privateObjectives.push(objective);
                if (progressions[0].playerName === userName) {
                    game.privateObjectives.set(userName, privateObjectives);
                } else {
                    game.privateObjectives.set(botName, privateObjectives);
                }
            }
        }
    }

    private transitionHalfAlphabetLetters(game: SpecialOfflineGame, transition: TransitionObjective, objective: Objective) {
        if (!transition.placedLetters) {
            return objective;
        }
        (objective as HalfAlphabet).placedLetters = new Map<string, Set<string>>();

        for (const halfAlphabet of transition.placedLetters) {
            const placedLetters = new Set<string>();
            halfAlphabet.placedLetters.map((letter) => placedLetters.add(letter));
            if (halfAlphabet.playerName === game.players[0].name) {
                (objective as HalfAlphabet).placedLetters.set(halfAlphabet.playerName, placedLetters);
            } else {
                (objective as HalfAlphabet).placedLetters.set(game.players[1].name, placedLetters);
            }
        }
        return objective;
    }

    private transitionTenWords(game: SpecialOfflineGame, transition: TransitionObjective, objective: Objective) {
        if (transition.objectiveType === ObjectiveType.TenWords && transition.wordCounts) {
            (objective as TenWords).wordCounts = new Map<string, number>();
            for (const wordCount of transition.wordCounts) {
                if (wordCount.playerName === game.players[0].name) {
                    (objective as TenWords).wordCounts.set(wordCount.playerName, wordCount.wordCount);
                } else {
                    (objective as TenWords).wordCounts.set(game.players[1].name, wordCount.wordCount);
                }
            }
        }
        return objective;
    }
}
