import { SetupNetworkResult } from "./setupNetwork";
import {
  Account,
  InvokeTransactionReceiptResponse,
  num,
  shortString,
} from "starknet";
import { EntityIndex, setComponent } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Player }: ClientComponents
) {
  const roll = async (signer: Account) => {
    console.log("roll signer:" + signer.address);
    // const entityId = parseInt(signer.address) as EntityIndex;

    // TODO: override steps

    try {
      const tx = await execute(signer, "roll", []);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log(receipt);

      const events = parseEvent(receipt);
      // const entity = parseInt(events[0].entity.toString()) as EntityIndex

      const playerEvent = events[0] as Player;
      // setComponent(contractComponents.Player, entity, {
      //     position: playerEvent.position,
      //     joined_time: playerEvent.joined_time,
      //     direction: playerEvent.direction,
      //     gold: playerEvent.gold,
      //     steps: playerEvent.steps,
      //     last_point: playerEvent.last_point,
      //     last_time: playerEvent.last_time
      // })
      return playerEvent;
    } catch (e) {
      console.log(e);
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    } finally {
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    }
    return undefined;
  };

  const buyBuilding = async (
    signer: Account,
    buidingId: number
  ) => {
    const tx = await execute(signer, "build", [buidingId]);

    // TODO: override gold

    console.log(tx);
    const receipt = await signer.waitForTransaction(tx.transaction_hash, {
      retryInterval: 100,
    });

    console.log(receipt);

    const events = parseEvent(receipt);
    console.log(events);
    // return player,land
    return events;
  };

  //TODO : buy back on chain
  const buyBack = async (signer: Account) => {
    const tx = await execute(signer, "buy", [1]);

    // TODO: override gold

    console.log(tx);
    const receipt = await signer.waitForTransaction(tx.transaction_hash, {
      retryInterval: 100,
    });

    console.log(receipt);

    const events = parseEvent(receipt);
    console.log(events);
    // return player1 player2 townhall land
    return events;
  };

  const spawn = async (signer: Account) => {
    console.log("spawn signer:" + signer.address);

    // const entityId = parseInt(signer.address) as EntityIndex;
    try {
      const tx = await execute(signer, "spawn", []);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      const events = parseEvent(receipt);
      console.log(events);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      const playerEvent = events[0] as Player;
      setComponent(contractComponents.Player, entity, {
        position: playerEvent.position,
        joined_time: playerEvent.joined_time,
        direction: playerEvent.direction,
        gold: playerEvent.gold,
        steps: playerEvent.steps,
        last_point: playerEvent.last_point,
        last_time: playerEvent.last_time,
      });
      return playerEvent;
      // store.setState({player})
    } catch (e) {
      console.log(e);
      // Player.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    } finally {
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    }
    return null;
  };

  return {
    spawn,
    roll,
    buyBuilding,
    buyBack,
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
  Player = "Player",
  Land = "Land",
  Townhall = "Townhall",
}

export interface BaseEvent {
  type: ComponentEvents;
  entity: string;
}

export interface Player extends BaseEvent {
  position: number;
  joined_time: number;
  direction: number;
  gold: number;
  steps: number;
  last_point: number;
  last_time: number;
}

export interface Land extends BaseEvent {
  position: number;
  owner: string;
  building_type: number;
  price: number;
}

export interface Townhall extends BaseEvent {
  id: number;
  gold: number;
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
): Array<Player | Land | Townhall> => {
  if (!receipt.events) {
    throw new Error(`No events found`);
  }

  let events: Array<Player | Land | Townhall> = [];

  for (let raw of receipt.events) {
    const decodedEventType = shortString.decodeShortString(raw.data[0]);

    switch (decodedEventType) {
      case ComponentEvents.Player:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Moves event.");
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

      case ComponentEvents.Land:
        const landData: Land = {
          type: ComponentEvents.Land,
          entity: raw.data[2],
          position: Number(raw.data[2]),
          owner: String(raw.data[5]),
          building_type: Number(raw.data[6]),
          price: Number(raw.data[7]),
        };

        events.push(landData);
        break;

      case ComponentEvents.Townhall:
        const townHall: Townhall = {
          type: ComponentEvents.Townhall,
          entity: raw.data[2],
          id: Number(raw.data[2]),
          gold: Number(raw.data[5]),
        };

        events.push(townHall);
        break;

      default:
        throw new Error("Unsupported event type.");
    }
  }

  return events;
};
