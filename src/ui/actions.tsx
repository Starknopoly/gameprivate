import { useEffect, useState } from "react";
import { BuildingList, OptionType } from "./buildinglist";
import { ClickWrapper } from "./clickWrapper";
import { useDojo } from "../hooks/useDojo";
import { Tileset } from "../artTypes/world";
import { store } from "../store/store";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { MAP_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { positionToBuildingCoorp, positionToCoorp } from "../utils";
import { BANK_ID, HOTEL_ID, STARKBUCKS_ID } from "../config";

export default function ActionsUI() {
    const { account, player } = store();
    const { phaserLayer } = useDojo()

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
            systemCalls: { buyBuilding, buyBack },
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

    const handleSelectionChange = (value: string) => {
        console.log('Selected:', value);
        setSelectBuild(value)
    };


    const placeBomb = () => {
        if (!account) {
            alert("Create burner wallet first.")
            return
        }
        if (!player) {
            alert("Start game first.")
            return
        }

        const coord = positionToBuildingCoorp(player.position)
        //TODO : check there is building
        putTileAt({ x: coord.x, y: coord.y }, Tileset.Bomb, "Foreground");
    }

    const parseBuildingId = (id: number): number=>{
        var buildingId = 1
        switch (id) {
            case Tileset.Bank: buildingId = BANK_ID;break;
            case Tileset.Hotel: buildingId = HOTEL_ID;break;
            case Tileset.Starkbucks: buildingId = STARKBUCKS_ID;break;
        }

        return buildingId;
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

        const coord = positionToBuildingCoorp(player.position)
        //TODO : check there is building

        var buildingId = Tileset.Bank
        switch (selectBuild) {
            case "Bank": buildingId = Tileset.Bank; break;
            case "Hotel": buildingId = Tileset.Hotel; break;
            case "Starkbucks": buildingId = Tileset.Starkbucks; break;
        }
        console.log("buildClick");
        console.log(coord);
        putTileAt({ x: coord.x, y: coord.y }, buildingId, "Foreground");

        buyBuilding(account, parseBuildingId(buildingId))
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
        // const coord = positionToCoorp(player.position)
        //TODO : check there is building

        buyBack(account)
    }

    return (<ClickWrapper style={{ display: "flex", flexDirection: "column" }}>

        <BuildingList options={options} onChange={handleSelectionChange} defaultValue="Hotel" />
        <button onClick={() => buildClick()}>Build {selectBuild}</button>
        <button onClick={() => placeBomb()} style={{ marginTop: 15 }}>Place Bomb</button>
        <button onClick={() => buyBackClick()} style={{ marginTop: 15 }}>Buy Back</button>
    </ClickWrapper>)
}