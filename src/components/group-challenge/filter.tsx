import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    width:100vw;
    height:100vh;
    position:fixed;
    left:0;
    top:0;
    background-color:rgba(0,0,0,0.5);
`;
const FilterWrapper = styled.div`
    width: 100%;
    left: 0px;
    position: fixed;
    bottom: 40px;
    padding: 5px 10px;
    background-color: #f8f8f8;
`;
const Close = styled.div`
    background-color:white;
    padding:10px;
    font-size:18px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom:10px;
    display:flex;
    align-items:center;
    span{
        margin-left:auto;
    }
`;
const Section = styled.div`
    background-color: white;
    padding: 10px;
    margin-bottom: 5px;
    width: 100%;
    border-radius:10px;
`;
const PeriodBox = styled.div`
    display: flex;
    width: 100%;
    gap: 3%;
`;
const WeekdayBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 3%;
`;
const Item = styled.div<{ selected: boolean }>`
    border: 2px solid ${props => props.selected ? '#ff0000' : '#e0e0e0'};
    background-color: ${props => props.selected ? 'white' : '#e0e0e0'};
    color: ${props => props.selected ? '#ff0000' : '#909580'};
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-weight:800;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    flex: 1;
`;
const SecretItem = styled.div<{ selected: boolean }>`
    border: 2px solid ${props => props.selected ? '#ff0000' : '#e0e0e0'};
    background-color: ${props => props.selected ? 'white' : '#e0e0e0'};
    color: ${props => props.selected ? '#ff0000' : '#909580'};
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-weight:800;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    flex: 1;
`;
const FullItem = styled.div<{ selected: boolean }>`
    border: 2px solid ${props => props.selected ? '#ff0000' : '#e0e0e0'};
    background-color: ${props => props.selected ? 'white' : '#e0e0e0'};
    color: ${props => props.selected ? '#ff0000' : '#909580'};
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-weight:800;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    flex: 1;
`;
const FilterButton = styled.div`
    background-color: #ff0000;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #002766;
    }
`;
const WeekdayItem = styled.div<{ selected: boolean }>`
    border: 2px solid ${props => props.selected ? '#ff0000' : '#e0e0e0'};
    background-color: ${props => props.selected ? 'white' : '#e0e0e0'};
    color: ${props => props.selected ? '#ff0000' : '#909580'};
    height: 30px;
    font-weight:800;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width:31.3333%;
    margin-bottom:7px;
`;

interface FilterComponentProps {
    onClose: () => void;
    onFilterApply: (filter: string | null, secret: string | null, full:string | null,weekdays: string[]) => void;
    initialFilter: string | null;
    initialSecret: string | null;
    initialFull: string | null;
    initialWeekdays: string[]; 
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onClose, onFilterApply, initialFilter, initialSecret, initialFull, initialWeekdays }) => {
    const [selectedFilter, setSelectedFilter] = useState<string | null>(initialFilter);
    const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(initialWeekdays);
    const [selectedSecret, setSelectedSecret] = useState<string | null>(initialSecret);
    const [selectedFull, setSelectedFull] = useState<string | null>(initialFull);

    const handleFilterApply = () => {
        onFilterApply(selectedFilter, selectedSecret, selectedFull, selectedWeekdays);
        onClose();
    };

    const toggleWeekday = (day: string) => {
        setSelectedWeekdays((prev) => {
            let updatedDays = prev
            if (prev.includes("상관없음")) {
                updatedDays = [day];
            } else {
                updatedDays = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
            }
            if (updatedDays.length === 0) {
                everyDay("상관없음");
                return ["상관없음"];
            }
            return updatedDays;
        });
    };

    const everyDay = (day: string) => {
        setSelectedWeekdays((prev) =>
            prev.includes(day) ? prev.filter((d) => d === day) : [day]
        )
    }

    return (
        <Wrapper>
                <div style={{width:'100vw', height:'100vh', position:'fixed'}} onClick={onClose}></div>
            <FilterWrapper>
                <Close><span onClick={onClose}>X</span></Close>
                <Section>
                    <h4 style={{ marginTop: '0px' }}>진행/종료</h4>
                    <PeriodBox>
                        <Item selected={selectedFilter === 'all'} onClick={() => setSelectedFilter('all')}>모두</Item>
                        <Item selected={selectedFilter === 'ongoing'} onClick={() => setSelectedFilter('ongoing')}>진행 중</Item>
                        <Item selected={selectedFilter === 'ended'} onClick={() => setSelectedFilter('ended')}>종료됨</Item>
                    </PeriodBox>
                </Section>
                <Section>
                    <h4 style={{ marginTop: '0px' }}>비밀방</h4>
                    <PeriodBox>
                        <SecretItem selected={selectedSecret === "all"} onClick={() => setSelectedSecret("all")}>모두</SecretItem>
                        <SecretItem selected={selectedSecret === "public"} onClick={() => setSelectedSecret("public")}>공개방</SecretItem>
                        <SecretItem selected={selectedSecret === "secret"} onClick={() => setSelectedSecret("secret")}>비밀방</SecretItem>
                    </PeriodBox>
                </Section>
                <Section>
                    <h4 style={{ marginTop: '0px' }}>인원수</h4>
                    <PeriodBox>
                        <FullItem selected={selectedFull === "all"} onClick={() => setSelectedFull("all")}>모두</FullItem>
                        <FullItem selected={selectedFull === "empty"} onClick={() => setSelectedFull("empty")}>자리있음</FullItem>
                        <FullItem selected={selectedFull === "full"} onClick={() => setSelectedFull("full")}>자리없음</FullItem>
                    </PeriodBox>
                </Section>
                <Section style={{ marginBottom: '0' }}>
                    <h4 style={{ marginTop: '0px' }}>요일 선택</h4>

                    <WeekdayBox>
                        <WeekdayItem selected={selectedWeekdays.includes("상관없음")} onClick={() => everyDay("상관없음")}>상관없음</WeekdayItem>
                        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                            <WeekdayItem
                                key={day}
                                selected={selectedWeekdays.includes(day)}
                                onClick={() => toggleWeekday(day)}
                            >
                                {day}요일
                            </WeekdayItem>
                        ))}
                    </WeekdayBox>
                </Section>
                <FilterButton onClick={handleFilterApply}>확인</FilterButton>
            </FilterWrapper>
        </Wrapper>
    );
};

export default FilterComponent;