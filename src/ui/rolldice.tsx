import { useEffect, useRef, useState } from "react"
import dice1 from "/assets/dices/dice1.png"
import dice2 from "/assets/dices/dice2.png"
import dice3 from "/assets/dices/dice3.png"
import dice4 from "/assets/dices/dice4.png"
import dice5 from "/assets/dices/dice5.png"
import dice6 from "/assets/dices/dice6.png"
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper"
import '../App.css';
import { Direction, Player } from "../dojo/createSystemCalls"
import { getRandomIntBetween } from "../utils"
import { store } from "../store/store";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs"
import { MAP_WIDTH } from "../phaser/constants"
import { Account } from "starknet"

export default function RollDice() {
    const MaxRollTimes = 12
    const [diceImg1, setDice1] = useState(dice1)

    const rollInternalIdRef = useRef<NodeJS.Timer>()
    const rollCountRef = useRef(0)

    //wait for roll dice result on chain
    // const chainDiceRef = useRef(0)
    const playerEventRef = useRef<Player>()
    const walkInternalIdRef = useRef<NodeJS.Timer>()
    const walkCountRef = useRef(0)

    const {account,player} = store();
    const dices = [dice1, dice2, dice3, dice4, dice5, dice6]
    const {
        networkLayer: {
            components,
            systemCalls: { roll },
        },
    } = useDojo();

    const waitForChainResult = async () => {
        rollCountRef.current = rollCountRef.current + 1;
        if (rollCountRef.current <= MaxRollTimes || !playerEventRef.current) {
            var random1 = getRandomIntBetween(0, 5);
            if (dices[random1] == diceImg1) {
                random1 = getRandomIntBetween(0, 5);
            }
            setDice1(dices[random1])
        } else {
            clearInterval(rollInternalIdRef.current)
            rollCountRef.current = 0;
            if(playerEventRef.current){
                setDice1(dices[playerEventRef.current.last_point-1])
            }
            const intervalId = setInterval(walk, 600);
            walkInternalIdRef.current = intervalId
        }
    }

    const walk = async () => {
        if(!account){
            alert("Create burner wallet first.")
            return
        }
        if(!player){
            alert("Start game first.")
            return
        }
        if (walkCountRef.current == playerEventRef.current?.last_point) {
            walkCountRef.current = 0
            playerEventRef.current = undefined
            clearInterval(walkInternalIdRef.current)
            return
        }

        walkCountRef.current = walkCountRef.current + 1
        if(playerEventRef.current)
        move(account, Direction.Right,playerEventRef.current)
    }

    const move = (signer: Account, direction: Direction, playerEvent: Player) => {
        const entityId = parseInt(signer.address) as EntityIndex;

        //TODO : request Player on chain
        const value = getComponentValue(components.Player, entityId)
        console.log(value);
        if (!value) {
            return
        }
        const size = MAP_WIDTH
        var position = value.position
        if (direction == Direction.Left) {
            position -= 1
            if (position < 0) {
                position = size * size
            }
        }
        if (direction == Direction.Right) {
            position += 1
            if (position == size * size+1) {
                position = 1
            }
        }

        setComponent(components.Player, entityId, {
            position: position,
            nick_name:playerEvent.nick_name,
            joined_time: playerEvent.joined_time,
            direction: playerEvent.direction,
            gold: playerEvent.gold,
            steps: playerEvent.steps,
            last_point: playerEvent.last_point,
            last_time: playerEvent.last_time
        })
    }


    const rollDice = async () => {
        if(!account){
            alert("Create burner wallet first.")
            return
        }
        if(!player){
            alert("Start game first.")
            return
        }
        console.log("rolldice " + rollCountRef.current);

        if (rollCountRef.current != 0) {
            return
        }
        if (walkCountRef.current != 0) {
            return
        }
        console.log("rollDice");
        const intervalId = setInterval(waitForChainResult, 200);
        rollInternalIdRef.current = intervalId

        console.log("click roll account:"+account.address);
        const result = await roll(account)
        console.log("rolldice result:"+result);
        if(result){
            playerEventRef.current = result
        }
    }

    return (
        <ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
            <img src={diceImg1} />
            {/* <img style={{ marginLeft: 30 }} src={diceImg2} /> */}
            <button style={{ marginTop: 20 }} onClick={() => rollDice()}>Roll</button>

        </ClickWrapper>
    )
}