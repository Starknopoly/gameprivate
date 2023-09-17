import { create } from "zustand";

export type MouseStore = {
    x:0,
    y:0
};

export const mouseStore = create<MouseStore>(() => ({
   x:0,
   y:0
}));