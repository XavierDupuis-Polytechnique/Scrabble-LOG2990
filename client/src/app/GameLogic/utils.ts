import { Direction } from '@app/GameLogic/actions/direction.enum';
import { BOARD_MAX_POSITION, BOARD_MIN_POSITION } from '@app/GameLogic/constants';
import { PlacementSetting } from '@app/GameLogic/interface/placement-setting.interface';
import { OnlineGameSettingsUI } from '@app/modeMulti/interface/game-settings-multi.interface';

export const placementSettingsToString = (placement: PlacementSetting): string => {
    const x = placement.x;
    const y = placement.y;
    const direction = placement.direction;
    if (x < BOARD_MIN_POSITION || x > BOARD_MAX_POSITION) {
        throw Error('X value not between 0-14');
    }

    if (y < BOARD_MIN_POSITION || y > BOARD_MAX_POSITION) {
        throw Error('Y value not between 0-14');
    }

    if (!Object.values(Direction).includes(direction as Direction)) {
        throw Error('Invalid direction');
    }

    const rowCode = 'a'.charCodeAt(0) + y;
    const row = String.fromCharCode(rowCode);

    const colNumber = x + 1;
    const col = colNumber.toString();

    const directionString = direction.toLowerCase();
    return `${row}${col}${directionString}`;
};

export const isCharUpperCase = (char: string) => {
    if (char.length !== 1) {
        throw Error('the string given is not a char');
    }
    const charCode = char.charCodeAt(0);
    return charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0);
};

export const isGameSettings = (obj: unknown) => {
    return (
        (obj as OnlineGameSettingsUI).playerName !== undefined &&
        typeof (obj as OnlineGameSettingsUI).playerName === 'string' &&
        (obj as OnlineGameSettingsUI).opponentName === undefined &&
        (obj as OnlineGameSettingsUI).randomBonus !== undefined &&
        typeof (obj as OnlineGameSettingsUI).randomBonus === 'boolean' &&
        (obj as OnlineGameSettingsUI).timePerTurn !== undefined &&
        typeof (obj as OnlineGameSettingsUI).timePerTurn === 'number'
    );
};

export const isStringALowerCaseLetter = (string: string): boolean => {
    if (string.length !== 1) {
        return false;
    }
    const charCode = string.charCodeAt(0);
    return charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0);
};

export const isStringAnUpperCaseLetter = (string: string): boolean => {
    if (string.length !== 1) {
        return false;
    }
    const charCode = string.charCodeAt(0);
    return charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0);
};

export const convertToProperLetter = (string: string): string => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const getRandomInt = (max: number, min: number = 0): number => {
    return Math.floor(Math.random() * (max - min) + min);
};
