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
                const clientBotInfo = req.body as BotInfo;
                const t = await this.botInfoService.isBotExist(clientBotInfo.name);
                if (t) {
                    res.sendStatus(StatusCodes.CONFLICT);
                } else {
                    clientBotInfo.canEdit = true;
                    await this.botInfoService.addBot(clientBotInfo);
                    res.sendStatus(StatusCodes.OK);
                }
            } catch (e) {
                throw Error('BotInfo Controller add error');
            }
        });

        this.router.delete('/:botName', async (req, res) => {
            try {
                const botName = req.params.botName;
                const botinfo = await this.botInfoService.getBotInfoByName(botName);
                this.botInfoService.deleteBot(botinfo);
                res.sendStatus(StatusCodes.OK);
            } catch (error) {
                throw Error(error);
            }
        });

        this.router.put('/', async (req, res) => {
            try {
                const clientBotInfos = req.body as BotInfo[];
                const serverBotInfo = await this.botInfoService.getBotInfoByName(clientBotInfos[0].name);
                serverBotInfo.name = clientBotInfos[1].name;
                serverBotInfo.type = clientBotInfos[1].type;
                this.botInfoService.updateBot(clientBotInfos[0], serverBotInfo);
                res.sendStatus(StatusCodes.OK);
            } catch (e) {
                throw Error('BotInfo Controller put error');
            }
        });
    }
}
