import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { Account } from "starknet";
import { Player } from "../generated/graphql";
import { EntityIndex } from "@latticexyz/recs";
import { Building } from "../types";
import { PlayerState } from "../types/playerState";
import { ReactNode } from "react";
// import { Player } from "../dojo/createSystemCalls";

export type Store = {
    networkLayer: NetworkLayer | null;
    phaserLayer: PhaserLayer | null;
    account: Account | null;
    player: Player | null;
    actions: Array<string>;
    //entity => address
    playersAddress: Map<EntityIndex, string>;
    //position=>buidings
    buildings: Map<number, Building>,
    playerState: PlayerState,
    treasury: 0,
    tooltip: { show: boolean, x: number, y: number, content: ReactNode },
};

export const store = create<Store>(() => ({
    networkLayer: null,
    phaserLayer: null,
    account: null,
    player: null,
    actions: new Array(),
    playersAddress: new Map(),
    buildings: new Map(),
    playerState: PlayerState.IDLE,
    treasury: 0,
    tooltip: { show: false, x: 0, y: 0, content: null }
}));

