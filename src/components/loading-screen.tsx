import styled from "styled-components"

const Wrapper = styled.div`
    width:100vw;
    height:100vh;
`;
const LodingText = styled.h3`
width: 100%;
text-align: center;
font-size: 65px;
color: #ff0000;
font-weight:800;
`;
const LogoWrapper = styled.div`
    width: 200px;
    height:200px;
    top:50%;
    left:50%;
    position:fixed;
    transform: translate(-50%, -50%);
`;
export default function LoadingScreen() {
    return (
        <Wrapper>
            <LogoWrapper>
                <LodingText>Habit</LodingText>
            </LogoWrapper>
        </Wrapper>
    )
}