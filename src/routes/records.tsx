import styled from "styled-components";
// import Calendar from "../components/calendar/calendar";
import PhotoRecords from "../components/sns_photo/photo-records";
import { useEffect, useState } from "react";
import Inbody from "../components/inbody/inbody";
import { useLocation } from "react-router-dom";
import TestCalendar from "../components/calendar/test-calendar";


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
    color: ${props => props.selected ? '#FF286F' : 'black'};
    border-bottom: 3px solid ${props => props.selected ? '#FF286F' : 'transparent'};
    transition: color 0.3s ease, border-bottom-color 0.3s ease;
`;

export default function Records() {
    const location = useLocation();
    const [selectedMenu, setSelectedMenu] = useState('TestCalendar');

    useEffect(() => {
        if (location.state && location.state.menu) {
            setSelectedMenu(location.state.menu);
        }
    }, [location.state]);

    return (
        <Wrapper>
            <Menu>
                <MenuItem selected={selectedMenu === 'TestCalendar'} onClick={() => setSelectedMenu('TestCalendar')}>캘린더</MenuItem>
                <MenuItem selected={selectedMenu === 'photo'} onClick={() => setSelectedMenu('photo')}>사진</MenuItem>
                <MenuItem selected={selectedMenu === 'inbody'} onClick={() => setSelectedMenu('inbody')}>인바디</MenuItem>
            </Menu>
                {selectedMenu === 'TestCalendar' && <TestCalendar />}
                {selectedMenu === 'photo' && <PhotoRecords />}
                {selectedMenu === 'inbody' && <Inbody />}
        </Wrapper>
    )
}