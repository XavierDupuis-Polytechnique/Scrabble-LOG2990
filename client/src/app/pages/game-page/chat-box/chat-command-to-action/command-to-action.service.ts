import { Injectable } from '@angular/core';
import { Letter } from '@app/GameLogic/game/letter.interface';

@Injectable({
  providedIn: 'root'
})
export class CommandToActionService {

  constructor() { }


  DebugCommand() {

  }

  HelpCommand() {

  }
  
  PlaceCommand() {

  }
  ExchangeCommand(lettersToExchange: Letter[]) {

  }
  PassCommand() {

  }
}
