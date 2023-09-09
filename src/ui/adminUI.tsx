import { useEffect, useState } from "react";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import { useDojo } from "../hooks/useDojo";
import { EntityIndex, setComponent } from "@latticexyz/recs";
import { Player } from "../dojo/createSystemCalls";

export default function AdminUI() {
    const [moveTo, setMoveTo] = useState(0)
    const { account } = store();
    const { phaserLayer,networkLayer:{components} } = useDojo()

    const [testMode,setTestmode] = useState(false)

    const {
        scenes: {
            Main: {
                input,
                camera,
                maps: {
                    Main: { putTileAt },
                },
            },
        },
        networkLayer: {
            systemCalls: { adminRoll },
        },
    } = phaserLayer;

    useEffect(()=>{

        input.onKeyPress(
            keys => keys.has("M"),
            () => {
                setTestmode(pre=>!pre)
            });
    },[])

    const clickMove =async () => {
        if (moveTo <= 0) {
            alert("wrong position")
            return
        }
        if (!account) {
            alert("no account")
            return
        }
        const events = await adminRoll(account, moveTo)
        if(!events){
            return
        }
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
    }

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setMoveTo(parseInt(value));
    }

    return (<ClickWrapper>
        {
            testMode?
            <div style={{ width: 150, height: 140, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            <p>Admin Test</p>

            <button onClick={() => clickMove()}>Move To</button>
            <input value={moveTo} onChange={inputChange} type="number" />
        </div>
        :<></>
        }
       
    </ClickWrapper>);
}