import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { Account } from "starknet";
import { Player } from "../generated/graphql";
// import { Player } from "../dojo/createSystemCalls";

export type Store = {
    networkLayer: NetworkLayer | null;
    phaserLayer: PhaserLayer | null;
    account:Account| null;
    player:Player|null;
};

export const store = create<Store>(() => ({
    networkLayer: null,
    phaserLayer: null,
    account:null,
    player:null
}));

