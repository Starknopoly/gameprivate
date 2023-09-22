import styled from "styled-components";
import { store } from "../store/store";
import { Wrapper } from "./wrapper";
import RollDice from "./rolldice";
import ActionsUI from "./actions";
import LandStatusPanel from "./landstatuspanel";
import BottomIcons from "./bottomicons";
import NamesUI from "./names";
import AdminUI from "./adminUI";
import ActionList from "./actionlist";
import TreasuryUI from "./treasuryUI";
import BuildingTip from "./buildingtip";
import BuyEnergyUI from "./buyenergy";
import Leaderboard from "./leaderboard";
import { VERSION } from "../config";
import Header from "./header";
import RoundUI from "./roundUI";

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
            <RoundUI/>
            <TopHeaderContainer>
                <Header/>
            </TopHeaderContainer>

            {/* <TopLeftContainer>
                <PlayerPanel />
            </TopLeftContainer> */}
            <BuyEnergyUI />
            <BottomContainer>
                <RollDice />
            </BottomContainer>
            <RightContainer>
                <ActionsUI />
            </RightContainer>
            <TopRightContainer>
                <LandStatusPanel />
            </TopRightContainer>

            <BottomRightContainer>
                <BottomIcons />
            </BottomRightContainer>
            <BottomLeftContainer>
                <AdminUI />
            </BottomLeftContainer>
            <ActionListContainer>
                <ActionList />
            </ActionListContainer>
            <TreasuryContainer>
                <TreasuryUI />
            </TreasuryContainer>
            <NamesUI />
            <BuildingTip />
            <Leaderboard />
            <VersionContainer>
                <p>version:{VERSION}</p>
            </VersionContainer>

        </Wrapper>
    );
};

const TopHeaderContainer = styled.div`
    position: absolute;
    top: 0px;
    left: 0%;
    color: white;
    width:100%;
    height:60px;
`;

const VersionContainer = styled.div`
    position: absolute;
    bottom: 0px;
    right: 10px;
    color: white;
`;

const TreasuryContainer = styled.div`
position: absolute;
top: 140px;
right: -80px;
transform: translate(-50%, -50%);
color: white;
display: flex;
flex-direaction: row;
gap: 10px;
`;

const ActionListContainer = styled.div`
    position: absolute;
    bottom: 20px;
    left: 30px;
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
    bottom: 8%;
    right: 2%;
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
