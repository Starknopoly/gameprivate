import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { Account } from "starknet";
import { Player } from "../generated/graphql";
import { EntityIndex } from "@latticexyz/recs";
// import { Player } from "../dojo/createSystemCalls";

export type Store = {
    networkLayer: NetworkLayer | null;
    phaserLayer: PhaserLayer | null;
    account:Account| null;
    player:Player|null;
    playersAddress:Map<EntityIndex,string>|null;
};

export const store = create<Store>(() => ({
    networkLayer: null,
    phaserLayer: null,
    account:null,
    player:null,
    playersAddress:null
}));

