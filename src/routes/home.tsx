import styled from "styled-components";
import TimerWrapper from "../components/timer/timer";
import PersonalChallenge from "../components/personal-challenge/personal-challenge";
import GroupChallenge from "../components/group-challenge/group-challenge";
import Badge from "../components/badge/badge";
import Achievements from "../components/achievements/achievements";
import Efficacy from "../components/efficacy/efficacy";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    width:100vw;
    margin: 0 auto;
    display: grid; 
    grid-template-columns:1fr 1fr;
    grid-template-rows: 150px 150px 150px 150px;
    grid-column-gap: 20px;
    grid-row-gap: 30px;
    height:97vh;
    padding: 40px 3.5vw;
    overflow-y:scroll;
     background-color:#f3f1f1;
    padding-bottom:0px;
`;

export default function Home() {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <Wrapper>
            <TimerWrapper timerClick={() => handleNavigation('/timer')} />
            <Badge badgeClick={() => handleNavigation('/badge')} />
            <PersonalChallenge personalClick={() => handleNavigation('/personal-challenge')} />
            <GroupChallenge GroupModal={() => handleNavigation('/group-challenge')} />
            <Achievements achievmeentsClick={() => handleNavigation('/achievements')} />
            <Efficacy efficacyClick={() => handleNavigation('/efficacy')} />
        </Wrapper>
    )
}