import { EntityIndex, setComponent } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";
import { Player } from "../dojo/createSystemCalls";

export const SpawnBtn = () => {
    const {
        account: {
            create,
            list,
            account,
            select,
            isDeploying
        },
        networkLayer: {
            components,
            network: { graphSdk },
            systemCalls: { spawn },
        },
    } = useDojo();

    const startGame = async () => {
        const allPlayers = await graphSdk.getAllPlayers()
        console.log(allPlayers);
        const edges = allPlayers.data.entities?.edges

        const entityId = parseInt(account.address) as EntityIndex;
        console.log("startGame account.address:" + account.address + ",entityId:" + entityId);

        if (edges) {
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
        spawn(account)
    }

    return (
        <ClickWrapper>
            <button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>
            <div className="card">
                select signer:{" "}
                <select onChange={e => select(e.target.value)}>
                    {list().map((account, index) => {
                        return <option value={account.address} key={index}>{account.address}</option>
                    })}
                </select>
            </div>
            <button
                onClick={() => {
                    startGame();
                }}
            >
                Start Game
            </button>
        </ClickWrapper>
    );
};