import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { BotNamesService } from '@app/db-manager-services/bot-name-db-manager/bot-names.service';

@Service()
export class BotNamesController {
    router: Router;

    constructor(private botNamesService: BotNamesService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const botNames = await this.botNamesService.getBotNames();
                res.json(botNames);
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/', async (req: Request, res: Response) => {
            const botName = req.body.name;
            if (botName === undefined) {
                res.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }
            try {
                const botNameAdded = await this.botNamesService.addBotName(botName);
                if (botNameAdded) {
                    res.sendStatus(StatusCodes.CREATED);
                } else {
                    res.sendStatus(StatusCodes.CONFLICT);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
            }
        });

        this.router.delete('/', async (req: Request, res: Response) => {
            const botName = req.body.name;
            if (botName === undefined) {
                res.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }
            try {
                const botNameDeleted = await this.botNamesService.deleteBotName(botName);
                if (botNameDeleted) {
                    res.sendStatus(StatusCodes.OK);
                } else {
                    res.sendStatus(StatusCodes.NOT_FOUND);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.SERVICE_UNAVAILABLE);
            }
        });
    }
}
