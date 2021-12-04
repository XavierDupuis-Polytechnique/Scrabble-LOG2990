import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { BOARD_MAX_POSITION, BOARD_MIN_POSITION } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { Tile } from '@app/game-logic/game/board/tile';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DownloadedDict } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { OnlineGameSettingsUI } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { Socket } from 'socket.io-client';

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

    if (!Object.values(Direction).includes(direction)) {
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

export const isSocketConnected = (socket: Socket | undefined): boolean => {
    return socket ? socket.connected : false;
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

export const copyGrid = (grid: Tile[][]): Tile[][] => {
    const copiedGrid = [];
    for (const row of grid) {
        const copiedRow = [];
        for (const tile of row) {
            const copiedTile = new Tile();
            copiedTile.letterMultiplicator = tile.letterMultiplicator;
            copiedTile.letterObject = { ...tile.letterObject };
            copiedTile.wordMultiplicator = tile.wordMultiplicator;
            copiedRow.push(copiedTile);
        }
        copiedGrid.push(copiedRow);
    }
    return copiedGrid;
};

export const isPalindrome = (word: string): boolean => {
    const length = word.length;
    for (let i = 0; i < length / 2; i++) {
        const leftLetter = word[i];
        const rightLetter = word[length - i - 1];
        if (leftLetter !== rightLetter) {
            return false;
        }
    }
    return true;
};

export const stringifyWord = (word: Tile[]): string => {
    const letters: string[] = word.map((tile: Tile) => tile.letterObject.char);
    const stringifiedWord = letters.join('');
    return stringifiedWord;
};

export const wordifyString = (word: string): Tile[] => {
    const stringList = word.split('');
    const tileList: Tile[] = stringList.map((char: string) => {
        const newTile = new Tile();
        newTile.letterObject.char = char;
        return newTile;
    });
    return tileList;
};

export const openErrorDialog = (dialog: MatDialog, width: string, errorContent: string) => {
    dialog.open(AlertDialogComponent, {
        width,
        data: {
            message: errorContent,
            button1: 'Ok',
            button2: '',
        },
    });
};

export const dictionaryToDownloadedDict = (dict: Dictionary): DownloadedDict => {
    return {
        title: dict.title,
        description: dict.description,
        words: dict.words,
    };
};
