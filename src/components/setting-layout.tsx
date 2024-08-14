import { Link, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SlSpeech } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";


const Wrapper = styled.div`
    width:100%;
`;
const Header = styled.div`
    @media screen and (max-width: 700px) {
    position:fixed;
    bottom: 0px; 
    left:0;
    height: 40px;
    z-index:999;
    padding-top:1px;
    background-color:white;
    border-top:0.1px solid #F1F3F3;
    }
    a{
        color:black;
    }
    width:100%;
    height:100px;
    background-color:#E72929;
    z-index:99999;
`;
const Menu = styled.div`
@media screen and (max-width: 700px) {
    height: 40px;
    font-size:20px;
    font-weight:500;
    width:100%;
    align-items: center;
    justify-content: space-around;
  }
    display: flex;
    width: 80%;
    height: 40px;
    margin: 0 auto;
    align-items: center;
    justify-content: flex-end;
    font-size:25px;
    a{
        text-decoration:none;
    }
}
`;
const MenuItem = styled.div<{ selected: boolean }>`
    @media screen and (max-width: 700px) {
        display:flex;
        height:40px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position:relative;
        span{
            font-size:12px;
        }
    }
    border-top:${props => props.selected ? "2px solid red" : null};
    height:80px;
    color: ${props => props.selected ? '#ea6362' : 'black'};
    svg {
        fill: ${props => props.selected ? '#ea6362' : 'black'};
    }
`;



export default function Layout() {
    const location = useLocation();
    const [selectedPath, setSelectedPath] = useState("");

    useEffect(() => {
        setSelectedPath(location.pathname);
    }, [location.pathname]);

    return (
        <Wrapper>
            <Header>
                <Menu>
                <Link to="/">
                        <MenuItem selected={selectedPath === "/"}><IoHomeOutline /><span>홈</span></MenuItem>
                    </Link>
                    <Link to="/records">
                        <MenuItem selected={selectedPath === "/records"}><FaRegCalendarAlt /><span>기록</span></MenuItem>
                    </Link>
                    <Link to="/sns">
                        <MenuItem selected={selectedPath === "/sns"}><SlSpeech /><span>소셜</span></MenuItem>
                    </Link>
                    <Link to="/profile">
                        <MenuItem selected={selectedPath === "/profile"}><CgProfile /><span>프로필</span></MenuItem>
                    </Link>
                </Menu>
            </Header>
            <Outlet />
        </Wrapper>
    )
}