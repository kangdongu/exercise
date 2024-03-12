import styled from "styled-components";
import GenderChoice from "../components/gender-choice";

const Wrapper = styled.div`

`;
const Title = styled.h1`

`;

export default function Home() {
    return (
        <Wrapper>
            <Title>성별을 선택해 주세요</Title>
            <GenderChoice />
        </Wrapper>
    )
}