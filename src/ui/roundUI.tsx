import styled from "styled-components";
import { getTimestamp } from "../utils";

export default function RoundUI() {
    const START_TIME = 1695380400
    const END_TIME = 1695625200

    const getTimeLeft = () => {
        const leftSec = getTimestamp() / 1000 - START_TIME
        const hour = Math.ceil(leftSec / 3600)
        return hour + " Hours"
    }

    return (
    <Container style={{ fontSize: 18 }}>
        <p>Alpha Round 1 : {getTimeLeft()} / 72 Hours</p>
    </Container>)
}


const Container = styled.div`
    position: absolute;
    top: 10%;
    left: 2%;
    color: white;
`;
