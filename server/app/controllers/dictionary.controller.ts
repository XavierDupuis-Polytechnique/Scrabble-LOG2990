import { DictionaryServer } from '@app/db-manager-services/dictionary-manager/default-dictionary';
import { DictionaryServerService } from '@app/db-manager-services/dictionary-manager/dictionary-server.service';
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

        this.router.get('/', async (req, res) => {
            try {
                const title = req.query.title as string;
                if (title) {
                    const dict = this.dictionaryServerService.getDictByTitle(title);
                    if (dict) {
                        res.json(dict);
                    } else {
                        res.sendStatus(StatusCodes.NOT_FOUND);
                    }
                } else {
                    const dicts = this.dictionaryServerService.getDictsList();
                    res.json(dicts);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/', async (req, res) => {
            try {
                const clientDict = req.body as DictionaryServer;
                const isDictExist = this.dictionaryServerService.isDictExist(clientDict.title);
                if (isDictExist) {
                    res.send(false);
                } else {
                    clientDict.canEdit = true;
                    this.dictionaryServerService.addDict(clientDict);
                    res.send(true);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.delete('/', async (req, res) => {
            try {
                const title = req.query.title as string;
                if (this.dictionaryServerService.deleteDict(title)) {
                    res.sendStatus(StatusCodes.OK);
                } else {
                    res.sendStatus(StatusCodes.NOT_FOUND);
                }
            } catch (error) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.put('/', async (req, res) => {
            try {
                const clientDict = req.body as DictionaryServer[];
                if (clientDict[0].title !== clientDict[1].title && this.dictionaryServerService.isDictExist(clientDict[1].title)) {
                    res.send(false);
                } else {
                    const ans = this.dictionaryServerService.updateDict(clientDict[0], clientDict[1]);
                    res.send(ans);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.get('/drop', async (req, res) => {
            try {
                await this.dictionaryServerService.dropDelete();
                res.status(StatusCodes.OK).send(true);
            } catch (error) {
                res.status(StatusCodes.OK).send(false);
            }
        });
    }
}
