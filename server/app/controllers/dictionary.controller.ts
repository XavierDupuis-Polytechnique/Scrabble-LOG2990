import { DictionaryServer } from '@app/dictionary-manager/default-dictionary';
import { DictionaryServerService } from '@app/dictionary-manager/dictionary-server.service';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DictionaryController {
    router: Router;

    constructor(private dictionaryServerService: DictionaryServerService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req, response) => {
            try {
                const title = req.query.title as string;
                if (!title) {
                    const dicts = this.dictionaryServerService.getDictsList();
                    response.json(dicts);
                    return;
                }
                const dict = this.dictionaryServerService.getDictByTitle(title);
                if (!dict) {
                    response.sendStatus(StatusCodes.NOT_FOUND);
                }
                response.json(dict);
            } catch (e) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/', async (req, response) => {
            try {
                const clientDict = req.body as DictionaryServer;
                const isDictExist = this.dictionaryServerService.isDictExist(clientDict.title);
                if (!isDictExist) {
                    clientDict.canEdit = true;
                    this.dictionaryServerService.addDict(clientDict);
                    response.send(true);
                    return;
                }
                response.send(false);
            } catch (e) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.delete('/', async (req, response) => {
            try {
                const title = req.query.title as string;
                if (this.dictionaryServerService.deleteDict(title)) {
                    response.sendStatus(StatusCodes.OK);
                    return;
                }
                response.sendStatus(StatusCodes.NOT_FOUND);
            } catch (error) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.put('/', async (req, response) => {
            try {
                const clientDict = req.body as DictionaryServer[];
                if (clientDict[0].title !== clientDict[1].title && this.dictionaryServerService.isDictExist(clientDict[1].title)) {
                    response.send(false);
                    return;
                }
                const answer = this.dictionaryServerService.updateDict(clientDict[0], clientDict[1]);
                response.send(answer);
            } catch (e) {
                response.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.get('/drop', async (req, response) => {
            try {
                await this.dictionaryServerService.dropDelete();
                response.status(StatusCodes.OK).send(true);
            } catch (error) {
                response.status(StatusCodes.OK).send(false);
            }
        });
    }
}
