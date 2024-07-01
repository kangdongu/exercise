import { useState } from "react";
import styled from "styled-components"
import DailyGoal from "./daily-goal";
import LongGoal from "./long-goal";
import TodayGoals from "./today-goal";
import LongGoalSituation from "./long-situation";

const Wrapper = styled.div`
    padding-left:20px;
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
    const [selectedMenu, setSelectedMenu] = useState('goal');
    const [selectedPeriod, setSelectedPeriod] = useState('dailyGoal')

    const periodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPeriod(e.target.value)
    }

    return (
        <Wrapper>
            <MenuWrapper>
                <Menu selected={selectedMenu === 'goal'} onClick={() => setSelectedMenu('goal')}>오늘의 목표</Menu>
                <Menu selected={selectedMenu === 'goalsetting'} onClick={() => setSelectedMenu('goalsetting')}>목표설정</Menu>
                <Menu selected={selectedMenu === 'longgoal'} onClick={() => setSelectedMenu('longgoal')}>장기챌린지</Menu>
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
    )
}

export default PersonalContent