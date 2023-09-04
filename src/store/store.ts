import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { Account } from "starknet";

export type Store = {
    networkLayer: NetworkLayer | null;
    phaserLayer: PhaserLayer | null;
    account:Account| null;
};

export const store = create<Store>(() => ({
    networkLayer: null,
    phaserLayer: null,
    account:null
}));

