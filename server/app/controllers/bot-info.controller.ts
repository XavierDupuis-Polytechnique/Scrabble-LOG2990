import { BotInfo } from '@app/database/bot-info/bot-info';
import { BotInfoService } from '@app/database/bot-info/bot-info.service';
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

        this.router.get('/', async (req, response) => {
            try {
                const botInfos = await this.botInfoService.getBotInfoList();
                response.json(botInfos);
            } catch (e) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/', async (req, response) => {
            try {
                const clientBotInfo = req.body as BotInfo;
                const isBotExist = await this.botInfoService.isBotExist(clientBotInfo.name);
                if (!isBotExist) {
                    clientBotInfo.canEdit = true;
                    await this.botInfoService.addBot(clientBotInfo);
                    response.send(true);
                } else {
                    response.send(false);
                }
            } catch (e) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.delete('/:botName', async (req, response) => {
            try {
                const botName = req.params.botName;
                const botinfo = await this.botInfoService.getBotInfoByName(botName);
                await this.botInfoService.deleteBot(botinfo);
                response.sendStatus(StatusCodes.OK);
            } catch (error) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.put('/', async (req, response) => {
            try {
                const clientBotInfos = req.body as BotInfo[];
                const answer = await this.botInfoService.updateBot(clientBotInfos[0], clientBotInfos[1]);
                response.send(answer);
            } catch (e) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.get('/drop', async (req, response) => {
            try {
                await this.botInfoService.clearDropCollection();
                response.send(true);
            } catch (error) {
                response.send(false);
            }
        });
    }
}
