import { useState } from "react";
import styled from "styled-components"
import DailyGoal from "./daily-goal";
import LongGoal from "./long-goal";
import TodayGoals from "./today-goal";
import LongGoalSituation from "./long-situation";
import { useNavigate } from "react-router-dom";
import MoSlideModal from "../slideModal/mo-slide-modal";

const Wrapper = styled.div`
    width:100vw;
    height:90vh;
    overflow-y:scroll;
    padding:20px;
    box-sizing:border-box;
`;
const MenuWrapper = styled.div`
margin: 25px 0px;
`;
const Menu = styled.span<{ selected: boolean }>`
    color: ${props => props.selected ? '#cc0033' : '#939393'};
    font-weight:${props => props.selected ? '600' : '500'};
    margin-left:15px;
    &:first-child {
        margin-left:0px;
    }
`;
const GoalWrapper = styled.div`

`;
const GoalSettingWrapper = styled.div`
`;
const PeriodSelect = styled.select`
    margin-bottom:23px;
`;
const PeriodOption = styled.option`

`;

const PersonalContent = () => {
    const navigate = useNavigate()
    const [selectedMenu, setSelectedMenu] = useState('goal');
    const [selectedPeriod, setSelectedPeriod] = useState('dailyGoal')

    const periodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPeriod(e.target.value)
    }

    return (
        <MoSlideModal onClose={() => navigate("/")}>
        <Wrapper>
            <MenuWrapper>
                <Menu selected={selectedMenu === 'goal'} onClick={() => setSelectedMenu('goal')}>오늘의 목표</Menu>
                <Menu selected={selectedMenu === 'goalsetting'} onClick={() => setSelectedMenu('goalsetting')}>목표설정</Menu>
                <Menu selected={selectedMenu === 'longgoal'} onClick={() => setSelectedMenu('longgoal')}>장기챌린지현황</Menu>
            </MenuWrapper>
            {selectedMenu === 'goal' && (
                <GoalWrapper>
                    <TodayGoals />
                </GoalWrapper>)}
            {selectedMenu === 'goalsetting' && (
                <GoalSettingWrapper>
                    <PeriodSelect value={selectedPeriod} onChange={periodChange}>
                        <PeriodOption value={"dailyGoal"}>일일목표</PeriodOption>
                        <PeriodOption value={"longGoal"}>장기목표</PeriodOption>
                    </PeriodSelect>
                    {selectedPeriod === 'dailyGoal' && (
                        <DailyGoal complet={() => setSelectedMenu('goal')} />
                    )}
                    {selectedPeriod === 'longGoal' && (
                        <LongGoal complet={() => setSelectedMenu('goal')} />
                    )}
                </GoalSettingWrapper>)}
            {selectedMenu === 'longgoal' && (
                <LongGoalSituation />
            )}
        </Wrapper>
        </MoSlideModal>
    )
}

export default PersonalContent