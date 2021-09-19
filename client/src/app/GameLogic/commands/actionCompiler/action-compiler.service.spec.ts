import { TestBed } from '@angular/core/testing';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { ActionCompilerService } from '@app/GameLogic/commands/actionCompiler/action-compiler.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';

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
    // let gameInfoService: GameInfoService;
    // let user: User;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ActionCompilerService],
        });
        service = TestBed.inject(ActionCompilerService);

        // user = new User('Hello World!');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw error when given not action command', () => {
        const notActionCommands: Command[] = [{ type: CommandType.Debug }, { type: CommandType.Help }];
        for (const notActionCommand of notActionCommands) {
            expect(() => {
                service.translate(notActionCommand);
            }).toThrowError();
        }
    });

    it('should create PassTurn object', () => {
        const command: Command = {
            type: CommandType.Pass,
        };
        expect(service.translate(command)).toBeInstanceOf(PassTurn);
    });

    it('should create ExchangeLetter object', () => {
        const command: Command = {
            type: CommandType.Exchange,
            args: ['A', 'B', 'C'],
        };
        expect(service.translate(command)).toBeInstanceOf(ExchangeLetter);
    });

    it('should create PlaceLetter object', () => {
        const command: Command = {
            type: CommandType.Place,
            args: ['A', 'B', 'C'],
        };
        expect(service.translate(command)).toBeInstanceOf(PlaceLetter);
    });

    it('#createExchangeLetter should throw error when invalid command exchange', () => {
        const invalidCommand: Command = {
            type: CommandType.Exchange,
        };
        expect(() => {
            service.translate(invalidCommand);
        }).toThrowError();
    });

    it('#createExchangeLetter should throw error when invalid command place', () => {
        const invalidCommand: Command = {
            type: CommandType.Place,
        };
        expect(() => {
            service.translate(invalidCommand);
        }).toThrowError();
    });
    // TODO: action compiler exhaustive test
});
