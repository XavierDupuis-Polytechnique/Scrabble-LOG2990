export enum InputType {
    LeftClick = 'LeftClick',
    RightClick = 'RightClick',
    MouseRoll = 'MouseRoll',
    KeyPress = 'KeyPress',
}

export enum InputComponent {
    Horse = 'Horse',
    Board = 'Board',
    Chatbox = 'Chatbox',
    Outside = 'Outside',
}

export enum WheelRoll {
    UP = 'UP',
    DOWN = 'DOWN',
}
export interface UIInput {
    type: InputType;
    from?: InputComponent;
    args?: string | number | { x: number; y: number };
}
