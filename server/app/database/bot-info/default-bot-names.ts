import { BotInfo, BotType } from '@app/database/bot-info/bot-info';

export const DEFAULT_EASY_BOT: BotInfo[] = [
    { name: 'Jimmy', type: BotType.Easy, canEdit: false },
    { name: 'Sasha', type: BotType.Easy, canEdit: false },
    { name: 'Beep', type: BotType.Easy, canEdit: false },
];

export const DEFAULT_EXPERT_BOT: BotInfo[] = [
    { name: 'Terminator', type: BotType.Expert, canEdit: false },
    { name: 'Mario', type: BotType.Expert, canEdit: false },
    { name: 'Spooky', type: BotType.Expert, canEdit: false },
];
