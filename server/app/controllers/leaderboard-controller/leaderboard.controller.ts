import { GameMode } from '@app/database/leaderboard-service/game-mode.enum';
import { LeaderboardService } from '@app/database/leaderboard-service/leaderboard.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class LeaderboardController {
    router: Router;

    constructor(private leaderboardService: LeaderboardService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:gameMode', async (req: Request, res: Response) => {
            const gameMode = req.query.gameMode;
            try {
                const scores = await this.leaderboardService.getScores(gameMode as GameMode);
                if (scores.length === 0) {
                    res.sendStatus(StatusCodes.BAD_REQUEST);
                    return;
                }
                res.send(scores);
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/:gameMode', async (req: Request, res: Response) => {
            const gameMode = req.query.gameMode;
            try {
                const score = { name: req.body.name, point: req.body.point };
                const isSuccesful = await this.leaderboardService.updateLeaderboard(score, gameMode as GameMode);
                if (!isSuccesful) {
                    res.sendStatus(StatusCodes.BAD_REQUEST);
                    return;
                }
                res.sendStatus(StatusCodes.OK);
            } catch (e) {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });

        this.router.delete('/', async (req: Request, res: Response) => {
            try {
                const isSuccessful = await this.leaderboardService.deleteScores();
                if (!isSuccessful) {
                    res.sendStatus(StatusCodes.BAD_REQUEST);
                    return;
                }
                res.sendStatus(StatusCodes.OK);
            } catch (e) {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });
    }
}
