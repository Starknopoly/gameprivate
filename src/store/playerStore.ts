import { create } from "zustand";
import { PlayerState } from "../types/playerState";
import { Player } from "../dojo/createSystemCalls";
import { EntityIndex } from "@latticexyz/recs";

export type PlayerStore = {
    player: Player | null;
    playerState: PlayerState,
    PlayerComponent:any,
    players:Map<EntityIndex,Player>,
};

export const playerStore = create<PlayerStore>(() => ({
    player: null,
    playerState: PlayerState.IDLE,
    PlayerComponent:null,
    players:new Map()
}));


