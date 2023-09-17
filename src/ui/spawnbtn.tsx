import { EntityIndex, setComponent } from "@latticexyz/recs";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import { useEffect, useState } from "react";
import { hexToString, stringToHex, toastError, toastInfo, toastSuccess, toastWarning, truncateString } from "../utils";
import { playerStore } from "../store/playerStore";
import { Player } from "../dojo/createSystemCalls";
import { Player2Player } from "../types";

export const SpawnBtn = () => {
    const { account,networkLayer } = store();
    const {player} = playerStore()
    const [nickName, setNickName] = useState("")

    const {
        account: {
            create,
            list,
            select,
            isDeploying
        }
    } = useDojo();

    const {
        components,
        network: { graphSdk },
        systemCalls: { spawn },
    } = networkLayer!

    useEffect(() => {
        if (account) {
            fetchAllPlayers()
        }
    }, [account])

    const showAllPlayers = (edges: any) => {
        if (!edges) {
            return
        }
        const players = new Map<EntityIndex, Player>()

        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            if (element) {
                if (element.node?.keys) {
                    if (element.node.keys[0]) {
                        const player = element.node.components[0]
                        if (player && player.__typename == "Player") {
                            if(element.node.keys[0]=="0x0"){
                                continue
                            }
                            const entityId = parseInt(element.node.keys[0]) as EntityIndex;

                            const player_ = Player2Player(player)
                            player_.entity = entityId.toString()
                            players.set(entityId,player_)

                            setComponent(components.Player, entityId, {
                                banks:player.banks,
                                position: player.position,
                                joined_time: player.joined_time,
                                nick_name: player.nick_name,
                                direction: player.direction,
                                gold: player.gold,
                                steps: player.steps,
                                last_point: player.last_point,
                                last_time: player.last_time,
                                total_steps:player.total_steps,
                            })
                        }
                    }
                }
            }
        }
        playerStore.setState({ players: players })
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
                                    banks:player.banks,
                                    position: player.position,
                                    joined_time: player.joined_time,
                                    direction: player.direction,
                                    gold: player.gold,
                                    nick_name: player.nick_name,
                                    steps: player.steps,
                                    last_point: player.last_point,
                                    last_time: player.last_time,
                                    total_steps:player.total_steps,
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
            toastError("Create burner wallet first.")
            return
        }
        // await spawn(account)
        console.log("startGame name:" + nickName + ",length:" + nickName.length);

        if (nickName.length < 2) {
            toastWarning("Name is too short.")
            return
        }
        if (nickName.length > 30) {
            toastWarning("Name is too long.")
            return
        }
        const hex = stringToHex(nickName)
        console.log("startGame name hex", hex,hex.length);
        if (hex.length > 64) {
            toastWarning("Illegal name.")
            return
        }
        await spawn(account, BigInt('0x' + hex));
        toastSuccess("Mint player success.")
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