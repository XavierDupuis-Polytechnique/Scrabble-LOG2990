import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

const DATABASE_NAME = 'database';

export class DatabaseServiceMock {
    mongoServer: MongoMemoryServer;
    private db: Db;
    private client: MongoClient;

    async start(): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = await MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri();
            this.client = await MongoClient.connect(mongoUri);
            this.db = this.client.db(DATABASE_NAME);
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    get database(): Db {
        return this.db;
    }
}
