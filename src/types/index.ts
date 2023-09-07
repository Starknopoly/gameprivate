import { BANK_ID, HOTEL_ID, STARKBUCKS_ID } from "../config"

export class Building {
    public position: number = 0
    public type: number = 1
    public price: number = 0
    public owner: string = ""

    public isMine = false

    constructor(type: number, price: number, owner: string, position: number) {
        this.type = type
        this.price = price
        this.owner = owner
        this.position = position
    }

    public getName = () => {
        switch (this.type) {
            case HOTEL_ID: return "Hotel";
            case BANK_ID: return "Bank";
            case STARKBUCKS_ID: return "Starkbucks";
        }
    }
}