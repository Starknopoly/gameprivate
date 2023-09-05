import { useEffect } from "react";
import { useDojo } from "../hooks/useDojo";
import { store } from "../store/store";
import { Building } from "../types";
import { buildingIdToMapid, positionToBuildingCoorp } from "../utils";
import { Tileset } from "../artTypes/world";

export default function LandStatusPanel() {
    const { account, buildings } = store();

    // subscribe building change
    const {
        phaserLayer,
        networkLayer: {
            components:{
                Player:PlayerComponent,
                Building : BuildingComponent,
                Land: LandComponent,
            },
            network: { graphSdk ,wsClient},
            systemCalls: { spawn },
        },
    } = useDojo();

    useEffect(()=>{
        const query = `subscription {
            entityUpdated{
              id
                keys
                componentNames
              updatedAt
            }
          }`;
          const subscription = wsClient
          .request({ query })
          // so lets actually do something with the response
          .subscribe({
            next({ data }) {
              if (data) {
                let entityUpdated = data.entityUpdated;
                if(entityUpdated.componentNames == LandComponent.metadata.name) {
                    fetchAllBuildings()
                } else if(entityUpdated.componentNames == BuildingComponent.metadata.name){

                }else if(entityUpdated.componentNames == PlayerComponent.metadata.name){
                    
                }
                console.log("We got something!", data);
              }
            },
          });
          return ()=>{
            subscription.unsubscribe()
          }
    }, [])

    const {
        scenes: {
            Main: {
                maps: {
                    Main: { putTileAt },
                },
            },
        }
    } = phaserLayer;

    const fetchAllBuildings = async () => {
        console.log("fetchAllBuildings");
        const allBuildings = await graphSdk.getAllBuildings()
        console.log(allBuildings);
        const edges = allBuildings.data.entities?.edges
        if (!edges) {
            return
        }
        const bs = store.getState().buildings
        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            if (element) {
                if (element.node?.components) {
                    if (element.node.components[0]) {
                        const building = element.node.components[0]
                        if (building && building.__typename == "Land") {
                            const position = parseInt(element.node.keys![0]!, 16);
                            const type = building.building_type
                            const owner = building.owner
                            const price = building.price
                            const build = new Building(type, price, owner, position)
                            if(owner==account?.address){
                                build.isMine = true;   
                            }
                            // console.log(build);
                            bs.set(position, build)
                        }
                    }
                }
            }
        }
        store.setState({ buildings: bs })
    }

    useEffect(() => {
        console.log("buildings change size:" + buildings.size);
        buildings.forEach((build, position) => {
            const coord = positionToBuildingCoorp(position)
            const mapid = buildingIdToMapid(build.type)
            putTileAt({ x: coord.x, y: coord.y }, mapid, "Foreground");
            if(build.isMine){
                console.log("buildings put is mine");
                putTileAt({ x: coord.x, y: coord.y }, Tileset.Heart, "Top");
            }
        })
    }, [buildings.keys()])

    useEffect(() => {
        if (!account) {
            return
        }
        fetchAllBuildings()
    }, [account])

    return (<div>
        <div style={{ width: 200, height: 140, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            <p>Current Land</p>
            <p>Building : Bank</p>
            <p>Owner : 0x000</p>
            <p>Price : $100</p>
        </div>
    </div>)
}