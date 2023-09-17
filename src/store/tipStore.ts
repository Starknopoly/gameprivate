import { create } from "zustand";
import { ReactNode } from "react";
// import { Player } from "../dojo/createSystemCalls";

export type TipStore = {
    tooltip: { show: boolean, x: number, y: number, content: ReactNode },
};

export const tipStore = create<TipStore>(() => ({
    tooltip: { show: false, x: 0, y: 0, content: null }
}));


