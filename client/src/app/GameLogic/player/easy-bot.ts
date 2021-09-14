import { Bot } from "./bot";

export class EasyBot extends Bot{
    static actionProabibility = { Play: 0.8, Exchange: 0.1, Pass: 0.1 };

    randomActionPicker(){
        let randomValue = Math.random();
        if (randomValue <= EasyBot.actionProabibility.Play) {
            //playAction();
       }
       else if (randomValue <= EasyBot.actionProabibility.Play + EasyBot.actionProabibility.Exchange) {
           //exchangeAction();
       } 
       else {
           //passAction();
       }
    }


    //randomWordPicker()

}
