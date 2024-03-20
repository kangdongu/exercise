import styled from "styled-components";
import Calendar from "../components/calendar";
import PhotoRecords from "../components/photo-records";
import { useState } from "react";

const Wrapper = styled.div`
`;
const Menu = styled.div`
    display:flex;
    width: 30%;
    margin: 0 auto;
    margin-bottom:20px;
    justify-content: space-around;
`;
const MenuItem = styled.span<{ selected: boolean }>`
    height:30px;
    border-bottom:3px solid gray;
    cursor:pointer;
    font-weight:600;
    font-size:20px;
    color: ${props => props.selected ? 'red' : 'black'};
    border-bottom-color: ${props => props.selected ? 'red' : 'gray'};
`;

export default function Records() {
    const [selectedMenu, setSelectedMenu] = useState('calendar');
    return (
        <Wrapper>
            <Menu>
                <MenuItem selected={selectedMenu === 'calendar'} onClick={() => setSelectedMenu('calendar')}>캘린더</MenuItem>
                <MenuItem selected={selectedMenu === 'photo'} onClick={() => setSelectedMenu('photo')}>사진</MenuItem>
            </Menu>

            {selectedMenu === 'calendar' && <Calendar />}
            {selectedMenu === 'photo' && <PhotoRecords />}
        </Wrapper>
    )
}