import { Letter } from '@app/GameLogic/game/board/letter.interface';

export enum InputType {
    LeftClick = 'LeftClick',
    RightClick = 'RightClick',
    KeyPress = 'KeyPress',
}

export enum InputComponent {
    Horse = 'Horse',
    Board = 'Board',
}

export interface UIInput {
    type: InputType;
    from?: InputComponent;
    args?: Letter | string;
}
