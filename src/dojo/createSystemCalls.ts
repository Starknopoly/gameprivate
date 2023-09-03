import { SetupNetworkResult } from "./setupNetwork";
import { Account, InvokeTransactionReceiptResponse, num, shortString } from "starknet";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { POSITION_OFFSET } from "../phaser/constants";
import { WorldCoord } from "@latticexyz/phaserx/dist/types";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Player }: ClientComponents
) {
    const move = (signer: Account, direction: Direction, playerEvent: Player) => {
        const entityId = parseInt(signer.address) as EntityIndex;

        //TODO : request Player on chain
        const value = getComponentValue(contractComponents.Player, entityId)
        console.log(value);
        if (!value) {
            return
        }
        var position = value.position
        if (direction == Direction.Left) {
            position -= 1
            if (position < 0) {
                position = 10000
            }
        }
        if (direction == Direction.Right) {
            position += 1
        }

        setComponent(contractComponents.Player, entityId, {
            position: position,
            joined_time: playerEvent.joined_time,
            direction: playerEvent.direction,
            gold: playerEvent.gold,
            steps: playerEvent.steps,
            last_point: playerEvent.last_point,
            last_time: playerEvent.last_time
        })
    }

    const roll = async (signer: Account) => {
        console.log(signer.address)

        const entityId = parseInt(signer.address) as EntityIndex;

        // TODO: override steps

        try {
            const tx = await execute(signer, "roll", []);

            console.log(tx)
            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

            console.log(receipt)

            const events = parseEvent(receipt)
            const entity = parseInt(events[0].entity.toString()) as EntityIndex

            const playerEvent = events[0] as Player
            // setComponent(contractComponents.Player, entity, {
            //     position: playerEvent.position,
            //     joined_time: playerEvent.joined_time,
            //     direction: playerEvent.direction,
            //     gold: playerEvent.gold,
            //     steps: playerEvent.steps,
            //     last_point: playerEvent.last_point,
            //     last_time: playerEvent.last_time
            // })
            return playerEvent
        } catch (e) {
            console.log(e)
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }
        return undefined
    }

    //TODO : buy building on chain
    const buyBuilding = async (signer: Account, coord: WorldCoord, buidingId: number) => {

    }

    //TODO : buy back on chain
    const buyBack = async (signer: Account, coord: WorldCoord) => {

    }

    const spawn = async (signer: Account) => {

        const entityId = parseInt(signer.address) as EntityIndex;
        try {
            const tx = await execute(signer, "spawn", []);

            console.log(tx)
            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

            const events = parseEvent(receipt)
            console.log(events);
            const entity = parseInt(events[0].entity.toString()) as EntityIndex

            const playerEvent = events[0] as Player;
            setComponent(contractComponents.Player, entity, {
                position: playerEvent.position,
                joined_time: playerEvent.joined_time,
                direction: playerEvent.direction,
                gold: playerEvent.gold,
                steps: playerEvent.steps,
                last_point: playerEvent.last_point,
                last_time: playerEvent.last_time
            })
        } catch (e) {
            console.log(e)
            // Player.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }
    };

    return {
        move,
        spawn,
        roll,
        buyBuilding,
        buyBack
    };
}


// TODO: Move types and generalise this

export enum Direction {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
}

export enum ComponentEvents {
    Moves = "Moves",
    Position = "Position",
    Player = "Player"
}

export interface BaseEvent {
    type: ComponentEvents;
    entity: string;
}

export interface Player extends BaseEvent {
    position: number,
    joined_time: number,
    direction: number,
    gold: number,
    steps: number,
    last_point: number,
    last_time: number,

}

export interface Moves extends BaseEvent {
    remaining: number;
}

export interface Position extends BaseEvent {
    x: number;
    y: number;
}

export const parseEvent = (
    receipt: InvokeTransactionReceiptResponse
): Array<Player | Moves> => {
    if (!receipt.events) {
        throw new Error(`No events found`);
    }

    let events: Array<Player | Moves> = [];

    for (let raw of receipt.events) {
        const decodedEventType = shortString.decodeShortString(raw.data[0]);

        switch (decodedEventType) {
            case ComponentEvents.Player:
                if (raw.data.length < 6) {
                    throw new Error('Insufficient data for Moves event.');
                }

                const playerData: Player = {
                    type: ComponentEvents.Player,
                    entity: raw.data[2],
                    joined_time: Number(raw.data[5]),
                    direction: Number(raw.data[6]),
                    gold: Number(raw.data[7]),
                    position: Number(raw.data[8]),
                    steps: Number(raw.data[9]),
                    last_point: Number(raw.data[10]),
                    last_time: Number(raw.data[11]),
                };

                events.push(playerData);
                break;

            case ComponentEvents.Position:
                if (raw.data.length < 7) {
                    throw new Error('Insufficient data for Position event.');
                }

                const positionData: Position = {
                    type: ComponentEvents.Position,
                    entity: raw.data[2],
                    x: Number(raw.data[5]) - POSITION_OFFSET,
                    y: Number(raw.data[6]) - POSITION_OFFSET,
                };

                // events.push(positionData);
                break;

            default:
                throw new Error('Unsupported event type.');
        }
    }

    return events;
};