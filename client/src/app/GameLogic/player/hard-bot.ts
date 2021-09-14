import { Bot } from "./bot";

export class HardBot extends Bot{
    play(): void {
        throw new Error("Method not implemented.");
    }
    exchange(): void {
        throw new Error("Method not implemented.");
    }
    pass(): void {
        throw new Error("Method not implemented.");
    }
    
}
