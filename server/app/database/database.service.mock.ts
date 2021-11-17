import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
const DATABASE_NAME = 'database';

export class DatabaseServiceMock {
    mongoServer: MongoMemoryServer;
    private db: Db;
    private client: MongoClient;

    private options: MongoClientOptions = {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    };

    async start(): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = await MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri();
            this.client = await MongoClient.connect(mongoUri, this.options);
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
