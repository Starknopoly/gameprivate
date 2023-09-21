import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ClickWrapper } from "./clickWrapper";
import { playerStore } from "../store/playerStore";
import { hexToString } from "../utils";
import { buildStore } from "../store/buildstore";
import { EntityIndex } from "@latticexyz/recs";
import { BANK_ID, HOTEL_ID, STARKBUCKS_ID } from "../config";
import { Player } from "../dojo/createSystemCalls";
import { store } from "../store/store";
type SortOrder = 'asc' | 'desc';
import twitter from "/twitterlogo.png"

export default function Leaderboard() {
    const [showPanel, setShow] = useState(false)
    const { players } = playerStore()
    const { buildings } = buildStore()
    const { account } = store()

    const [page, setPage] = useState(1)

    const [sortField, setSortField] = useState<keyof Player | null>("total_steps");
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [sortedData, setsortedData] = useState<Player[]>([])


    useEffect(() => {
        console.log(showPanel);
        if (showPanel) {
            handleData()
        }
    }, [showPanel])

    const handleData = () => {
        const tempPlayers = new Map<EntityIndex, Player>(players)

        buildings.forEach((build, _) => {
            const entity = parseInt(build.owner) as EntityIndex;
            const player = tempPlayers.get(entity)
            if (player) {
                switch (build.type) {
                    case BANK_ID: player.banks += 1; break;
                    case STARKBUCKS_ID: player.startbucks += 1; break;
                    case HOTEL_ID: player.hotels += 1; break;
                }
                tempPlayers.set(entity, player);
            }
        })
        playerStore.setState({ players: tempPlayers })


        const sortedData = Array.from(players.values()).sort((a, b) => {
            if (sortField) {
                if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
                if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setsortedData(sortedData)
    }

    const getYourRank = useMemo(() => {
        if (!account) {
            return <span>0</span>
        }

        for (let index = 0; index < sortedData.length; index++) {
            const row = sortedData[index];
            if ((row.entity) === parseInt(account.address).toString()) {
                console.log("is same ", (row.entity), parseInt(account.address).toString());
                console.log(index);

                return <span>{index + 1}</span>
            } else {
                console.log("Not same ", (row.entity), parseInt(account.address).toString());

            }
        }
        return <span>0</span>
    }, [sortedData])

    const add = () => {
        setPage(pre => pre + 1)
    }

    const sub = () => {
        if (page == 0) {
            return
        }
        setPage(pre => pre - 1)
    }

    useEffect(() => {

    }, [page])

    const getTable = useMemo(() => {

    }, [page, sortedData])

    const gotoGitbook = ()=>{
        window.open("https://starknopoly.gitbook.io/starknopoly/how-to-play/quick-start")
    }

    return (
        <ClickWrapper>
            <BottomLeftContainer>
                <button onClick={() => setShow(pre => !pre)}>Leaderboard 🏆</button>
                <button onClick={()=>gotoGitbook()}>How to Play 📖</button>
            </BottomLeftContainer>

            <CenterContainer>
                {
                    showPanel && <div style={{ width: 480, height: 600, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 1)", padding: 10, borderRadius: 15 }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <p style={{ marginLeft: 180 }}>Leaderboard</p>
                            <button style={{ height: 25, marginLeft: 180 }} onClick={() => setShow(false)}>X</button>
                        </div>

                        <table border={1} style={{ marginLeft: 15 }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>Rank</th>
                                    <th style={{ width: '120px' }}>Name</th>
                                    <th style={{ width: '80px' }}>Steps</th>
                                    <th style={{ width: '80px' }}>Gold</th>
                                    <th style={{ width: '80px' }}>Build</th>
                                </tr>
                            </thead>
                        </table>
                        <table border={1} style={{ marginLeft: 15, textAlign: 'center' }}>
                            <tbody>
                                {page && sortedData.map((row, index) => (
                                    (index > 20 * (page - 1)-1 && index < 20 * page) &&
                                    <tr key={row.entity}>
                                        <td style={{ width: '50px' }}>{index + 1}</td>
                                        <td style={{ width: '120px' }}>{hexToString(row.nick_name)}</td>
                                        <td style={{ width: '80px' }}>{row.total_steps}</td>
                                        <td style={{ width: '80px' }}>{row.gold}</td>
                                        <td style={{ width: '80px' }}>{row.banks + row.startbucks + row.hotels}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ display: "flex", flexDirection: "row", marginLeft: 200 }}>
                            <p style={{ cursor: "pointer" }} onClick={() => sub()}>-</p>
                            <p style={{ marginLeft: 15, marginRight: 15 }}>{page}</p>
                            <p style={{ cursor: "pointer" }} onClick={() => add()}>+</p>
                        </div>
                        <p>Your Rank : {getYourRank}</p>
                    </div>
                }
            </CenterContainer>
        </ClickWrapper>)
}


const CenterContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;


const BottomLeftContainer = styled.div`
    position: absolute;
    top: 15%;
    left: 3%;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
