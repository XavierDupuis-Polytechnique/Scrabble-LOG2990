import { Letter } from '@app/GameLogic/game/board/letter.interface';

export enum InputType {
    LeftClick = 'LeftClick',
    RightClick = 'RightClick',
    MouseRoll = 'MouseRoll',
    KeyPress = 'KeyPress',
}

export enum InputComponent {
    Horse = 'Horse',
    Board = 'Board',
    Outside = 'Outside',
}

export interface UIInput {
    type: InputType;
    from?: InputComponent;
    args?: Letter | string;
}
