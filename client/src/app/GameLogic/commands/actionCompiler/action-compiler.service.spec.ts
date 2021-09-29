import { TestBed } from '@angular/core/testing';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { ActionCompilerService } from '@app/GameLogic/commands/actionCompiler/action-compiler.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { User } from '@app/GameLogic/player/user';

// TODO: implement MockGameService
// class MockGameInfoService {
//     user: User;
//     injectUser(user: User) {
//         this.user = user;
//     }
// }
// {provide: GameInfoService, useClass: MockGameService}
describe('ActionCompilerService', () => {
    let service: ActionCompilerService;
    let gameInfo: GameInfoService;
    // let gameInfoService: GameInfoService;
    // let user: User;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ActionCompilerService, GameInfoService],
        });
        service = TestBed.inject(ActionCompilerService);
        gameInfo = TestBed.inject(GameInfoService);
        gameInfo.user = new User('p1');
        gameInfo.players = [gameInfo.user];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw error when given not action command', () => {
        const notActionCommands: Command[] = [
            { type: CommandType.Debug, from: ' ' },
            { type: CommandType.Help, from: ' ' },
        ];
        for (const notActionCommand of notActionCommands) {
            expect(() => {
                service.translate(notActionCommand);
            }).toThrowError();
        }
    });

    it('should create PassTurn object', () => {
        const command: Command = {
            type: CommandType.Pass,
            from: 'p1',
        };
        expect(service.translate(command)).toBeInstanceOf(PassTurn);
    });

    it('should create ExchangeLetter object', () => {
        const command: Command = {
            type: CommandType.Exchange,
            args: ['A', 'B', 'C'],
            from: 'p1',
        };
        expect(service.translate(command)).toBeInstanceOf(ExchangeLetter);
    });

    it('should create PlaceLetter object', () => {
        const command: Command = {
            type: CommandType.Place,
            args: ['a', '1', 'h', 'abc'],
            from: 'p1',
        };
        expect(service.translate(command)).toBeInstanceOf(PlaceLetter);
    });

    it('should throw error when invalid number of args for PlaceLetter object', () => {
        const invalidCommand: Command = {
            type: CommandType.Place,
            args: ['a', '1', 'h'],
            from: ' ',
        };
        expect(() => {
            service.translate(invalidCommand);
        }).toThrowError();
    });

    it('should throw error when invalid command exchange', () => {
        const invalidCommand: Command = {
            type: CommandType.Exchange,
            from: ' ',
        };
        expect(() => {
            service.translate(invalidCommand);
        }).toThrowError();
    });

    it('should throw error when invalid command place', () => {
        const invalidCommand: Command = {
            type: CommandType.Place,
            from: ' ',
        };
        expect(() => {
            service.translate(invalidCommand);
        }).toThrowError();
    });
    // TODO: action compiler exhaustive test
});
