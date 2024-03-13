import styled from "styled-components"
import img from "../assets/loading.gif"

const Wrapper = styled.div`

`;
const Img = styled.img`
    width: 15%;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;
export default function LoadingScreen(){
    return (
        <Wrapper>
            <Img src={img} />
        </Wrapper>
    )
}