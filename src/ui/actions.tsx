import { useState } from "react";
import { BuildingList, OptionType } from "./buildinglist";
import { ClickWrapper } from "./clickWrapper";

export default function ActionsUI() {
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

    }

    const buyBackClick = () => {

    }

    return (<ClickWrapper style={{ display: "flex", flexDirection: "column" }}>
       
        <BuildingList options={options} onChange={handleSelectionChange} defaultValue="Hotel"/>
        <button onClick={() => buildClick()}>Build {selectBuild}</button>
        
        <button onClick={() => buyBackClick()} style={{ marginTop: 15 }}>Buy Back</button>
    </ClickWrapper>)
}