import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SlSpeech } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";


const Wrapper = styled.div`
width:100%;
`;
const Header = styled.div`
@media screen and (max-width: 700px) {
    position:fixed;
    bottom: 0px; 
    left:0;
    height: 30px;
    z-index:999;
    background-color:white;
border-top:1px solid black;
  }
  a{
    color:black;
  }
    width:100%;
    height:100px;
    background-color:#E72929;
    z-index:999;
`;
const Menu = styled.div`
@media screen and (max-width: 700px) {
    height: 80px;
    font-size:20px;
    font-weight:500;
    width:100%;
    align-items: center;
    gap: 40px;
    justify-content: space-around;
  }
display: flex;
    width: 80%;
    height: 80px;
    margin: 0 auto;
    align-items: center;
    gap: 70px;
    justify-content: flex-end;
    font-size:25px;
    a{
        text-decoration:none;
    }
}
`;
const MenuItem = styled.div`
@media screen and (max-width: 700px) {
    display:flex;
    height:80px;
    flex-direction: column;
    align-items: center;
    span{
        font-size:12px;
    }
  }
  height:80px;

`;



export default function Layout() {


    return (
        <Wrapper>
            <Header>
                <Menu>
                    <Link to="/">
                        <MenuItem><IoHomeOutline /><span>홈</span></MenuItem>
                    </Link>
                    <Link to="/records">
                        <MenuItem><FaRegCalendarAlt /><span>기록</span> </MenuItem>
                    </Link>
                    <Link to="/sns">
                        <MenuItem><SlSpeech /><span>소셜</span></MenuItem>
                    </Link>
                    <Link to="/profile">
                        <MenuItem><CgProfile /><span>프로필</span></MenuItem>
                    </Link>
                </Menu>
            </Header>
            <Outlet />
        </Wrapper>
    )
}