import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { Account, Provider } from "starknet";
import { Camera } from "@latticexyz/phaserx";
// import { Player } from "../dojo/createSystemCalls";

export type Store = {
    networkLayer: NetworkLayer | null;
    phaserLayer: PhaserLayer | null;
    account: Account | null;
    actions: Array<string>;
    treasury: 0,
    camera:Camera|null
};

export const store = create<Store>(() => ({
    networkLayer: null,
    phaserLayer: null,
    account: null,
    actions: new Array(),
    treasury: 0,
    camera:null
}));


