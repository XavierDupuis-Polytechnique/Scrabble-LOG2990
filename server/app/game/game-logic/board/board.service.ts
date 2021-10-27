import { Board } from '@app/game/game-logic/board/board';
import { Service } from 'typedi';

@Service()
export class BoardService {
    board: Board = new Board(false);
}
