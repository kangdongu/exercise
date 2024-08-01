import styled, { css, keyframes } from "styled-components";
import Calendar from "../components/calendar/calendar";
import PhotoRecords from "../components/sns_photo/photo-records";
import { useEffect, useState } from "react";
import Inbody from "../components/inbody";
import { GoBell } from "react-icons/go";
import { IoIosMenu } from "react-icons/io";
import MenuModal from "../components/menu";
import BellModal from "../components/bell";

const fadeOut = keyframes`
    0% {
        opacity: 1;
        transform: translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateY(-20px);
    }
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const Wrapper = styled.div`
    width:100vw;
    height:calc(100vh - 40px);
    overflow-y:scroll;
     position: relative;
`;
const Menu = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    position:relative;
    z-index: 0;
    @media screen and (max-width: 700px) {
        width: 100%;
    }
`;
const MenuItem = styled.span<{ selected: boolean }>`
     margin: 0 10px;
    padding: 10px 15px;
    cursor: pointer;
    font-weight: 600;
    font-size: 18px;
    color: ${props => props.selected ? 'red' : 'black'};
    border-bottom: 3px solid ${props => props.selected ? 'red' : 'transparent'};
    transition: color 0.3s ease, border-bottom-color 0.3s ease;
`;
const Header = styled.div<{ isVisible: boolean }>`
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
    animation: ${props => props.isVisible ? css`${fadeIn} 0.5s forwards` : css`${fadeOut} 0.5s forwards`};
`;
const HeaderContentWrapper = styled.div`
    margin-left: auto;
    display: flex;
    gap: 15px;
    position:relative;
    svg {
        width: 25px;
        height: 25px;
        cursor: pointer;
        transition: transform 0.2s ease;
        &:hover {
            transform: scale(1.1);
        }
    }
`;

export default function Records() {
    const [selectedMenu, setSelectedMenu] = useState('calendar');
    const [header, setHeader] = useState(true);
    const [menuOn, setMenuOn] = useState(false);
    const [bellOn, setBellOn] = useState(false);
    const [bellAlerm, setBellAlerm] = useState(false);

    useEffect(() => {
        setBellAlerm(true)
    }, [])

    const menuClick = () => {
        if (menuOn) {
            setMenuOn(false)
        } else {
            setMenuOn(true)
        }
    }
    const bellClick = () => {
        if (bellOn) {
            setBellOn(false)
        } else {
            setBellOn(true)
        }
    }
    const handleHeaderOff = () => {
        if (header) {
            setTimeout(() => {
                setHeader(false)
            }, 280);
        } else {
            setHeader(true)
        }
    };


    return (
        <Wrapper>
            {header && (
                <Header isVisible={header}>
                    <HeaderContentWrapper>
                        {bellAlerm && (
                            <div style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'red', left: '20px' }} />
                        )}
                        <GoBell onClick={bellClick} />
                        <IoIosMenu onClick={menuClick} style={{ width: '32px', height: '32px', marginTop: '-5px' }} />
                    </HeaderContentWrapper>
                </Header>
            )}
            <Menu>
                <MenuItem selected={selectedMenu === 'calendar'} onClick={() => setSelectedMenu('calendar')}>캘린더</MenuItem>
                <MenuItem selected={selectedMenu === 'photo'} onClick={() => setSelectedMenu('photo')}>사진</MenuItem>
                <MenuItem selected={selectedMenu === 'inbody'} onClick={() => setSelectedMenu('inbody')}>인바디</MenuItem>
            </Menu>
            <div style={{ position: 'relative', zIndex: '1' }}>
                {selectedMenu === 'calendar' && <Calendar headerOff={handleHeaderOff} />}
                {selectedMenu === 'photo' && <PhotoRecords />}
                {selectedMenu === 'inbody' && <Inbody />}
            </div>
            {menuOn && (
                <MenuModal onClose={menuClick} />
            )}
            {bellOn && (
                <BellModal onClose={bellClick} />
            )}
        </Wrapper>
    )
}