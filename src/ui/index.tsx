import styled from "styled-components";
import { store } from "../store/store";
import { Wrapper } from "./wrapper";
import { SpawnBtn } from "./spawnbtn";
import RollDice from "./rolldice";
import ActionsUI from "./actions";
import PlayerPanel from "./playerpanel";
import LandStatusPanel from "./landstatuspanel";
import BottomIcons from "./bottomicons";
import NamesUI from "./names";
import AdminUI from "./adminUI";
import ActionList from "./actionlist";
import TreasuryUI from "./treasuryUI";
import BuildingTip from "./buildingtip";
import BuyEnergyUI from "./buyenergy";
import WalletUI from "./walletui";
import Leaderboard from "./leaderboard";

export default function UI() {
    const layers = store((state) => {
        return {
            networkLayer: state.networkLayer,
            phaserLayer: state.phaserLayer,
        };
    });

    if (!layers.networkLayer || !layers.phaserLayer) return <></>;

    return (
        <Wrapper>
            <TopLeftContainer>
                <PlayerPanel />
            </TopLeftContainer>
            <HeaderContainer>
                <SpawnBtn />
            </HeaderContainer>

            <BuyEnergyUI/>
            <BottomContainer>
                <RollDice />
            </BottomContainer>
            <RightContainer>
                <ActionsUI />
            </RightContainer>
            <TopRightContainer>
                <LandStatusPanel />
                <WalletUI/>
            </TopRightContainer>

            <BottomRightContainer>
                <BottomIcons />
            </BottomRightContainer>
            <BottomLeftContainer>
                <AdminUI />
            </BottomLeftContainer>
            <LeftCenterContainer>
                <ActionList />
            </LeftCenterContainer>
            <TreasuryContainer>
                <TreasuryUI />
            </TreasuryContainer>
            <NamesUI />
            <BuildingTip />
            <Leaderboard/>
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

const TopLeftContainer = styled.div`
    position: absolute;
    top: 140px;
    left: 130px;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 10px;
`;

const TreasuryContainer = styled.div`
position: absolute;
top: 240px;
right: -80px;
transform: translate(-50%, -50%);
color: white;
display: flex;
flex-direaction: row;
gap: 10px;
`;

const LeftCenterContainer = styled.div`
    position: absolute;
    top: 430px;
    left: 130px;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 10px;
`;

const TopRightContainer = styled.div`
    position: absolute;
    top: 80px;
    right: -80px;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 10px;
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

const BottomRightContainer = styled.div`
    position: absolute;
    bottom: 2%;
    right: 2%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;

const BottomLeftContainer = styled.div`
    position: absolute;
    bottom: 0%;
    left: 10%;
    transform: translate(-50%, -50%);
    color: white;
    display: flex;
    flex-direaction: row;
    gap: 20px;
`;


const RightContainer = styled.div`
    position: absolute;
    top: 58%;
    right: 0%;
    transform: translate(-50%, -50%);
    color: white;
`;
