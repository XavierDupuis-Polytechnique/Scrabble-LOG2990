import { Tile } from '@app/game/game-logic/board/tile';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { SpecialServerGame } from '@app/game/game-logic/game/special-server-game';
import {
    ForfeitedGameState,
    GameState,
    LightObjective,
    LightPlayer,
    PlayerProgression,
    PrivateLightObjectives,
    SpecialGameState,
} from '@app/game/game-logic/interface/game-state.interface';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { OnlineObjectiveConverter } from '@app/game/game-logic/objectives/objectives/objective-converter/online-objective-converter';
import { Player } from '@app/game/game-logic/player/player';
import { Service } from 'typedi';

@Service()
export class GameCompiler {
    compile(game: ServerGame): GameState | SpecialGameState {
        const gameState = this.compileGameState(game);
        if (game instanceof SpecialServerGame) {
            return this.compileSpecialGameState(game, gameState);
        }
        return gameState;
    }

    compileForfeited(game: ServerGame): ForfeitedGameState {
        const gameState = this.compile(game);
        const lastGameState = gameState as ForfeitedGameState;
        lastGameState.consecutivePass = game.consecutivePass;
        lastGameState.letterBag = game.letterBag.gameLetters;
        lastGameState.randomBonus = game.randomBonus;
        lastGameState.objectives = this.compileForfeitedObjectives(game);
        return lastGameState;
    }

    private compileForfeitedObjectives(game: ServerGame) {
        if (!(game instanceof SpecialServerGame)) {
            return [];
        }
        const objectiveConverter = new OnlineObjectiveConverter();
        const publicObj = game.publicObjectives;
        const privateObj = game.privateObjectives;
        return objectiveConverter.convertObjectives(publicObj, privateObj);
    }

    private compileGameState(game: ServerGame): GameState {
        const lightPlayers: LightPlayer[] = this.fillPlayer(game.players);
        const activePlayer = game.activePlayerIndex;
        const lightGrid: Tile[][] = game.board.grid;
        let lightEndOfGame = false;
        let lightWinnerIndex: number[] = [];
        if (game.isEndOfGame()) {
            lightEndOfGame = true;
            if (game.getWinner().length === 2) {
                lightWinnerIndex = [0, 1];
            } else if (game.getWinner()[0].name === game.players[0].name) {
                lightWinnerIndex = [0];
            } else {
                lightWinnerIndex = [1];
            }
        } else {
            lightEndOfGame = false;
        }
        return {
            players: lightPlayers,
            activePlayerIndex: activePlayer,
            grid: lightGrid,
            isEndOfGame: lightEndOfGame,
            lettersRemaining: game.letterBag.lettersLeft,
            winnerIndex: lightWinnerIndex,
        };
    }

    private compileSpecialGameState(game: SpecialServerGame, gameState: GameState): SpecialGameState {
        const publicObjectives = this.compilePublicObjectives(game as SpecialServerGame);
        const privateObjectives = this.compilePrivateObjectives(game as SpecialServerGame);
        const specialGameState: SpecialGameState = {
            players: gameState.players,
            activePlayerIndex: gameState.activePlayerIndex,
            grid: gameState.grid,
            isEndOfGame: gameState.isEndOfGame,
            lettersRemaining: gameState.lettersRemaining,
            winnerIndex: gameState.winnerIndex,
            publicObjectives,
            privateObjectives,
        };
        return specialGameState;
    }

    private compilePublicObjectives(specialGame: SpecialServerGame): LightObjective[] {
        const createdLightObjectives: LightObjective[] = [];
        for (const objective of specialGame.publicObjectives) {
            const createdLightObjective = this.compileLightObjective(objective);
            createdLightObjectives.push(createdLightObjective);
        }
        return createdLightObjectives;
    }

    private compilePrivateObjectives(specialGame: SpecialServerGame): PrivateLightObjectives[] {
        const createdPrivateLightObjectives: PrivateLightObjectives[] = [];
        for (const [playerName, objectiveList] of specialGame.privateObjectives) {
            const createdLightObjectives: LightObjective[] = [];
            for (const objective of objectiveList) {
                const createdLightObjective = this.compileLightObjective(objective);
                createdLightObjectives.push(createdLightObjective);
            }
            const privateLightObjectives: PrivateLightObjectives = { playerName, privateObjectives: createdLightObjectives };
            createdPrivateLightObjectives.push(privateLightObjectives);
        }
        return createdPrivateLightObjectives;
    }

    private compileLightObjective(objective: Objective) {
        const progressions: PlayerProgression[] = [];
        for (const [progressionPlayerName, progression] of objective.progressions) {
            progressions.push({ playerName: progressionPlayerName, progression });
        }
        const lightObjective: LightObjective = {
            name: objective.name,
            description: objective.description,
            points: objective.points,
            owner: objective.owner ? objective.owner : undefined,
            progressions,
        };
        return lightObjective;
    }

    private fillPlayer(players: Player[]): LightPlayer[] {
        return [
            { name: players[0].name, points: players[0].points, letterRack: players[0].letterRack },
            { name: players[1].name, points: players[1].points, letterRack: players[1].letterRack },
        ];
    }
}
