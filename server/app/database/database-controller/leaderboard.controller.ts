import { GameMode, LeaderboardService } from '@app/database/leaderboard.service';
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

        this.router.get('/', async (req: Request, res: Response) => {
            const gameMode = req.query.gameMode?.toString();
            try {
                const scores = await this.leaderboardService.getScores(gameMode as GameMode);
                res.json(scores);
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/', async (req: Request, res: Response) => {
            const gameMode = req.query.gameMode?.toString();
            try {
                await this.leaderboardService.updateLeaderboard(req.body, gameMode as GameMode);
                res.sendStatus(StatusCodes.OK);
            } catch (e) {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });

        this.router.delete('/', async (req: Request, res: Response) => {
            try {
                await this.leaderboardService.deleteScores();
                res.sendStatus(StatusCodes.OK);
            } catch (e) {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });
    }
}
