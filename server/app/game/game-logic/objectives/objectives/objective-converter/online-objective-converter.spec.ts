/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Action } from '@app/game/game-logic/actions/action';
import { PlayerProgression } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveType } from '@app/game/game-logic/objectives/objective-creator/objective-type';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game/game-logic/objectives/objectives/four-corners/four-corners';
import { HalfAlphabet } from '@app/game/game-logic/objectives/objectives/half-alphabet/half-alphabet';
import { NineLettersWord } from '@app/game/game-logic/objectives/objectives/nine-letters-word/nine-letters-word';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { OnlineObjectiveConverter } from '@app/game/game-logic/objectives/objectives/objective-converter/online-objective-converter';
import {
    HalfAlphabetProgression,
    TenWordsProgression,
    TransitionObjectives,
} from '@app/game/game-logic/objectives/objectives/objective-converter/transition-objectives';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { Palindrome } from '@app/game/game-logic/objectives/objectives/palindrome/palindrome';
import { SameWordTwice } from '@app/game/game-logic/objectives/objectives/same-word-twice/same-word-twice';
import { TenWords } from '@app/game/game-logic/objectives/objectives/ten-words/ten-words';
import { ThreeSameLetters } from '@app/game/game-logic/objectives/objectives/three-same-letters/three-same-letters';
import { TripleBonus } from '@app/game/game-logic/objectives/objectives/triple-bonus/triple-bonus';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';

class ErrorObjective extends Objective {
    // eslint-disable-next-line no-unused-vars
    protected updateProgression(action: Action, params: ObjectiveUpdateParams): void {
        return;
    }
}
describe('OnlineObjectiveConverter', () => {
    const onlineObjectiveConverter = new OnlineObjectiveConverter();
    let stubObjectiveNotifier: StubbedClass<ObjectiveNotifierService>;
    const gameToken = 'gameToken';
    let totalNumberOfObjectives: number;
    let objectives: Objective[];

    beforeEach(() => {
        stubObjectiveNotifier = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
        totalNumberOfObjectives = Object.keys(ObjectiveType).length / 2;
        objectives = [
            new FourCorners(gameToken, stubObjectiveNotifier),
            new TripleBonus(gameToken, stubObjectiveNotifier),
            new Palindrome(gameToken, stubObjectiveNotifier),
            new TenWords(gameToken, stubObjectiveNotifier),
            new NineLettersWord(gameToken, stubObjectiveNotifier),
            new HalfAlphabet(gameToken, stubObjectiveNotifier),
            new SameWordTwice(gameToken, stubObjectiveNotifier),
            new ThreeSameLetters(gameToken, stubObjectiveNotifier),
        ];
    });

    it('should create', () => {
        expect(onlineObjectiveConverter).to.be.instanceOf(OnlineObjectiveConverter);
    });

    it('should create adequate transition objectives', () => {
        const publicObjectives: Objective[] = [];
        const privateObjectives = new Map<string, Objective[]>();
        const expectedTransitionObjectives: TransitionObjectives[] = [];

        for (let i = 0; i < totalNumberOfObjectives; i++) {
            const objective = objectives[i];
            if (i === 0) {
                privateObjectives.set('p1', [objective]);
            } else {
                publicObjectives.push(objective);
            }
            const expectedTransitionObjective: TransitionObjectives = {
                objectiveType: i,
                name: objective.name,
                description: objective.description,
                points: objective.points,
                owner: undefined,
                progressions: [],
            };
            if (i === ObjectiveType.TenWords) {
                expectedTransitionObjective.wordCounts = [];
            }

            if (i === ObjectiveType.HalfAlphabet) {
                expectedTransitionObjective.placedLetters = [];
            }
            expectedTransitionObjectives.push(expectedTransitionObjective);
        }
        const resultTransitionObjectives = onlineObjectiveConverter.convertObjectives(publicObjectives, privateObjectives);
        expect(resultTransitionObjectives).to.be.deep.equal(expectedTransitionObjectives);
    });

    it("should throw error 'objective not in objective type'", () => {
        const unexistingObjective = new ErrorObjective(gameToken, stubObjectiveNotifier);
        const publicObjectives: Objective[] = [];
        const privateObjectives = new Map<string, Objective[]>();
        publicObjectives.push(unexistingObjective);
        privateObjectives.set('p1', [unexistingObjective]);
        expect(() => onlineObjectiveConverter.convertObjectives(publicObjectives, privateObjectives)).to.throw('objective not in objective type');
    });

    it('should set accurate word count', () => {
        const publicObjectives: Objective[] = [];
        const privateObjectives = new Map<string, Objective[]>();
        const tenWords = objectives[3] as TenWords;
        tenWords.wordCounts.set('p1', 0);
        tenWords.progressions.set('p1', 0);
        publicObjectives.push(tenWords);
        privateObjectives.set('p1', [tenWords]);

        const tenWordsProgression: TenWordsProgression = {
            wordCount: 0,
            playerName: 'p1',
        };
        const playerProgression: PlayerProgression = {
            playerName: 'p1',
            progression: 0,
        };
        const expectedTransitionObjective: TransitionObjectives = {
            objectiveType: 3,
            name: tenWords.name,
            description: tenWords.description,
            points: tenWords.points,
            owner: undefined,
            wordCounts: [tenWordsProgression],
            progressions: [playerProgression],
        };

        const testObjective = onlineObjectiveConverter.convertObjectives(publicObjectives, privateObjectives);
        expect(testObjective[0]).to.deep.equal(expectedTransitionObjective);
    });

    it('should set accurate letter placed', () => {
        const publicObjectives: Objective[] = [];
        const privateObjectives = new Map<string, Objective[]>();
        const halfAlphabetLetters = new Set<string>();
        halfAlphabetLetters.add('a');
        const halfAlphabet = objectives[5] as HalfAlphabet;
        halfAlphabet.placedLetters.set('p1', halfAlphabetLetters);
        publicObjectives.push(halfAlphabet);
        privateObjectives.set('p1', [halfAlphabet]);
        halfAlphabet.progressions.set('p1', 1 / 13);

        const halfAlphabetProgression: HalfAlphabetProgression = {
            placedLetters: ['a'],
            playerName: 'p1',
        };
        const playerProgression: PlayerProgression = {
            playerName: 'p1',
            progression: 1 / 13,
        };

        const expectedTransitionObjective: TransitionObjectives = {
            objectiveType: 5,
            name: halfAlphabet.name,
            description: halfAlphabet.description,
            points: halfAlphabet.points,
            owner: undefined,
            placedLetters: [halfAlphabetProgression],
            progressions: [playerProgression],
        };

        const testObjective = onlineObjectiveConverter.convertObjectives(publicObjectives, privateObjectives);
        expect(testObjective[0]).to.deep.equal(expectedTransitionObjective);
    });
});
