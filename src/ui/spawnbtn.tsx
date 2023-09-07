import { EntityIndex, setComponent } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import { useEffect, useState } from "react";
import { hexToString, stringToHex, truncateString } from "../utils";

export const SpawnBtn = () => {
    const { account, player } = store();
    const [nickName, setNickName] = useState("")

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

    useEffect(() => {
        if (account) {
            fetchAllPlayers()
        }
    }, [account])

    const showAllPlayers = (edges: any) => {
        if (!edges) {
            return
        }
        const playersAddress = new Map<EntityIndex, string>()

        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            if (element) {
                if (element.node?.keys) {
                    if (element.node.keys[0]) {
                        const player = element.node.components[0]
                        if (player && player.__typename == "Player") {
                            const entityId = parseInt(element.node.keys[0]) as EntityIndex;
                            playersAddress.set(entityId, element.node.keys[0])
                        }
                    }
                }
            }
        }
        store.setState({ playersAddress: playersAddress })
        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            if (element) {
                if (element.node?.keys) {
                    if (element.node.keys[0]) {
                        const player = element.node.components[0]
                        if (player && player.__typename == "Player") {
                            const entityId = parseInt(element.node.keys[0]) as EntityIndex;
                            setComponent(components.Player, entityId, {
                                position: player.position,
                                joined_time: player.joined_time,
                                nick_name: player.nick_name,
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
    }

    const fetchAllPlayers = async () => {
        console.log("fetchAllPlayers");

        if (!account) {
            return false
        }
        const allPlayers = await graphSdk.getAllPlayers()
        console.log("startGame allPlayers");
        console.log(allPlayers);
        const edges = allPlayers.data.entities?.edges
        showAllPlayers(edges)
        const entityId = parseInt(account.address) as EntityIndex;
        console.log("startGame account.address:" + account.address + ",entityId:" + entityId);

        if (edges) {
            console.log("start game total players:" + edges.length);
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
                                    nick_name: player.nick_name,
                                    steps: player.steps,
                                    last_point: player.last_point,
                                    last_time: player.last_time
                                })
                                return true
                            }
                        }
                    }
                }
            }
        }
        return false
    }

    const startGame = async () => {
        if (!account) {
            alert("Create burner wallet first.")
            return
        }
        // await spawn(account)
        console.log("startGame name:" + nickName + ",length:" + nickName.length);

        if (nickName.length < 2) {
            alert("Name is too short.")
            return
        }
        if (nickName.length > 30) {
            alert("Name is too long.")
            return
        }
        const hex = stringToHex(nickName)
        console.log("startGame name hex", hex);

        await spawn(account, BigInt('0x' + hex));

        var playersAddress = store.getState().playersAddress
        const entity = parseInt(account.address) as EntityIndex;
        playersAddress?.set(entity, account.address)
        store.setState({ playersAddress: playersAddress })
    }

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setNickName(value);
    }

    return (
        <ClickWrapper>
            {
                account ? <></> : <button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>
            }

            <div className="card">
                Account : {" "}
                <select onChange={e => select(e.target.value)}>
                    {list().map((account, index) => {
                        return <option value={account.address} key={index}>{truncateString(account.address, 10, 10)}</option>
                    })}
                </select>
            </div>
            {
                player ? <></> :
                    <div>
                        <input value={nickName} onChange={inputChange} placeholder="input name" />
                        <button
                            onClick={() => {
                                startGame();
                            }}
                        >
                            Mint Player
                        </button>
                    </div>

            }

        </ClickWrapper>
    );
};