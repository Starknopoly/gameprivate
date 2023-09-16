import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { Account, Provider } from "starknet";
import { Building } from "../types";
import { Camera } from "@latticexyz/phaserx";
// import { Player } from "../dojo/createSystemCalls";

export type Store = {
    networkLayer: NetworkLayer | null;
    phaserLayer: PhaserLayer | null;
    account: Account | null;
    actions: Array<string>;
    //position=>buidings
    buildings: Map<number, Building>,
    treasury: 0,
    camera:Camera|null
};

export const store = create<Store>(() => ({
    networkLayer: null,
    phaserLayer: null,
    account: null,
    actions: new Array(),
    buildings: new Map(),
    treasury: 0,
    camera:null
}));


