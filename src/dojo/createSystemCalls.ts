import { SetupNetworkResult } from "./setupNetwork";
import { Account, InvokeTransactionReceiptResponse, num, shortString } from "starknet";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { updatePositionWithDirection } from "../utils";
import { POSITION_OFFSET } from "../phaser/constants";
import { WorldCoord } from "@latticexyz/phaserx/dist/types";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Player }: ClientComponents
) {
    //TODO : Roll the dice on chain
    const roll =async (signer:Account) => {
        
    }

    //TODO : buy building on chain
    const buyBuilding =async (signer:Account,coord:WorldCoord,buidingId:number) => {
        
    }

    //TODO : buy back on chain
    const buyBack =async (signer:Account,coord:WorldCoord) => {
        
    }

    const spawn = async (signer: Account) => {

        const entityId = parseInt(signer.address) as EntityIndex;

        // const positionId = uuid();
        // Position.addOverride(positionId, {
        //     entity: entityId,
        //     value: { x: 0, y: 1 },
        // });

        // const movesId = uuid();
        // Moves.addOverride(movesId, {
        //     entity: entityId,
        //     value: { remaining: 100 },
        // });

        try {
            const tx = await execute(signer, "spawn", []);

            console.log(tx)
            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

            const events = parseEvent(receipt)
            console.log(events);
            const entity = parseInt(events[0].entity.toString()) as EntityIndex

            const playerEvent = events[0] as Player;
            setComponent(contractComponents.Player, entity, { position: playerEvent.position })

            // const movesEvent = events[0] as Moves;
            // setComponent(contractComponents.Moves, entity, { remaining: movesEvent.remaining })

            // const positionEvent = events[1] as Position;
            // setComponent(contractComponents.Position, entity, { x: positionEvent.x, y: positionEvent.y+1 })
        } catch (e) {
            console.log(e)
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }
    };

    const move = async (signer: Account, direction: Direction) => {

        console.log(signer.address)

        const entityId = parseInt(signer.address) as EntityIndex;

        const positionId = uuid();
        Position.addOverride(positionId, {
            entity: entityId,
            value: updatePositionWithDirection(direction, getComponentValue(Position, entityId) as Position),
        });

        const movesId = uuid();
        Moves.addOverride(movesId, {
            entity: entityId,
            value: { remaining: (getComponentValue(Moves, entityId)?.remaining || 0) - 1 },
        });

        try {
            const tx = await execute(signer, "move", [direction]);

            console.log(tx)
            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

            console.log(receipt)

            const events = parseEvent(receipt)
            const entity = parseInt(events[0].entity.toString()) as EntityIndex

            const movesEvent = events[0] as Moves;
            setComponent(contractComponents.Moves, entity, { remaining: movesEvent.remaining })

            const positionEvent = events[1] as Position;
            setComponent(contractComponents.Position, entity, { x: positionEvent.x, y: positionEvent.y+1 })
        } catch (e) {
            console.log(e)
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        } finally {
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        }
    };

    return {
        spawn,
        move,
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
    position: number
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
                    position: Number(raw.data[4]),
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