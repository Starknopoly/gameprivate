import { SetupNetworkResult } from "./setupNetwork";
import {
  Account,
  shortString,
  GetTransactionReceiptResponse
} from "starknet";
import { EntityIndex, setComponent } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Player }: ClientComponents
) {


  const roll = async (signer: Account) => {
    try {
      console.log("roll start");
      const tx = await execute(signer, "roll", []);
      console.log("roll tx");

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });
      console.log("roll receipt:", receipt);
      const events = parseEvent(receipt);
      console.log(events);
      return events;
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

  const buyEnergy = async (
    signer: Account,
    amount: number
  ) => {
    const tx = await execute(signer, "supplement", [amount]);
    console.log("buyEnergy signer:" + signer.address + ",amount:" + amount);

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


  const buyBuilding = async (
    signer: Account,
    buidingId: number
  ) => {
    const tx = await execute(signer, "build", [buidingId]);
    console.log("buyBuilding signer:" + signer.address + ",buidingId:" + buidingId);

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
    const tx = await execute(signer, "buy", []);

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

  const spawn = async (signer: Account, nick_name: BigInt) => {
    console.log("spawn signer:" + signer.address + ",nickname:" + nick_name);

    // const entityId = parseInt(signer.address) as EntityIndex;
    try {
      const tx = await execute(signer, "spawn", [nick_name.toString()]);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      const events = parseEvent(receipt);
      console.log(events);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      const playerEvent = events[0] as Player;

      console.log("spawn event nick name", playerEvent.nick_name);

      setComponent(contractComponents.Player, entity, {
        banks: playerEvent.banks,
        nick_name: playerEvent.nick_name,
        position: playerEvent.position,
        joined_time: playerEvent.joined_time,
        direction: playerEvent.direction,
        gold: playerEvent.gold,
        steps: playerEvent.steps,
        last_point: playerEvent.last_point,
        last_time: playerEvent.last_time,
        total_steps: playerEvent.total_steps,
        total_used_eth:playerEvent.total_used_eth
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

  const explode = async (signer: Account, price: number) => {
    console.log(`explode`)
    // const entityId = parseInt(signer.address) as EntityIndex;
    try {
      const tx = await execute(signer, "explode", [price]);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      const events = parseEvent(receipt);
      console.log(events);
      // Player Townhall land
      return events;
      // const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      // const playerEvent = events[0] as Player;

      // console.log("spawn event nick name",playerEvent.nick_name);
      // store.setState({player})
    } catch (e) {
      console.log(e);
      return null
      // Player.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    } finally {
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    }
  };

  const adminRoll = async (signer: Account, position: number) => {
    console.log(`adminRoll`)
    try {
      const tx = await execute(signer, "admin_roll", [position]);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });
      console.log(receipt);

      const events = parseEvent(receipt);
      console.log(events);
      return events;
    } catch (e) {
      console.log(e);
      return null
    } finally {
    }

  };

  return {
    buyEnergy,
    spawn,
    roll,
    buyBuilding,
    buyBack,
    explode,
    adminRoll
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
  nick_name: string,
  position: number;
  joined_time: number;
  direction: number;
  gold: number;
  steps: number;
  total_steps: number;
  last_point: number;
  last_time: number;
  banks: number;
  hotels: number;
  startbucks: number;
  total_used_eth:number;
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
  receipt: GetTransactionReceiptResponse
): Array<Player | Land | Townhall> => {
  // if(typeof receipt == SuccessfulTransactionReceiptResponse)
  if (receipt.status == "NOT_RECEIVED" || receipt.status == "REJECTED" || receipt.status == "REVERTED") {
    return []
  }

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
          nick_name: (raw.data[5]),
          joined_time: Number(raw.data[6]),
          direction: Number(raw.data[7]),
          gold: Number(raw.data[8]),
          position: Number(raw.data[9]),
          steps: Number(raw.data[10]),
          last_point: Number(raw.data[11]),
          last_time: Number(raw.data[12]),
          total_steps: Number(raw.data[13]),
          banks: Number(raw.data[14]),
          total_used_eth: Number(raw.data[15]),
          hotels: 0,
          startbucks: 0
        };
        console.log("parseEvent player", raw.data[5], playerData.nick_name);
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
        if (Number(raw.data[10]) != 0) {
          landData.price = Number(raw.data[10]);
          landData.building_type = 0;
        }
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
