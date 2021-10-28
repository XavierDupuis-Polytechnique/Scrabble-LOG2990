import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class ServerGameController {
    router: Router;

    constructor(private readonly gameManager: GameManagerService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * /api/servergame/letterbag:
         *   get:
         *     description: get number of letter in the bag
         *
         */
        this.router.get('/letterbag', async (req: Request, res: Response) => {
            const gameId = req.query.gameId?.toString();
            if (gameId) {
                const game = this.gameManager.activeGames.get(gameId);
                if (game) {
                    res.json(game?.letterBag.gameLetters.length);
                } else res.sendStatus(StatusCodes.NOT_FOUND);
            } else res.sendStatus(StatusCodes.BAD_REQUEST);
        });
    }
}
