import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`

`;
const Menu = styled.div`
display:flex;
width:80%;
`;
const MenuItem = styled.div`
width:50px;
height:50px;
border:1px solid black;
`;



export default function Layout() {


    return (
        <Wrapper>
            <Menu>
            <Link to="/">
                <MenuItem />
                </Link>
                <Link to="/records">
                <MenuItem />
                </Link>
                <Link to="/profile">
                <MenuItem />
                </Link>
            </Menu>
            <Outlet />

        </Wrapper>
    )
}