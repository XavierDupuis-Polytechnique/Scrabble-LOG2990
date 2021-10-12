
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

export enum WheelRoll {
    UP = 'UP',
    DOWN = 'DOWN',
}
export interface UIInput {
    type: InputType;
    from?: InputComponent;
    args?: unknown;
}
