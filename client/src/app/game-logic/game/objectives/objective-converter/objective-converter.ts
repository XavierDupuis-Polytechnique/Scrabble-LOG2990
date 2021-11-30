import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { ObjectiveType } from '@app/game-logic/game/objectives/objective-creator/objective-type';
import { HalfAlphabet } from '@app/game-logic/game/objectives/objectives/half-alphabet/half-alphabet';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';
import { TransitionObjectives } from '@app/game-logic/game/objectives/objectives/transition-objectives';

export class ObjectiveConverter {
    constructor(private game: SpecialOfflineGame) {}

    transitionObjectives(transitionObjectives: TransitionObjectives[], userName: string, botName: string) {
        this.game.privateObjectives = new Map<string, Objective[]>();
        this.game.publicObjectives = [];

        for (const transitionObjective of transitionObjectives) {
            const progressions = transitionObjective.progressions;
            let objective = this.game.objectiveCreator.createObjective(transitionObjective.objectiveType);
            objective.progressions = new Map<string, number>();
            objective.owner = transitionObjective.owner;
            objective = this.transitionHalfAlphabetLetters(transitionObjective, objective);
            objective = this.transitionTenWords(transitionObjective, objective);
            progressions.forEach((player) => {
                if (player.playerName === userName) {
                    objective.progressions.set(userName, player.progression);
                } else {
                    objective.progressions.set(botName, player.progression);
                }
            });

            if (progressions.length === 2) {
                this.game.publicObjectives.push(objective);
            } else {
                const privateObjectives: Objective[] = [];
                privateObjectives.push(objective);
                if (progressions[0].playerName === userName) {
                    this.game.privateObjectives.set(userName, privateObjectives);
                } else {
                    this.game.privateObjectives.set(botName, privateObjectives);
                }
            }
        }
    }

    private transitionHalfAlphabetLetters(transition: TransitionObjectives, objective: Objective) {
        if (transition.placedLetters === undefined) {
            return objective;
        }

        for (const halfAlphabet of transition.placedLetters) {
            const placedLetters = new Set<string>();
            halfAlphabet.placedLetters.map((letter) => placedLetters.add(letter));
            if (halfAlphabet.playerName === this.game.players[0].name) {
                (objective as HalfAlphabet).placedLetters.set(halfAlphabet.playerName, placedLetters);
            } else {
                (objective as HalfAlphabet).placedLetters.set(this.game.players[1].name, placedLetters);
            }
        }
        return objective;
    }

    private transitionTenWords(transition: TransitionObjectives, objective: Objective) {
        if (transition.objectiveType === ObjectiveType.TenWords && transition.wordCounts) {
            for (const wordCount of transition.wordCounts) {
                if (wordCount.playerName === this.game.players[0].name) {
                    (objective as TenWords).wordCounts.set(wordCount.playerName, wordCount.wordCount);
                } else {
                    (objective as TenWords).wordCounts.set(this.game.players[1].name, wordCount.wordCount);
                }
            }
        }
        return objective;
    }
}
