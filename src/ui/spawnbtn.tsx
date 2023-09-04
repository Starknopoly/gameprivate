import { EntityIndex, setComponent } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import { useEffect } from "react";

export const SpawnBtn = () => {
    const {account,player} = store();

    const {
        account: {
            create,
            list,
            select,
            isDeploying
        },
        networkLayer: {
            components,
            network: { graphSdk },
            systemCalls: { spawn },
        },
    } = useDojo();

    const showAllPlayers =async (edges:any) => {
        const playersAddress = new Map<EntityIndex,string>()

        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            // console.log(element);
            if (element) {
                if (element.node?.keys) {
                    if (element.node.keys[0]) {
                        const player = element.node.components[0]
                        if (player && player.__typename=="Player") {
                            const entityId = parseInt(element.node.keys[0]) as EntityIndex;
                            playersAddress.set(entityId,element.node.keys[0])
                            // console.log("entityId:"+entityId);
                            
                            setComponent(components.Player, entityId, {
                                position: player.position,
                                joined_time: player.joined_time,
                                direction: player.direction,
                                gold: player.gold,
                                steps: player.steps,
                                last_point: player.last_point,
                                last_time: player.last_time
                            })
                        }
                    }
                }
            }
        }
        store.setState({playersAddress:playersAddress})
    }

    const startGame = async () => {
        if(!account){
            alert("Create burner wallet first.")
            return
        }
        // await spawn(account)
        console.log("startGame");
        
        const allPlayers = await graphSdk.getAllPlayers()
        console.log("startGame allPlayers:");
        console.log(allPlayers);
        const edges = allPlayers.data.entities?.edges

        const entityId = parseInt(account.address) as EntityIndex;
        console.log("startGame account.address:" + account.address + ",entityId:" + entityId);

        if (edges) {
            console.log("start game total players:"+edges.length);
            showAllPlayers(edges)
            for (let index = 0; index < edges.length; index++) {
                const element = edges[index];
                if (element) {
                    if (element.node?.keys) {
                        if (element.node.keys[0] == account.address) {
                            const players = element.node.components
                            if (players && players[0]) {
                                console.log(players[0]);
                                const player = players[0] as any
                                setComponent(components.Player, entityId, {
                                    position: player.position,
                                    joined_time: player.joined_time,
                                    direction: player.direction,
                                    gold: player.gold,
                                    steps: player.steps,
                                    last_point: player.last_point,
                                    last_time: player.last_time
                                })
                                return
                            }
                        }
                    }
                }
            }
        }
        console.log("click spwan account:"+account.address);
        
        await spawn(account)
    }

    return (
        <ClickWrapper>
            {
                account?<></>:<button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>
            }
            
            <div className="card">
                Account : {" "}
                <select onChange={e => select(e.target.value)}>
                    {list().map((account, index) => {
                        return <option value={account.address} key={index}>{account.address}</option>
                    })}
                </select>
            </div>
            {
                player?<></>: <button
                onClick={() => {
                    startGame();
                }}
            >
                Start Game
            </button>
            }
           
        </ClickWrapper>
    );
};