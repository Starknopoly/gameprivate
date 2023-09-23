import styled from "styled-components";
import { PAUSE } from "../config";

export default function NotificationUI(){
    return(
        <Container>
            {
                PAUSE&&<div  style={{ width: "450px", height: 40, lineHeight: 0.9, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15,color:"red",fontSize:20} }>
                <div style={{marginTop:15}}>System is updating... Play later...</div>
            </div>
            }
        </Container>
    )
}

const Container = styled.div`
    position: absolute;
    top: 80px;
    left: 30%;
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 10px;
`;