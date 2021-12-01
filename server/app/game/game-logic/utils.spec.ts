import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { placementSettingsToString } from '@app/game/game-logic/utils';
import { expect } from 'chai';

describe('placementSettingsToString', () => {
    it('should throw error when x is not in range', () => {
        const placementSettings = {
            x: 15,
            y: 0,
            direction: Direction.Horizontal,
        };
        expect(() => {
            placementSettingsToString(placementSettings);
        }).to.throw();
    });

    it('should throw error when y is not in range', () => {
        const placementSettings = {
            x: 0,
            y: 15,
            direction: Direction.Horizontal,
        };
        expect(() => {
            placementSettingsToString(placementSettings);
        }).to.throw();
    });

    it('should throw error when direction is not valid', () => {
        const placementSettings = {
            x: 0,
            y: 15,
            direction: 'a' as Direction,
        };
        expect(() => {
            placementSettingsToString(placementSettings);
        }).to.throw();
    });
});
