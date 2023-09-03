import styled from "styled-components";
import { store } from "../store/store";
import { Wrapper } from "./wrapper";
import { SpawnBtn } from "./spawnbtn";
import RollDice from "./rolldice";
import ActionsUI from "./actions";

export const UI = () => {
    const layers = store((state) => {
        return {
            networkLayer: state.networkLayer,
            phaserLayer: state.phaserLayer,
        };
    });

    if (!layers.networkLayer || !layers.phaserLayer) return <></>;

    return (
        <Wrapper>
            <HeaderContainer>
                <SpawnBtn />
            </HeaderContainer>

            <BottomContainer>
                <RollDice/>
            </BottomContainer>
            <RightContainer>
                <ActionsUI/>
            </RightContainer>
        </Wrapper>
    );
};

const HeaderContainer = styled.div`
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;


const BottomContainer = styled.div`
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;


const RightContainer = styled.div`
    position: absolute;
    bottom: 50%;
    right: 2%;
    transform: translate(-50%, -50%);
    color: white;
`;