import { useState } from "react"
import dice1 from "../assets/dices/dice1.png"
import dice2 from "../assets/dices/dice2.png"
import dice3 from "../assets/dices/dice3.png"
import dice4 from "../assets/dices/dice4.png"
import dice5 from "../assets/dices/dice5.png"
import dice6 from "../assets/dices/dice6.png"
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper"

export default function RollDice(){
    const [diceImg1,setDice1] =  useState(dice1)
    const [diceImg2,setDice2] =  useState(dice1)

    const {
        account: {
            account
        },
        networkLayer: {
            systemCalls: { roll },
        },
    } = useDojo();

    const rollDice = ()=>{
        console.log("rollDice");
        
        setDice1(dice2)
        setDice2(dice6)
        roll(account)
    }

    return(
        <ClickWrapper>
            <img src={diceImg1}/>
            <img src={diceImg2}/>
            <button onClick={()=>rollDice()}>Roll</button>
        </ClickWrapper>
    )
}