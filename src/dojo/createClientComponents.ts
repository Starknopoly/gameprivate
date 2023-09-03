import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,
        Player: overridableComponent(contractComponents.Player),
        // Moves: overridableComponent(contractComponents.Moves),
    };
}