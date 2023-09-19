/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    Player: (() => {
      const name = "Player";
      return defineComponent(
        world,
        {
          nick_name: RecsType.String,
          joined_time: RecsType.Number,
          direction: RecsType.Number,
          gold: RecsType.Number,
          position: RecsType.Number,
          steps: RecsType.Number,
          last_point: RecsType.Number,
          last_time: RecsType.Number,
          total_steps: RecsType.Number,
          banks: RecsType.Number,
          total_used_eth: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Land: (() => {
      const name = "Land";
      return defineComponent(
        world,
        {
          owner: RecsType.Number,
          building_type: RecsType.Number,
          price: RecsType.Number,
          bomb: RecsType.Boolean,
          bomber: RecsType.Number,
          bomb_price: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Townhall: (() => {
      const name = "Townhall";
      return defineComponent(
        world,
        {
          gold: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    ETH: (() => {
      const name = "ETH";
      return defineComponent(
        world,
        {
          balance: RecsType.Number,
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
