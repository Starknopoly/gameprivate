import { BANK_ID, BOMB_ID, BUILDING_PRICES, HOTEL_ID, STARKBUCKS_ID } from "../config"

export class Building {
    public position: number = 0
    public type: number = 1
    public price: number = 0
    public owner: string = ""
    public enable = true
    public isMine = false

    constructor(type: number, price: number, owner: string, position: number) {
        this.type = type
        this.price = price
        this.owner = owner
        this.position = position
    }

    public getName = () => {
        switch (this.type) {
            case BOMB_ID: return "Bomb";
            case HOTEL_ID: return "Hotel";
            case BANK_ID: return "Bank";
            case STARKBUCKS_ID: return "Starkbucks";
        }
    }

    public getLevel = () => {
        var price0 = 0;

        switch (this.type) {
            case BOMB_ID: return 1;
            case HOTEL_ID: price0 = BUILDING_PRICES['Hotel']; break;
            case STARKBUCKS_ID: price0 = BUILDING_PRICES['Starkbucks']; break;
            case BANK_ID: price0 = BUILDING_PRICES['Bank']; break;
        }
        const ratio = this.price/price0;
        const level =Math.floor(Math.log(ratio)/Math.log(1.3))+1
        console.log("getLevel ",this.price,price0,ratio,level);
        return level;
    }
}