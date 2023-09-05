import { create } from "zustand";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { Account } from "starknet";
import { Player } from "../generated/graphql";
import { EntityIndex } from "@latticexyz/recs";
import { Building } from "../types";
// import { Player } from "../dojo/createSystemCalls";

export type Store = {
    networkLayer: NetworkLayer | null;
    phaserLayer: PhaserLayer | null;
    account:Account| null;
    player:Player|null;
    //entity => address
    playersAddress:Map<EntityIndex,string>;
    //position=>buidings
    buildings:Map<number,Building>
};

export const store = create<Store>(() => ({
    networkLayer: null,
    phaserLayer: null,
    account:null,
    player:null,
    playersAddress:new Map(),
    buildings:new Map()
}));

