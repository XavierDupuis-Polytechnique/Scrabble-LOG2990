import { DatabaseService } from '@app/database/database.service';
import { GameMode } from '@app/database/leaderboard-service/game-mode.enum';
import {
    DEFAULT_LEADERBOARD,
    LEADERBOARD_CLASSIC_COLLECTION,
    LEADERBOARD_LOG_COLLECTION,
} from '@app/database/leaderboard-service/leaderboard-constants';
import { Score } from '@app/database/leaderboard-service/score.interface';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class LeaderboardService {
    constructor(private databaseService: DatabaseService) {}

    getLeaderboardCollection(mode: GameMode): Collection<Score> {
        const collectionName = mode === GameMode.Classic ? LEADERBOARD_CLASSIC_COLLECTION : LEADERBOARD_LOG_COLLECTION;
        return this.databaseService.database.collection(collectionName);
    }

    async getScores(mode: GameMode): Promise<Score[]> {
        const collection = this.getLeaderboardCollection(mode);
        const scores: Score[] = await collection.find({}).sort({ point: -1 }).toArray();
        return scores;
    }

    async deleteScores(): Promise<boolean> {
        try {
            await this.getLeaderboardCollection(GameMode.Classic).deleteMany({});
            await this.getLeaderboardCollection(GameMode.Log).deleteMany({});
            await this.populateCollection(GameMode.Classic);
            await this.populateCollection(GameMode.Log);
            return true;
        } catch (e) {
            return false;
        }
    }

    async updateLeaderboard(score: Score, mode: GameMode): Promise<boolean> {
        try {
            const collection = this.getLeaderboardCollection(mode);
            const currentScore = await collection.findOne({ name: score.name });
            if (currentScore === undefined) {
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

    private async modifyScore(score: Score, mode: GameMode): Promise<void> {
        const collection = this.getLeaderboardCollection(mode);
        await collection.updateOne({ name: score.name }, { $set: { point: score.point } });
    }

    private async addScore(score: Score, mode: GameMode): Promise<void> {
        const collection = this.getLeaderboardCollection(mode);
        await collection.insertOne({ name: score.name, point: score.point });
    }

    private async populateCollection(mode: GameMode): Promise<void> {
        const collection = this.getLeaderboardCollection(mode);
        await collection.insertMany(DEFAULT_LEADERBOARD);
    }
}
