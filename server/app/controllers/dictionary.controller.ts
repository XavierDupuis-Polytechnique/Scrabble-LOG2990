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
                if (req.body.title) {
                    const dict = this.dictionaryServerService.getDictByTitle(req.body.title);
                    if (dict === undefined) {
                        res.sendStatus(StatusCodes.NOT_FOUND);
                    } else {
                        res.json(dict);
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
                console.log(req.body);
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

        this.router.delete('/:title', async (req, res) => {
            try {
                const title = req.params.title;
                this.dictionaryServerService.deleteDict(title);
                res.sendStatus(StatusCodes.OK);
            } catch (error) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.put('/', async (req, res) => {
            try {
                const clientDict = req.body as DictionaryServer[];
                // TODO Validate whether the dict sent contain words or not
                const ans = this.dictionaryServerService.updateDict(clientDict[0], clientDict[1]);
                res.send(ans);
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });
    }
}
