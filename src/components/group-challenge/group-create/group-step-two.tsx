import styled from "styled-components"

const Wrapper = styled.div`

`;
const ButtonWrapper = styled.div`
    display:flex;
    width:100%;
    margin-top:20px;
    gap:20px;
    margin-bottom:30px;
    position:fixed;
    bottom:40px;
    justify-content: space-around;
`;
const Button = styled.button`
   width:100px;
    height:50px;
    text-align:center;
    line-height:50px;
    color:white;
    border:none;
    border-radius:15px;
    font-size:18px;
`;
const WeekWrapper = styled.div`
margin-bottom:20px;
`;
const WeekListWrapper = styled.div`
    width:98%;
    margin-bottom: 20px;
    display: flex;
    margin-top: 5px;
    gap: 0.3%;
    overflow-x: auto;
    padding-bottom: 5px; 
`;
const WeekTitle = styled.h4`

`;
const WeekList = styled.span<{ selected: boolean }>`
    padding:10px 13px;
    border-radius:10px;
    border: ${props => props.selected ? 'none' : '0.5px solid gray'};
    text-align:center;
    background-color: ${props => props.selected ? 'gray' : 'white'};
    color:${props => props.selected ? 'white' : 'black'}
`;
const DaysChoiceWrapper = styled.div`
    width:100%;
`;
const DaysChoiceTitle = styled.h4`
    span{
        font-weight:500;
        font-size:14px;
    }
`;
const DaysChoiceListWrapper = styled.div`
    display:flex;
    gap:5px;
    width:98%;
    flex-wrap: wrap;
`;
const DaysChoiceList = styled.span<{ selected: boolean }>`
  padding: 10px 13px;
    text-align:center;
  border: ${(props) => (props.selected ? "0.5px solid #FF3232" : "0.5px solid gray")};
  border-radius: 10px;
  background-color: ${(props) => (props.selected ? "#FF3232" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
`;

interface StepTwoProps {
    nextStep: () => void;
    prevStep: () => void;
    selectedDays: string[]; 
    updateDays: (updatedDays: string[]) => void; 
}
const GroupCreateStepTwo: React.FC<StepTwoProps> = ({ nextStep, prevStep, selectedDays, updateDays }) => {

    const calculateSelectedWeek = () => {
        return `${selectedDays.length}`;
    };
    
    const handleDayClick = (day: string) => {
        let updatedDays;
        updatedDays = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];

            updateDays(updatedDays)
    };

    const completeNextStep = () => {
        if(selectedDays.length !== 0){
            nextStep()
        }else{
            alert("요일을 선택해주세요")
        }
    }

    return (
        <Wrapper>
            <DaysChoiceWrapper>
                <DaysChoiceTitle>매주 진행할 요일을 선택해주세요 *<span> (복수선택가능)</span></DaysChoiceTitle>
                <DaysChoiceListWrapper>
                    {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                        <DaysChoiceList
                            key={day}
                            selected={selectedDays.includes(day)}
                            onClick={() => handleDayClick(day)}
                        >
                            {day}요일
                        </DaysChoiceList>
                    ))}
                </DaysChoiceListWrapper>
            </DaysChoiceWrapper>
            <WeekWrapper>
                <WeekTitle>주에 몇일</WeekTitle>
                <WeekListWrapper>
                    {["1", "2", "3", "4", "5", "6", "7"].map((week) => (
                        <WeekList
                            key={week}
                            selected={calculateSelectedWeek() === week}
                        >
                            {week}일
                        </WeekList>
                    ))}
                </WeekListWrapper>
            </WeekWrapper>
            <ButtonWrapper>
                <Button style={{backgroundColor:'lightgray'}} onClick={prevStep}>이전</Button>
                <Button style={{backgroundColor:'#FF6384'}} onClick={completeNextStep}>다음단계</Button>
            </ButtonWrapper>
        </Wrapper>
    )
}
export default GroupCreateStepTwo
