import styled from "styled-components";
import Calendar from "../components/calendar";
import PhotoRecords from "../components/photo-records";
import { useState } from "react";

const Wrapper = styled.div`

`;
const Menu = styled.div`
    display:flex;

`;
const MenuItem = styled.div`
    width:50px;
    height:50px;
    border:1px solid black;
`;

export default function Records() {
    const [selectedMenu, setSelectedMenu] = useState('calendar');
    return (
        <Wrapper>
            <Menu>
                <MenuItem onClick={() => setSelectedMenu('calendar')}>Calendar</MenuItem>
                <MenuItem onClick={() => setSelectedMenu('photo')}>Photo</MenuItem>
            </Menu>
            
            {selectedMenu === 'calendar' && <Calendar />}
            {selectedMenu === 'photo' && <PhotoRecords />}
        </Wrapper>
    )
}