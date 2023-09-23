import { useEffect, useRef, useState } from "react"
import dice1 from "/assets/dices/dice1.png"
import dice2 from "/assets/dices/dice2.png"
import dice3 from "/assets/dices/dice3.png"
import dice4 from "/assets/dices/dice4.png"
import dice5 from "/assets/dices/dice5.png"
import dice6 from "/assets/dices/dice6.png"

import { ClickWrapper } from "./clickWrapper"
import '../App.css';
import { Direction, Land, Player, Townhall } from "../dojo/createSystemCalls"
import { getRandomIntBetween, getTimestamp, toastError, toastInfo, toastSuccess, toastWarning } from "../utils"
import { store } from "../store/store";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs"
import { MAP_WIDTH } from "../phaser/constants"
import { Account } from "starknet"
import { BOMB_ID, HOTEL_ID, PAUSE } from "../config"
import { PlayerState } from "../types/playerState"
import { playerStore } from "../store/playerStore"
import { actionStore } from "../store/actionstore"
import { buildStore } from "../store/buildstore"


const MaxRollTimes = 16
const dices = [dice1, dice2, dice3, dice4, dice5, dice6]

export default function RollDice() {
    const { account, networkLayer } = store();
    const { buildings: storeBuildings } = buildStore()
    const { actions } = actionStore()
    const { player, playerState, PlayerComponent } = playerStore()

    const [diceImg1, setDice1] = useState(dice1)

    const rollInternalIdRef = useRef<NodeJS.Timeout>()
    const rollCountRef = useRef(0)
    const playerEventRef = useRef<Player>()

    const rollResultRef = useRef<(Player | Land | Townhall)[]>([])

    const walkInternalIdRef = useRef<NodeJS.Timeout>()
    const walkCountRef = useRef(0)

    const {
        components,
        systemCalls: { roll },
    } = networkLayer!

    useEffect(() => {
        console.log("playerState change " + playerState);

        switch (playerState) {
            case PlayerState.IDLE:
                idle();
                break;
            case PlayerState.ROLLING:
                playRollingAnimation();
                break;
            case PlayerState.ROLL_END:
                checkRollEnd();
                break;
            case PlayerState.WALKING:
                startWalking()
                break;
            case PlayerState.WALK_END:
                walkEnd()
                break;
        }
    }, [playerState])

    const idle = () => {
        if (rollInternalIdRef.current) {
            clearInterval(rollInternalIdRef.current)
            rollInternalIdRef.current = undefined
        }
        rollCountRef.current = 0;
    }

    const changeState = (state: PlayerState) => {
        console.log("changeState " + state);
        playerStore.setState({ playerState: state })
    }

    const playRollingAnimation = () => {
        console.log(getTimestamp() + " : playRollingAnimation");
        rollCountRef.current = 0;
        if (!rollInternalIdRef.current) {
            const intervalId = setInterval(rollingAnimation, 200);
            rollInternalIdRef.current = intervalId
        }
    }

    const rollingAnimation = () => {
        // console.log(getTimestamp()+ " : rollingAnimation");
        if (rollCountRef.current == MaxRollTimes) {
            changeState(PlayerState.ROLL_END)
            return
        }
        rollCountRef.current = rollCountRef.current + 1;
        var random1 = getRandomIntBetween(0, 5);
        if (dices[random1] == diceImg1) {
            random1 = getRandomIntBetween(0, 5);
        }
        setDice1(dices[random1])
    }

    const checkRollEnd = () => {
        if (!playerEventRef.current) {
            changeState(PlayerState.ROLLING)
            return
        }
        if (rollInternalIdRef.current) {
            clearInterval(rollInternalIdRef.current)
        }

        rollInternalIdRef.current = undefined
        rollCountRef.current = 0;
        setDice1(dices[playerEventRef.current.last_point - 1])

        actions.push("Roll " + playerEventRef.current.last_point + " , walk to : " + playerEventRef.current.position)
        console.log("checkRollEnd bank " + player?.banks);

        if (player && player.banks != 0) {
            // actions.push("Banks received $"+(player.banks*20)+" Gold")
            toastSuccess("Banks received $" + (player.banks * 20) + " Gold")
        }
        actionStore.setState({ actions: actions })
        // if (b?.type == BOMB_ID) {

        // }
        changeState(PlayerState.WALKING)
    }

    const rollDice = async () => {
        if(PAUSE){
            toastInfo("System is updating...")
            return
        }
        if (!account) {
            toastError("Create burner wallet first.")
            return
        }
        if (!player) {
            toastError("Mint player first.")
            return
        }
        console.log("rolldice " + rollCountRef.current);
        if (playerState != PlayerState.IDLE) {
            return
        }

        if (player.gold == 0) {
            toastError("You are broke. Can't roll dice.")
            return
        }

        if (player.steps == 0) {
            toastWarning("Energy is 0")
            return
        }

        console.log(getTimestamp() + " : rolling Dice " + rollCountRef.current);
        toastInfo("Rolling...")
        changeState(PlayerState.ROLLING)

        console.log("click roll account:" + account.address);
        const result = await roll(account)
        console.log(getTimestamp() + " : rolling dice result", result);

        if (result && result.length > 0) {
            rollResultRef.current = result
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.type == "Player" && element.entity == account.address) {
                    playerEventRef.current = element as Player
                }
            }
        } else {
            toastError("Rolling too quick!")
            changeState(PlayerState.IDLE)
        }
    }

    const startWalking = () => {
        walkCountRef.current = 0
        const intervalId = setInterval(walk, 600);
        walkInternalIdRef.current = intervalId
    }

    const walkEnd = () => {
        const b = storeBuildings.get(playerEventRef.current!.position)
        if (b?.type == HOTEL_ID) {
            const price = (b.price * 0.1).toFixed(2)
            actions.push("There is a hotel, you paid $" + price)
            toastInfo("You paid $" + price + " for hotel.")
        }
        if (rollResultRef.current.length != 0) {
            for (let index = 0; index < rollResultRef.current.length; index++) {
                const element = rollResultRef.current[index];
                if (element.type == "Land") {
                    const land = element as Land;
                    if (land.building_type == 0) {
                        toastError("BOOM! You lost $" + (land.price * 2) + "!");
                    }
                }
            }
        }
        rollResultRef.current = []
        walkCountRef.current = 0
        playerEventRef.current = undefined
        clearInterval(walkInternalIdRef.current)
        walkInternalIdRef.current = undefined
        changeState(PlayerState.IDLE)
    }

    const walk = async () => {
        if (walkCountRef.current == playerEventRef.current?.last_point) {
            changeState(PlayerState.WALK_END)
            return
        }
        if (!account) {
            return
        }
        walkCountRef.current = walkCountRef.current + 1
        move(account, Direction.Right, playerEventRef.current!)
    }

    const move = (signer: Account, direction: Direction, playerEvent: Player) => {
        const entityId = parseInt(signer.address) as EntityIndex;
        console.log("move", entityId, signer.address);
        const value = getComponentValue(PlayerComponent, entityId)
        console.log(value);
        if (!value) {
            return
        }
        const size = MAP_WIDTH
        var position:number = value.position as number;
        if (direction == Direction.Left) {
            position -= 1
            if (position < 0) {
                position = size * size
            }
        }
        if (direction == Direction.Right) {
            position += 1
            if (position == size * size + 1) {
                position = 1
            }
        }

        setComponent(components.Player, entityId, {
            banks: playerEvent.banks,
            position: position,
            nick_name: playerEvent.nick_name,
            joined_time: playerEvent.joined_time,
            direction: playerEvent.direction,
            gold: playerEvent.gold,
            steps: playerEvent.steps,
            last_point: playerEvent.last_point,
            last_time: playerEvent.last_time,
            total_steps: playerEvent.total_steps,
            total_used_eth: playerEvent.total_used_eth
        })
    }

    return (
        <ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
            <img src={diceImg1} />
            {/* <img style={{ marginLeft: 30 }} src={diceImg2} /> */}
            <button style={{ marginTop: 20 }} onClick={() => rollDice()}>Roll</button>

        </ClickWrapper>
    )
}