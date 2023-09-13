import { create } from "zustand";

export type ActionStore = {
    actions: Array<string>;
};

export const actionStore = create<ActionStore>(() => ({
    actions: new Array(),
}));


