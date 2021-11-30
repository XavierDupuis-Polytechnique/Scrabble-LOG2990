import { ObjectiveType } from '@app/game/game-logic/objectives/objective-creator/objective-type';
import { ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { FourCorners } from '@app/game/game-logic/objectives/objectives/four-corners/four-corners';
import { HalfAlphabet } from '@app/game/game-logic/objectives/objectives/half-alphabet/half-alphabet';
import { NineLettersWord } from '@app/game/game-logic/objectives/objectives/nine-letters-word/nine-letters-word';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { OnlineObjectiveConverter } from '@app/game/game-logic/objectives/objectives/objective-converter/online-objective-converter';
import { TransitionObjectives } from '@app/game/game-logic/objectives/objectives/objective-converter/transition-objectives';
import { Palindrome } from '@app/game/game-logic/objectives/objectives/palindrome/palindrome';
import { SameWordTwice } from '@app/game/game-logic/objectives/objectives/same-word-twice/same-word-twice';
import { TenWords } from '@app/game/game-logic/objectives/objectives/ten-words/ten-words';
import { ThreeSameLetters } from '@app/game/game-logic/objectives/objectives/three-same-letters/three-same-letters';
import { TripleBonus } from '@app/game/game-logic/objectives/objectives/triple-bonus/triple-bonus';
import { createSinonStubInstance, StubbedClass } from '@app/test.util';
import { expect } from 'chai';

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
});
