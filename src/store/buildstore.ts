import { create } from "zustand";
import { Building } from "../types";
// import { Player } from "../dojo/createSystemCalls";

export type BuildStore = {
    //position=>buidings
    buildings: Map<number, Building>,
};

export const buildStore = create<BuildStore>(() => ({
    buildings: new Map()
}));


