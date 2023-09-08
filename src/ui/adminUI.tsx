import { useState } from "react";
import { ClickWrapper } from "./clickWrapper";
import { store } from "../store/store";
import { useDojo } from "../hooks/useDojo";

export default function AdminUI() {
    const [moveTo, setMoveTo] = useState(0)
    const { account } = store();
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
            systemCalls: { adminRoll },
        },
    } = phaserLayer;


    const clickMove = () => {
        if (moveTo <= 0) {
            alert("wrong position")
            return
        }
        if (!account) {
            alert("no account")
            return
        }
        adminRoll(account, moveTo)
    }

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setMoveTo(parseInt(value));
    }

    return (<ClickWrapper>
        <div style={{ width: 150, height: 140, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            <p>Admin Test</p>

            <button onClick={() => clickMove()}>Move To</button>
            <input value={moveTo} onChange={inputChange} type="number" />
        </div>
    </ClickWrapper>);
}