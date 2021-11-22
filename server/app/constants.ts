export const MAX_MESSAGE_LENGTH = 512;
export const NEW_GAME_TIMEOUT = 5000;
// TODO: maybe to put in env var
const DB_USER = 'server';
const DB_PSW = 'ACyZhkpcAUT812QB';
const CLUSTER_URL = 'scrabblecluster.mqtnr.mongodb.net';
export const DATABASE_URL = `mongodb+srv://${DB_USER}:${DB_PSW}@${CLUSTER_URL}/<dbname>?retryWrites=true&w=majority`;
export const DATABASE_NAME = 'scrabble';
export const BOT_NAME_COLLECTION = 'botNames';
export const BOT_INFO_COLLECTION = 'botInfos';
