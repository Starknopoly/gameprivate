export class Building{
    public position:number=0
    public type:number=1
    public price:number=0
    public owner:string=""

    constructor(type:number,price:number,owner:string,position:number){
        this.type = type
        this.price = price
        this.owner = owner
        this.position = position
    }
}