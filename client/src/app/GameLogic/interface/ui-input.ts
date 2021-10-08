export enum InputType {
    LeftClick = 'LeftClick',
    RightClick = 'RightClick',
    Key = 'Key',
}

export enum InputComponent {
    Horse = 'Horse',
    Board = 'Board',
}

export interface UIInput {
    type: InputType;
    from: InputComponent;
    args?: unknown;
}
