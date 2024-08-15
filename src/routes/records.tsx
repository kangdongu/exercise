import styled from "styled-components";
import Calendar from "../components/calendar/calendar";
import PhotoRecords from "../components/sns_photo/photo-records";
import { useEffect, useState } from "react";
import Inbody from "../components/inbody/inbody";
import { useLocation } from "react-router-dom";


const Wrapper = styled.div`
    width:100vw;
    height:calc(100vh - 40px);
    overflow-y:scroll;
`;
const Menu = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
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
    color: ${props => props.selected ? '#FC286E' : 'black'};
    border-bottom: 3px solid ${props => props.selected ? '#FC286E' : 'transparent'};
    transition: color 0.3s ease, border-bottom-color 0.3s ease;
`;

export default function Records() {
    const location = useLocation();
    const [selectedMenu, setSelectedMenu] = useState('calendar');

    useEffect(() => {
        if (location.state && location.state.menu) {
            setSelectedMenu(location.state.menu);
        }
    }, [location.state]);

    return (
        <Wrapper>
            <Menu>
                <MenuItem selected={selectedMenu === 'calendar'} onClick={() => setSelectedMenu('calendar')}>캘린더</MenuItem>
                <MenuItem selected={selectedMenu === 'photo'} onClick={() => setSelectedMenu('photo')}>사진</MenuItem>
                <MenuItem selected={selectedMenu === 'inbody'} onClick={() => setSelectedMenu('inbody')}>인바디</MenuItem>
            </Menu>
                {selectedMenu === 'calendar' && <Calendar />}
                {selectedMenu === 'photo' && <PhotoRecords />}
                {selectedMenu === 'inbody' && <Inbody />}
        </Wrapper>
    )
}