import { BotInfo, BotType } from '@app/db-manager-services/bot-name-db-manager/bot-info';

export const DEFAULT_BOT_NAMES = ['Jimmy', 'Sasha', 'Beep'];

export const DEFAULT_EASY_BOT: BotInfo[] = [
    { name: 'Jimmy', type: BotType.Easy, canEdit: false },
    { name: 'Sasha', type: BotType.Easy, canEdit: false },
    { name: 'Beep', type: BotType.Easy, canEdit: false },
];
