import { TimerControls } from '@app/game/game-logic/timer/timer-controls.enum';

export interface TimerGameControl {
    gameToken: string;
    control: TimerControls;
}
