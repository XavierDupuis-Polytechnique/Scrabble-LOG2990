import { DatabaseService } from '@app/database/database.service';
import {
    DEFAULT_LEADERBOARD_CLASSIC,
    DEFAULT_LEADERBOARD_LOG,
    LEADERBOARD_CLASSIC_COLLECTION,
    LEADERBOARD_LOG_COLLECTION,
} from '@app/database/leaderboard-service/leaderboard-constants';
import { Score } from '@app/database/leaderboard-service/score.interface';
import { GameMode } from '@app/game/game-mode.enum';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class LeaderboardService {
    constructor(private databaseService: DatabaseService) {}

    async getScores(mode: GameMode): Promise<Score[]> {
        const collection = this.getLeaderboardCollection(mode);
        const scores: Score[] = await collection.find({}).sort({ point: -1 }).toArray();
        return scores;
    }

    async deleteScores(): Promise<boolean> {
        try {
            await this.getLeaderboardCollection(GameMode.Classic).deleteMany({});
            await this.getLeaderboardCollection(GameMode.Special).deleteMany({});
            await this.populateCollection(GameMode.Classic);
            await this.populateCollection(GameMode.Special);
            return true;
        } catch (e) {
            return false;
        }
    }

    async updateLeaderboard(score: Score, mode: GameMode): Promise<boolean> {
        try {
            const collection = this.getLeaderboardCollection(mode);
            const currentScore = await collection.findOne({ name: score.name });
            if (!currentScore || currentScore === null) {
                await this.addScore(score, mode);
                return true;
            }

            if (score.point > currentScore.point) {
                await this.modifyScore(score, mode);
                return true;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    private getLeaderboardCollection(mode: GameMode): Collection<Score> {
        const collectionName = mode === GameMode.Classic ? LEADERBOARD_CLASSIC_COLLECTION : LEADERBOARD_LOG_COLLECTION;
        return this.databaseService.database.collection(collectionName);
    }

    private async modifyScore(score: Score, mode: GameMode): Promise<void> {
        const collection = this.getLeaderboardCollection(mode);
        await collection.updateOne({ name: score.name }, { $set: { point: score.point } });
    }

    private async addScore(score: Score, mode: GameMode): Promise<void> {
        const collection = this.getLeaderboardCollection(mode);
        await collection.insertOne({ name: score.name, point: score.point });
    }

    private async populateCollection(mode: GameMode): Promise<void> {
        const defaultPopulation = mode === GameMode.Classic ? DEFAULT_LEADERBOARD_CLASSIC : DEFAULT_LEADERBOARD_LOG;
        const collection = this.getLeaderboardCollection(mode);
        await collection.insertMany(defaultPopulation);
    }
}
