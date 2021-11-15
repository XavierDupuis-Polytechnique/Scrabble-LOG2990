import { BotInfoService } from '@app/db-manager-services/bot-info-db-manager/bot-info.service';
import { BotInfo } from '@app/db-manager-services/bot-name-db-manager/bot-info';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class BotInfoController {
    router: Router;

    constructor(private botInfoService: BotInfoService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req, res) => {
            try {
                const botInfos = await this.botInfoService.getBotInfoList();
                res.json(botInfos);
            } catch (e) {
                throw Error('BotInfo Controller Get error');
            }
        });

        this.router.post('/', async (req, res) => {
            try {
                // const clientBotInfo = req.body as BotInfo;
                this.botInfoService.findBotByName('Test');
                res.sendStatus(StatusCodes.OK);
            } catch (e) {
                throw Error('BotInfo Controller add error');
            }
        });

        this.router.delete('/', async (req, res) => {
            try {
                const botInfo = req.body as BotInfo;
                if (botInfo.canEdit && botInfo.name) {
                    if (await this.botInfoService.deleteBot(botInfo)) {
                        res.sendStatus(StatusCodes.OK);
                    } else {
                        res.sendStatus(StatusCodes.NOT_FOUND);
                    }
                } else {
                    res.sendStatus(StatusCodes.FORBIDDEN);
                }
            } catch (e) {
                throw Error('BotInfo Controller delete error');
            }
        });
    }
}
