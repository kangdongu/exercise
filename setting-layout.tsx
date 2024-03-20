import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
width:100%;
height:80px;
background-color:lightblue;
`;
const Menu = styled.div`
display: flex;
    width: 80%;
    height: 80px;
    margin: 0 auto;
    align-items: center;
    gap: 70px;
    justify-content: flex-end;
    font-size:25px;
font-weight:600;
}
a{
    text-decoration:none;
    color:#333333;
}
`;
const MenuItem = styled.span`
height:50px;
`;



export default function Layout() {


    return (
        <Wrapper>
            <Menu>
            <Link to="/">
                <MenuItem>홈</MenuItem>
                </Link>
                <Link to="/records">
                <MenuItem>기록</MenuItem>
                </Link>
                <Link to="/profile">
                <MenuItem>프로필</MenuItem>
                </Link>
            </Menu>
            <Outlet />

        </Wrapper>
    )
}