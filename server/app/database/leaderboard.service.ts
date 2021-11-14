import { DatabaseService } from '@app/database/database.service';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

export enum GameMode {
    Classique,
    Log,
}
export interface Score {
    name: string;
    point: number;
    isEditable: boolean;
}

// TODO put in constant file
export const LEADERBOARD_CLASSIC_COLLECTION = 'leaderboardClassic';
export const LEADERBOARD_LOG_COLLECTION = 'leaderboardLog';

export const DEFAULT_LEADERBOARD = [
    {
        name: 'Player0',
        point: 100,
        isEditable: false,
    },
    {
        name: 'Player1',
        point: 100,
        isEditable: false,
    },
    {
        name: 'Player2',
        point: 50,
        isEditable: true,
    },
    {
        name: 'Player3',
        point: 10,
        isEditable: true,
    },
];

@Service()
export class LeaderboardService {
    constructor(private databaseService: DatabaseService) {}

    get leaderboardCalssicCollection(): Collection<Score> {
        return this.databaseService.database.collection(LEADERBOARD_CLASSIC_COLLECTION);
    }

    get leaderboardLogCollection(): Collection<Score> {
        return this.databaseService.database.collection(LEADERBOARD_LOG_COLLECTION);
    }

    async getScores(mode: GameMode): Promise<Score[]> {
        const collection = mode === GameMode.Classique ? this.leaderboardCalssicCollection : this.leaderboardLogCollection;
        return collection
            .find({})
            .toArray()
            .then((scores: Score[]) => {
                return scores;
            });
    }

    async addScore(score: Score, mode: GameMode): Promise<boolean> {
        if (!this.validateScore(score)) {
            return false;
        }
        const collection = mode === GameMode.Classique ? this.leaderboardCalssicCollection : this.leaderboardLogCollection;
        try {
            await collection.insertOne(score);
            return true;
        } catch (e) {
            return false;
        }
    }

    // async modifyScore(score: Score): Promise<void> {}

    async deleteScores(): Promise<boolean> {
        try {
            await this.leaderboardCalssicCollection.deleteMany({});
            await this.leaderboardLogCollection.deleteMany({});
            return true;
        } catch (e) {
            return false;
        }
    }

    private validateScore(score: Score): boolean {
        return score.point < 0;
    }
}
