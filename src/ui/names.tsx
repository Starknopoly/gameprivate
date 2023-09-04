import { useEffect, useMemo, useState } from "react";
import { store } from "../store/store";
import { useDojo } from "../hooks/useDojo";
import { EntityIndex, Has, defineSystem, getComponentValueStrict } from "@latticexyz/recs";
import { positionToCoorp, truncateString } from "../utils";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";

export default function NamesUI() {
    const { account, player: storePlayer, playersAddress } = store();
    const { phaserLayer: layer } = useDojo()
    const {
        world,
        scenes: {
            Main: { },
        },
        networkLayer: {
            components: { Player }
        },
    } = layer;

    class NameLabel {
        public name: string | undefined
        public entity: EntityIndex | undefined
        public x: number = 0
        public y: number = 0
    }

    // const [nameLables,setNameLabels]=useState<NameLabel[]>([])
    const [nameLablesMap, setNameLabels] = useState<Map<EntityIndex, NameLabel>>(new Map());

    const addOrUpdateName = (entity: EntityIndex, value: NameLabel) => {
        setNameLabels(prevMap => {
            // 创建一个新的Map对象，以确保状态的不可变性
            const newMap = new Map(prevMap);
            newMap.set(entity, value);
            return newMap;
        });
    };

    useEffect(() => {
        if (!layer || !account) {
            return
        }

        defineSystem(world, [Has(Player)], ({ entity }) => {
            const player_ = getComponentValueStrict(Player, entity);
            // const address = playersAddress?.get(entity)
            // if (account) {
            //     const entityId = parseInt(account.address) as EntityIndex;
            //     if (entity == entityId) {
            //         store.setState({ player: player_ })
            //     } else {
            //         return
            //     }
            // }
            // console.log("defineSystem account:" + account);
            // if (player_) {
            //     setPlayer(player_)
            // }
            const position = player_.position - 1
            const { x, y } = positionToCoorp(position)

            const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
            const nameLabel = new NameLabel()
            nameLabel.entity = entity
            // nameLabel.name = address
            nameLabel.x = pixelPosition.x
            nameLabel.y = pixelPosition.y
            addOrUpdateName(entity, nameLabel)
            // const ycount = Math.floor(position / size)

            // var x = position % size
            // if (ycount % 2 == 0) {
            //     x = position % size
            // }
            // if (ycount % 2 == 1) {
            //     x = size - position % size
            // }
            // const y = ycount * 2 + 1
            // defineSystem position:5580,x=-31,y=61
            console.log("defineSystem position:" + player_.position + ",x=" + x + ",y=" + y);
        });
    }, [layer, account])

    // const showNames = useMemo(() => {
    //     var result = <></>
    //     nameLablesMap.forEach((value, key) => {
    //         console.log(key, value);
    //         const address = playersAddress?.get(key)
    //         console.log(key, address);

    //     });
    //     return (<div>

    //     </div>)
    // }, [nameLablesMap])

    return (<div>
        {Array.from(nameLablesMap.entries()).map(([key, value]) => (
            <p key={key} style={{backgroundColor:"rgba(0,0,0,0.5)",borderRadius:20,color:"white",width:"100px",paddingLeft:"15px"}}>
                {
                    truncateString(playersAddress?.get(key)!,4,4)
                }
            </p>
        ))}

    </div>)
}