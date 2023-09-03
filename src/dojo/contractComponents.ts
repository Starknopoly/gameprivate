/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    Player: (() => {
      const name = "Player";
      return defineComponent(
        world,
        {
          joined_time: RecsType.Number,
          direction: RecsType.Number,
          gold: RecsType.Number,
          position: RecsType.Number,  
          steps: RecsType.Number, 
          last_point: RecsType.Number, // 最近一次掷出的点数
          last_time: RecsType.Number, //
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
  };
}
