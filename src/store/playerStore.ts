import { create } from "zustand";
import { PlayerState } from "../types/playerState";
import { Player } from "../dojo/createSystemCalls";

export type PlayerStore = {
    player: Player | null;
    playerState: PlayerState,
    PlayerComponent:any
};

export const playerStore = create<PlayerStore>(() => ({
    player: null,
    playerState: PlayerState.IDLE,
    PlayerComponent:null
}));


