// import { ActionCompilerService } from "@app/game/game-logic/actions/action-compiler.service";
// import { Direction } from "@app/game/game-logic/actions/direction.enum";
// import { ExchangeLetter } from "@app/game/game-logic/actions/exchange-letter";
// import { PassTurn } from "@app/game/game-logic/actions/pass-turn";
// import { PlaceLetter } from "@app/game/game-logic/actions/place-letter";
// import { Letter } from "@app/game/game-logic/board/letter.interface";
// import { PlacementSetting } from "@app/game/game-logic/interface/placement-setting.interface";
// import { Player } from "@app/game/game-logic/player/player";
// import { User } from "@app/game/game-logic/player/user";
// import { PointCalculatorService } from "@app/game/game-logic/point-calculator/point-calculator.service";
// import { DictionaryService } from "@app/game/game-logic/validator/dictionary/dictionary.service";
// import { WordSearcher } from "@app/game/game-logic/validator/word-search/word-searcher.service";
// import { expect } from "chai";

// describe('ActionCompilerService', () => {
//     let service: ActionCompilerService;
//     let player: Player;
//     let pointCalculator: PointCalculatorService;
//     let wordSearcher: WordSearcher;
//     const dict = new DictionaryService();
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [{ provide: DictionaryService, useValue: dict }],
//         });
//         service = TestBed.inject(ActionCompilerService);
//         pointCalculator = TestBed.inject(PointCalculatorService);
//         wordSearcher = TestBed.inject(WordSearcher);
//         player = new User('p1');
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should throw error when given not action command', () => {
//         const notActionCommands: Command[] = [
//             { type: CommandType.Debug, from: ' ' },
//             { type: CommandType.Help, from: ' ' },
//         ];
//         for (const notActionCommand of notActionCommands) {
//             expect(() => {
//                 service.translate(notActionCommand);
//             }).toThrowError();
//         }
//     });

//     it('should create PassTurn object', () => {
//         const playerName = player.name;
//         const command: Command = {
//             type: CommandType.Pass,
//             from: playerName,
//         };
//         const expectedAction = new PassTurn(player);
//         expect(service.translate(command)).toEqual(expectedAction);
//     });

//     it('should create ExchangeLetter object', () => {
//         const playerName = player.name;
//         const command: Command = {
//             type: CommandType.Exchange,
//             args: ['abc'],
//             from: playerName,
//         };
//         const letters: Letter[] = [
//             { char: 'A', value: 1 },
//             { char: 'B', value: 3 },
//             { char: 'C', value: 3 },
//         ];
//         const expectedAction = new ExchangeLetter(player, letters);
//         expect(service.translate(command)).toEqual(expectedAction);
//     });

//     it('should create PlaceLetter object', () => {
//         const playerName = player.name;
//         const command: Command = {
//             type: CommandType.Place,
//             args: ['a', '1', 'h', 'abc'],
//             from: playerName,
//         };
//         const placement: PlacementSetting = {
//             x: 0,
//             y: 0,
//             direction: Direction.Horizontal,
//         };

//         const expectedAction = new PlaceLetter(player, 'abc', placement, pointCalculator, wordSearcher);
//         expect(service.translate(command)).toEqual(expectedAction);
//     });

//     it('should throw error when invalid number of args for PlaceLetter object', () => {
//         const invalidCommand: Command = {
//             type: CommandType.Place,
//             args: ['a', '1', 'h'],
//             from: ' ',
//         };
//         expect(() => {
//             service.translate(invalidCommand);
//         }).toThrowError();
//     });

//     it('should throw error when invalid command exchange', () => {
//         const invalidCommand: Command = {
//             type: CommandType.Exchange,
//             from: ' ',
//         };
//         expect(() => {
//             service.translate(invalidCommand);
//         }).toThrowError();
//     });

//     it('should throw error when invalid command place', () => {
//         const invalidCommand: Command = {
//             type: CommandType.Place,
//             from: ' ',
//         };
//         expect(() => {
//             service.translate(invalidCommand);
//         }).toThrowError();
//     });

//     it('should command is not an action', () => {
//         const notActionCommand: Command = {
//             type: CommandType.Debug,
//             from: 'p1',
//         };

//         expect(() => {
//             service.translate(notActionCommand);
//         }).toThrowError('this command dont generate an action');
//     });

//     it('should throw when args undefined exchange', () => {
//         const command: Command = {
//             type: CommandType.Exchange,
//             from: 'p1',
//         };

//         expect(() => {
//             service.translate(command);
//         }).toThrowError();
//     });

//     it('should throw when args undefined placeletter', () => {
//         const command: Command = {
//             type: CommandType.Place,
//             from: 'p1',
//         };

//         expect(() => {
//             service.translate(command);
//         }).toThrowError();
//     });

//     it('should throw when number of args not valid in placeletter', () => {
//         const command: Command = {
//             type: CommandType.Place,
//             from: 'p1',
//             args: ['1', '2'],
//         };

//         expect(() => {
//             service.translate(command);
//         }).toThrowError();
//     });
// });
