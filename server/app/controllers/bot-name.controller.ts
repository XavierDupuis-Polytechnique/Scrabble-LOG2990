import { Router } from 'express';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { BotNameService } from '@app/db-manager-services/bot-name-db-manager/bot-name.service';
@Service()
export class BotNameController {
    router: Router;

    constructor(private botNameService: BotNameService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/botnames', async (req, res) => {
            // res.json(['allo', 'banana', 'paul']);
            try {
                const botNames = await this.botNameService.getBotNames();
                res.json(botNames);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND);
            }
            // res.json(this.botNameService.getBotNames());
        });

        this.router.post('/botnames', async (req, res) => {
            console.log(req.body);

            res.status(StatusCodes.CREATED).send();
            // res.json(this.botNameService.addBotName(req.body));
        });
    }
}
