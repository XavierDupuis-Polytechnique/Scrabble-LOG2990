import { TestBed } from '@angular/core/testing';
import { PRIVATE_OBJECTIVE_COUNT, PUBLIC_OBJECTIVE_COUNT } from '@app/game-logic/constants';
import { PlayerProgression } from '@app/game-logic/game/games/online-game/game-state';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { ObjectiveConverter } from '@app/game-logic/game/objectives/objective-converter/objective-converter';
import { ObjectiveCreator } from '@app/game-logic/game/objectives/objective-creator/objective-creator.service';
import { ObjectiveType } from '@app/game-logic/game/objectives/objective-creator/objective-type';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { HalfAlphabetProgression, TenWordsProgression, TransitionObjective } from '@app/game-logic/game/objectives/objectives/transition-objectives';
import { Player } from '@app/game-logic/player/player';

describe('ObjectiveConverter', () => {
    let objectiveConverter: ObjectiveConverter;
    let game: SpecialOfflineGame;
    let objectiveNotifier: ObjectiveNotifierService;

    let transitionObjectives: TransitionObjective[] = [];
    const player1 = { name: 'player1name' } as Player;
    const player2 = { name: 'player2name' } as Player;
    beforeEach(() => {
        transitionObjectives = [];
        objectiveConverter = TestBed.inject(ObjectiveConverter);
        const players = [player1, player2];
        const objectiveCreator = new ObjectiveCreator(objectiveNotifier);
        game = {
            publicObjectives: [],
            privateObjectives: new Map<string, Objective[]>(),
            players,
            objectiveCreator,
        } as unknown as SpecialOfflineGame;

        const tenWordsCount = 5;
        const playerProgression1: PlayerProgression = {
            playerName: player1.name,
            progression: 0,
        };
        const playerProgression1TenWords: PlayerProgression = {
            playerName: player1.name,
            progression: tenWordsCount,
        };
        const playerProgression2TenWords: PlayerProgression = {
            playerName: player2.name,
            progression: tenWordsCount,
        };
        const playerProgression2: PlayerProgression = {
            playerName: player2.name,
            progression: 0,
        };
        const halfAlphabetProgression1: HalfAlphabetProgression = {
            playerName: player1.name,
            placedLetters: ['a', 'b', 'c'],
        };
        const halfAlphabet2Progression2: HalfAlphabetProgression = {
            playerName: player2.name,
            placedLetters: ['d', 'e', 'f'],
        };
        const tenWordsProgression1: TenWordsProgression = {
            playerName: player1.name,
            wordCount: tenWordsCount,
        };
        const tenWordsProgression2: TenWordsProgression = {
            playerName: player2.name,
            wordCount: tenWordsCount,
        };

        const halfAlphabet: TransitionObjective = {
            description: 'description',
            objectiveType: ObjectiveType.HalfAlphabet,
            name: '',
            points: 0,
            owner: undefined,
            progressions: [playerProgression1, playerProgression2],
            placedLetters: [halfAlphabetProgression1, halfAlphabet2Progression2],
        };

        const fourCorners: TransitionObjective = {
            description: 'description',
            objectiveType: ObjectiveType.FourCorners,
            name: '',
            points: 0,
            owner: undefined,
            progressions: [playerProgression1],
        };

        const tenWords: TransitionObjective = {
            description: 'description',
            objectiveType: ObjectiveType.TenWords,
            name: '',
            points: 0,
            owner: undefined,
            progressions: [playerProgression1TenWords, playerProgression2TenWords],
            wordCounts: [tenWordsProgression1, tenWordsProgression2],
        };
        transitionObjectives.push(halfAlphabet);
        transitionObjectives.push(fourCorners);
        transitionObjectives.push(tenWords);
    });

    it('should create appropriate number of public objectives', () => {
        objectiveConverter.convertTransitionObjectives(game, transitionObjectives, player1.name, 'Bot');
        expect(game.publicObjectives.length).toEqual(PUBLIC_OBJECTIVE_COUNT);
    });

    it('should create appropriate number of private objectives', () => {
        objectiveConverter.convertTransitionObjectives(game, transitionObjectives, player1.name, 'Bot');
        expect(game.privateObjectives.size).toEqual(PRIVATE_OBJECTIVE_COUNT);
    });

    it('should create appropriate number of private objectives', () => {
        transitionObjectives = [];
        const playerProgression2: PlayerProgression = {
            playerName: player2.name,
            progression: 0,
        };
        const fourCorners: TransitionObjective = {
            description: 'description',
            objectiveType: ObjectiveType.FourCorners,
            name: '',
            points: 0,
            owner: undefined,
            progressions: [playerProgression2],
        };
        transitionObjectives.push(fourCorners);
        objectiveConverter.convertTransitionObjectives(game, transitionObjectives, player1.name, 'Bot');
        expect(game.privateObjectives.size).toEqual(PRIVATE_OBJECTIVE_COUNT);
    });
});
