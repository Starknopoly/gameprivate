import './App.css';
import styled from "styled-components";
import twitter from "../public/twitterlogo.png"

function AppTest() {


    const gotoTwitter = () => {
        window.open("https://twitter.com/stark_nopoly/")
    }
    return (
        <Container>
            <div style={{ fontSize: 30 }}>
                Starknopoly is updating... 😊
            </div>
            <div>
                <img style={{ cursor: "pointer",marginLeft:150,marginTop:20 }} width={30} src={twitter} onClick={() => gotoTwitter()} />
            </div>
        </Container>
    );
}
const Container = styled.div`
    position: absolute;
    top: 50%;
    right: 20%;
    transform: translate(-50%, -50%);
    color: black;
    gap: 10px;
`;

export default AppTest;
