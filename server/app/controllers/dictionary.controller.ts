import { DictionaryDb } from '@app/db-manager-services/dictionary-db-manager/default-dictionary';
import { DictionaryDbService } from '@app/db-manager-services/dictionary-db-manager/dictionary-db.service';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DictionaryController {
    router: Router;

    constructor(private dictionaryDbService: DictionaryDbService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req, res) => {
            try {
                if (req.body.title) {
                    const dict = await this.dictionaryDbService.getDictByTitle(req.body.title);
                    res.json(dict);
                } else {
                    const dicts = await this.dictionaryDbService.getDictsList();
                    res.json(dicts);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.post('/', async (req, res) => {
            try {
                const clientDict = req.body as DictionaryDb;
                const isDictExist = await this.dictionaryDbService.isDictExist(clientDict.title);
                if (isDictExist) {
                    res.send(false);
                } else {
                    clientDict.canEdit = true;
                    await this.dictionaryDbService.addDict(clientDict);
                    res.send(true);
                }
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.delete('/:title', async (req, res) => {
            try {
                const title = req.params.title;
                const dict = await this.dictionaryDbService.getDictByTitle(title);
                this.dictionaryDbService.deleteDict(dict);
                res.sendStatus(StatusCodes.OK);
            } catch (error) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });

        this.router.put('/', async (req, res) => {
            try {
                const clientDict = req.body as DictionaryDb[];
                const ans = await this.dictionaryDbService.updateDict(clientDict[0], clientDict[1]);
                res.send(ans);
            } catch (e) {
                res.sendStatus(StatusCodes.NOT_FOUND);
            }
        });
    }
}
