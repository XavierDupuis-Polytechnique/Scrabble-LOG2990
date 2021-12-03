import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DebugController {
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
        this.router.get('/letterbag', async (req: Request, response: Response) => {
            const gameId = req.query.gameId?.toString();
            if (!gameId) {
                response.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }
            const game = this.gameManager.activeGames.get(gameId);
            if (!game) {
                response.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            const letterOccurence = game.letterBag.countLetters();
            const obj = {};
            letterOccurence.forEach((value, key) => {
                obj[key] = value;
            });
            response.json(obj);
        });
    }
}
