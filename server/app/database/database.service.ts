import { BOT_INFO_COLLECTION } from '@app/constants';
import { DEFAULT_EASY_BOT } from '@app/database/bot-info/default-bot-names';
import {
    DEFAULT_LEADERBOARD_CLASSIC,
    DEFAULT_LEADERBOARD_LOG,
    LEADERBOARD_CLASSIC_COLLECTION,
    LEADERBOARD_LOG_COLLECTION,
} from '@app/database/leaderboard-service/leaderboard-constants';
import { CollectionInfo, Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';

// C'est freaking bad d'avoir les credentials dans le code XD
const DB_USER = 'server';
const DB_PSW = 'ACyZhkpcAUT812QB';
const CLUSTER_URL = 'scrabblecluster.mqtnr.mongodb.net';

// TODO: CHANGE the URL for your database information
export const DATABASE_URL = `mongodb+srv://${DB_USER}:${DB_PSW}@${CLUSTER_URL}/<dbname>?retryWrites=true&w=majority`;
export const DATABASE_NAME = 'scrabble';

@Service()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    async start(url: string = DATABASE_URL) {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        this.createLeaderboardCollection(LEADERBOARD_CLASSIC_COLLECTION);
        this.createLeaderboardCollection(LEADERBOARD_LOG_COLLECTION);

        this.createBotInfoCollection();
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateLeaderboardCollection(name: string): Promise<void> {
        try {
            const defaultPopulation = name === LEADERBOARD_CLASSIC_COLLECTION ? DEFAULT_LEADERBOARD_CLASSIC : DEFAULT_LEADERBOARD_LOG;
            if ((await this.db.collection(name).countDocuments()) === 0) {
                await this.db.collection(name).insertMany(defaultPopulation);
            }
        } catch (e) {
            throw Error('Data base collection population error');
        }
    }

    private async createLeaderboardCollection(collectionName: string): Promise<void> {
        try {
            const checkCollectionExists = await this.collectionExists(collectionName);
            if (!checkCollectionExists) {
                await this.db.createCollection(collectionName);
                await this.db.collection(collectionName).createIndex({ name: 1 }, { unique: true });
                await this.populateLeaderboardCollection(collectionName);
            }
        } catch (e) {
            throw Error('Data base collection creation error');
        }
    }

    private async collectionExists(name: string): Promise<boolean> {
        const collections = await this.db.listCollections().toArray();
        const isCollectionExist = collections.find((collection: CollectionInfo) => collection.name === name);
        if (isCollectionExist === undefined) {
            return false;
        }
        return true;
    }

    private async createBotInfoCollection() {
        try {
            const checkCollectionEcists = await this.collectionExists(BOT_INFO_COLLECTION);
            if (!checkCollectionEcists) {
                await this.database.createCollection(BOT_INFO_COLLECTION);
                await this.database.collection(BOT_INFO_COLLECTION).createIndex({ name: 1 }, { unique: true });
                this.populateBotInfoCollection();
            }
        } catch (error) {
            throw Error('Data base collection creation error');
        }
    }

    private async populateBotInfoCollection() {
        try {
            await this.database.collection(BOT_INFO_COLLECTION).insertMany(DEFAULT_EASY_BOT);
        } catch (error) {
            throw Error('Data base collection population error');
        }
    }

    get database(): Db {
        return this.db;
    }
}
