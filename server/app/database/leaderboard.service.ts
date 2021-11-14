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

    async getAllScores(): Promise<Map<string, Score[]>> {
        const allScores = new Map<string, Score[]>();
        const modes = [GameMode.Classic, GameMode.Log];
        for (const mode of modes) {
            const scores = await this.getScores(mode);
            allScores.set(GameMode.Classic, scores);
        }
        return allScores;
    }

    async getScores(mode: GameMode): Promise<Score[]> {
        const collection = mode === GameMode.Classic ? this.leaderboardCalssicCollection : this.leaderboardLogCollection;
        return collection
            .find({})
            .toArray()
            .then((scores: Score[]) => {
                return scores;
            });
    }

    async addScore(score: Score, mode: GameMode): Promise<boolean> {
        if (!this.validScore(score)) {
            return false;
        }
        const collection = mode === GameMode.Classic ? this.leaderboardCalssicCollection : this.leaderboardLogCollection;
        const isPlayerInDb = collection.find((collectionScore: Score) => collectionScore.name === score.name);
        if (isPlayerInDb) {
            this.modifyScore(score, mode);
        }
        try {
            console.log('Adding score');
            await collection.insertOne(score);
            return true;
        } catch (e) {
            return false;
        }
    }

    async deleteScores(): Promise<boolean> {
        try {
            await this.leaderboardCalssicCollection.deleteMany({});
            await this.leaderboardLogCollection.deleteMany({});
            return true;
        } catch (e) {
            return false;
        }
    }

    private async modifyScore(score: Score, mode: GameMode): Promise<boolean> {
        const collection = mode === GameMode.Classic ? this.leaderboardCalssicCollection : this.leaderboardLogCollection;
        try {
            console.log('Modifying score');
            await collection.updateOne({ name: score.name }, { point: score.point });
            return true;
        } catch (e) {
            return false;
        }
    }

    private validScore(score: Score): boolean {
        if (score.isEditable) {
            console.log('ValidScore');
            return score.point > 0;
        }
        console.log('InvalidScore');

        return false;
    }
}
