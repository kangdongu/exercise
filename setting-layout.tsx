import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`

`;
const Title = styled.h1`

`;

export default function Layout() {


    return (
        <Wrapper>
            <Title>
                
            </Title>
            <Outlet />
        </Wrapper>
    )
}