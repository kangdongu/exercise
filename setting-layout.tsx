import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
width:100%;
`;
const Header = styled.div`
    width:100%;
    height:80px;
    background-color:lightblue;
    z-index:999;
    @media screen and (max-width: 700px) {
        position:fixed;
        bottom: 0px; 
        left:0;
        height: 30px;
        z-index:999;
      }
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
@media screen and (max-width: 700px) {
    height: 30px;
    font-size:20px;
    font-weight:500;
  }

`;
const MenuItem = styled.span`
height:80px;
@media screen and (max-width: 700px) {
    height: 30px;
  }
`;



export default function Layout() {


    return (
        <Wrapper>
            <Header>
                <Menu>
                    <Link to="/">
                        <MenuItem>홈</MenuItem>
                    </Link>
                    <Link to="/records">
                        <MenuItem>기록</MenuItem>
                    </Link>
                    <Link to="/sns">
                        <MenuItem>소셜</MenuItem>
                    </Link>
                    <Link to="/profile">
                        <MenuItem>프로필</MenuItem>
                    </Link>
                </Menu>
            </Header>
            <Outlet />
        </Wrapper>
    )
}