import { useState } from "react";
import { BuildingList, OptionType } from "./buildinglist";
import { ClickWrapper } from "./clickWrapper";
import { useDojo } from "../hooks/useDojo";
import { Tileset } from "../artTypes/world";
import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { store } from "../store/store";
import { Player } from "../dojo/createSystemCalls";

export default function ActionsUI() {
    const {account,player} = store();
    const { phaserLayer } = useDojo()

    const {
        scenes: {
            Main: {
                maps: {
                    Main: { putTileAt },
                },
            },
        },
        networkLayer: {
            systemCalls: { buyBuilding,buyBack },
        },
    } = phaserLayer;



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


    const buildClick = () => {
        if(!account){
            alert("Create burner wallet first.")
            return
        }
        if(!player){
            alert("Start game first.")
            return
        }
        const coord = getCoordNow(player)
        //TODO : check there is building

        var buildingId = Tileset.Bank
        switch (selectBuild) {
            case "Bank": buildingId = Tileset.Bank; break;
            case "Hotel": buildingId = Tileset.Hotel; break;
            case "Starkbucks": buildingId = Tileset.Starkbucks; break;
        }
        putTileAt(coord, buildingId, "Foreground");

        buyBuilding(account, coord, buildingId)
    }

    const buyBackClick = () => {
        if(!account){
            alert("Create burner wallet first.")
            return
        }
        if(!player){
            alert("Start game first.")
            return
        }
        const coord = getCoordNow(player)
        //TODO : check there is building

        buyBack(account,coord)
    }

    const getCoordNow = (player:Player) => {
        // const entityId = parseInt(address) as EntityIndex;
        // const player = getComponentValue(networkLayer.components.Player, entityId) as any
        console.log(player);
        const position = player.position

        const ycount = Math.floor(position / 100)

        var x = position % 100 - 50
        if (ycount % 2 == 0) {
            x = position % 100 - 50
        }
        if (ycount % 2 == 1) {
            x = 50 - position % 100 - 1
        }
        const y = ycount * 2 - 50
        const coord = { x, y };
        return coord
    }

    return (<ClickWrapper style={{ display: "flex", flexDirection: "column" }}>

        <BuildingList options={options} onChange={handleSelectionChange} defaultValue="Hotel" />
        <button onClick={() => buildClick()}>Build {selectBuild}</button>

        <button onClick={() => buyBackClick()} style={{ marginTop: 15 }}>Buy Back</button>
    </ClickWrapper>)
}