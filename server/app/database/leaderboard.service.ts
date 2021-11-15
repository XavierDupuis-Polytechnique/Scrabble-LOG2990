import { DatabaseService } from '@app/database/database.service';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

export enum GameMode {
    Classic = 'classic',
    Log = 'log',
}
export interface Score {
    name: string;
    point: number;
}

// TODO put in constant file
export const LEADERBOARD_CLASSIC_COLLECTION = 'leaderboardClassic';
export const LEADERBOARD_LOG_COLLECTION = 'leaderboardLog';

export const DEFAULT_LEADERBOARD = [
    {
        name: 'Player0',
        point: 100,
    },
    {
        name: 'Player1',
        point: 200,
    },
    {
        name: 'Player2',
        point: 50,
    },
    {
        name: 'Player3',
        point: 10,
    },
];

@Service()
export class LeaderboardService {
    constructor(private databaseService: DatabaseService) {}

    getLeaderboardCollection(mode: GameMode): Collection<Score> {
        const collectionName = mode === GameMode.Classic ? LEADERBOARD_CLASSIC_COLLECTION : LEADERBOARD_LOG_COLLECTION;
        return this.databaseService.database.collection(collectionName);
    }

    async getScores(mode: GameMode): Promise<Score[]> {
        const collection = this.getLeaderboardCollection(mode);
        const scores = await collection.find({}).toArray();
        return scores;
    }

    // async addScore(score: Score, mode: GameMode): Promise<void> {
    //     if (!this.validScore(score)) {
    //         return;
    //     }
    //     const collection = this.getLeaderboardCollection(mode);
    //     console.log('Adding score');
    //     await collection.insertOne(score);
    // }

    async deleteScores(): Promise<void> {
        try {
            await this.getLeaderboardCollection(GameMode.Classic).deleteMany({});
            await this.getLeaderboardCollection(GameMode.Log).deleteMany({});
        } catch (e) {
            throw new Error(e);
        }
        await this.populateCollection(GameMode.Classic);
        await this.populateCollection(GameMode.Log);
    }

    async updateLeaderboard(score: Score, mode: GameMode): Promise<void> {
        const collection = this.getLeaderboardCollection(mode);
        const currentScore = await collection.findOne({ name: score.name });
        if (currentScore === undefined) {
            await this.addScore(score, mode);
            return;
        }
        if (score.point > currentScore.point) {
            await this.modifyScore(score, mode);
        }
    }

    private async modifyScore(score: Score, mode: GameMode) {
        const collection = this.getLeaderboardCollection(mode);
        try {
            await collection.updateOne({ name: score.name }, { $set: { point: score.point } });
        } catch (e) {
            throw new Error(e);
        }
    }

    private async addScore(score: Score, mode: GameMode) {
        const collection = this.getLeaderboardCollection(mode);
        try {
            await collection.insertOne({ name: score.name, point: score.point });
            return;
        } catch (e) {
            throw new Error(e);
        }
    }

    private async populateCollection(mode: GameMode): Promise<void> {
        const collection = this.getLeaderboardCollection(mode);
        try {
            await collection.insertMany(DEFAULT_LEADERBOARD);
        } catch (e) {
            throw Error('Data base collection population error');
        }
    }
}
