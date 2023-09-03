import { useState } from "react";
import { BuildingList, OptionType } from "./buildinglist";
import { ClickWrapper } from "./clickWrapper";
import { useDojo } from "../hooks/useDojo";
import { Tileset } from "../artTypes/world";
import { EntityIndex, getComponentValue, getEntityComponents } from "@latticexyz/recs";

export default function ActionsUI() {
    // usePhaserLayer()
    const {phaserLayer,networkLayer} = useDojo()
    const {
        scenes: {
            Main: {
                maps: {
                    Main: { putTileAt },
                },
            },
        },
        networkLayer: {
            account
        },
    } = phaserLayer;

    const [selectBuild,setSelectBuild] = useState("Hotel")
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
        const entityId = parseInt(account.address) as EntityIndex;
        // getEntityComponents(phaserLayer.world,entityId)
        const position = getComponentValue(networkLayer.components.Position,entityId) as any
        console.log(position);
        const x = position.x
        const y = position.y-1
        const coord = { x, y };
        switch(selectBuild){
            case "Bank":putTileAt(coord, Tileset.Bank, "Foreground");break;
            case "Hotel":putTileAt(coord, Tileset.Hotel, "Foreground");break;
            case "Starkbucks":putTileAt(coord, Tileset.Starkbucks, "Foreground");break;
        }
        
    }

    const buyBackClick = () => {

    }

    return (<ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
       
        <BuildingList options={options} onChange={handleSelectionChange} defaultValue="Hotel"/>
        <button onClick={() => buildClick()}>Build {selectBuild}</button>
        
        <button onClick={() => buyBackClick()} style={{ marginTop: 15 }}>Buy Back</button>
    </ClickWrapper>)
}