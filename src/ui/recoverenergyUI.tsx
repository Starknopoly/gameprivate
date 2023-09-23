import styled from "styled-components";
import { ClickWrapper } from "./clickWrapper";
import { getTimestamp, toastError, toastInfo, toastSuccess } from "../utils";
import { RECOVER_START_TIME } from "../config";
import { store } from "../store/store";
import { playerStore } from "../store/playerStore";
import { Player } from "../dojo/createSystemCalls";

export default function RecoverEnergyUI() {
    const { account, phaserLayer } = store();
    const {
        networkLayer: {
            systemCalls: { recoverEnergy },
        },
    } = phaserLayer!;

    const recover = async () => {
        if(!account){
            toastError("Create account first")
            return
        }
        const now = getTimestamp() / 1000
        const left_time = (now - RECOVER_START_TIME) % 86400
        console.log("recover",now,left_time);
        
        if (left_time < 0 || left_time > 3600 * 3) {
            toastError("Not start")
            return
        }

        toastInfo("Recover...")
        
        const result = await recoverEnergy(account)
        if(result && result.length>0){
            toastSuccess("Recover success")
            const playerEvent = result[0] as Player;
            playerStore.setState({ player: playerEvent })
        }else{
            toastError("Already recovered today")
        }
    }

    return (
        <TopHeaderContainer>
            <ClickWrapper>
                <div style={{ width: 160, height: 140, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
                    <p style={{ color: "pink", fontSize: 18 }}>Recover Energy</p>
                    <p>HKT : 19:00~22:00</p>
                    <p>Recover 30 Energy</p>
                    <button onClick={() => recover()}>Recover</button>
                </div>
            </ClickWrapper>
        </TopHeaderContainer>)
}


const TopHeaderContainer = styled.div`
    position: absolute;
    top: 32%;
    left: 2%;
    color: white;
    width:100%;
    height:60px;
`;