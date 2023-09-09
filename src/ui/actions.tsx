import { useEffect, useState } from "react";
import { BuildingList, OptionType } from "./buildinglist";
import { ClickWrapper } from "./clickWrapper";
import { useDojo } from "../hooks/useDojo";
import { Tileset } from "../artTypes/world";
import { store } from "../store/store";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { MAP_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { mapIdToBuildingId, positionToBuildingCoorp, positionToCoorp } from "../utils";
import { BANK_ID, BUILDING_PRICES, HOTEL_ID, STARKBUCKS_ID } from "../config";
import { Player } from "../dojo/createSystemCalls";
import { EntityIndex, setComponent } from "@latticexyz/recs";

export default function ActionsUI() {
    const { account, player, buildings } = store();
    const { phaserLayer, networkLayer: { components } } = useDojo()

    const {
        scenes: {
            Main: {
                camera,
                maps: {
                    Main: { putTileAt },
                },
            },
        },
        networkLayer: {
            systemCalls: { buyBuilding, buyBack, explode },
        },
    } = phaserLayer;

    useEffect(() => {
        const x = MAP_WIDTH / 2
        const y = x
        const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
        camera.centerOn(pixelPosition?.x!, pixelPosition?.y!);
    }, [])

    const [selectBuild, setSelectBuild] = useState("Hotel")
    const options: OptionType[] = [
        { value: 'Hotel', label: 'Hotel($100)' },
        { value: 'Bank', label: 'Bank($500)' },
        { value: 'Starkbucks', label: 'Starkbucks($1000)' }
    ];

    const [selectBomb, setSelectBomb] = useState("10")
    const bomboptions: OptionType[] = [
        { value: '10', label: 'Power : $10' },
        { value: '20', label: 'Power : $20' },
        { value: '50', label: 'Power : $50' },
        { value: '100', label: 'Power : $100' },
        { value: '200', label: 'Power : $200' },
        { value: '300', label: 'Power : $300' },
        { value: '500', label: 'Power : $500' },
    ];

    const handleSelectionChange = (value: string) => {
        console.log('Selected:', value);
        setSelectBuild(value)
    };


    const placeBomb = async () => {
        if (!account) {
            alert("Create burner wallet first.")
            return
        }
        if (!player) {
            alert("Start game first.")
            return
        }
        const build = buildings.get(player.position)
        if (build) {
            alert("There is a building.")
            return
        }

        const coord = positionToBuildingCoorp(player.position)
        
        const events = await explode(account,parseInt(selectBomb))
        if (events) {
            if (events.length != 0) {
                //TODO : check there is building
                const entityId = parseInt(account.address) as EntityIndex
                const player = events[0] as Player

                setComponent(components.Player, entityId, {
                    position: player.position,
                    joined_time: player.joined_time,
                    direction: player.direction,
                    nick_name: player.nick_name,
                    gold: player.gold,
                    steps: player.steps,
                    last_point: player.last_point,
                    last_time: player.last_time
                })
                putTileAt({ x: coord.x, y: coord.y }, Tileset.Bomb, "Foreground");
                return
            }
        }

        alert("Something wrong")
    }

    const buildClick = () => {
        if (!account) {
            alert("Create burner wallet first.")
            return
        }
        if (!player) {
            alert("Start game first.")
            return
        }
        const build = buildings.get(player.position)
        if (build) {
            alert("There is a building.")
            return
        }
        const coord = positionToBuildingCoorp(player.position)
        //TODO : check there is building

        var id = Tileset.Bank
        var price = 0
        switch (selectBuild) {
            case "Bank": id = Tileset.Bank; price = BUILDING_PRICES['Bank']; break;
            case "Hotel": id = Tileset.Hotel; price = BUILDING_PRICES['Hotel']; break;
            case "Starkbucks": id = Tileset.Starkbucks; price = BUILDING_PRICES['Starkbucks']; break;
        }
        console.log("buildClick gold:" + player.gold + ",price:" + price);
        console.log(coord);
        var buildingId = mapIdToBuildingId(id)
        if (player.gold < price) {
            alert("Gold is not enough")
            return
        }
        putTileAt({ x: coord.x, y: coord.y }, id, "Foreground");
        putTileAt({ x: coord.x, y: coord.y }, Tileset.Heart, "Top");
        buyBuilding(account, buildingId)
    }

    const buyBackClick = () => {
        if (!account) {
            alert("Create burner wallet first.")
            return
        }
        if (!player) {
            alert("Start game first.")
            return
        }

        const postion = player.position
        const building = buildings.get(postion)
        if (building) {
            if (building.owner == account.address) {
                alert("Can not buy your building")
                return
            }
            if (player.gold < building.price * 1.3) {
                alert("Gold is not enough. Need $" + (building.price * 1.3).toFixed(0))
                return
            }
        } else {
            alert("No building here")
            return
        }

        // const coord = positionToCoorp(player.position)
        //TODO : check there is building

        buyBack(account)
    }

    return (<ClickWrapper style={{ display: "flex", flexDirection: "column" }}>

        <BuildingList options={options} onChange={handleSelectionChange} defaultValue="Hotel" />
        <button onClick={() => buildClick()}>Build {selectBuild}</button>

        <div style={{ marginTop: 15 }}></div>
        <BuildingList options={bomboptions} onChange={(value)=>setSelectBomb(value)} defaultValue="10" />
        <button onClick={() => placeBomb()} >Place Bomb</button>
        
        <button onClick={() => buyBackClick()} style={{ marginTop: 15 }}>Buy Back</button>
    </ClickWrapper>)
}