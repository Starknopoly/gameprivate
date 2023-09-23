import './App.css';
import styled from "styled-components";

function AppTest() {
  
  return (
    <Container>
        <div style={{fontSize:30}}>
            Game is updating...
        </div>
    </Container>
  );
}
const Container = styled.div`
    position: absolute;
    top: 50%;
    right: 40%;
    transform: translate(-50%, -50%);
    color: black;
    display: flex;
    flex-direaction: row;
    gap: 10px;
`;

export default AppTest;
