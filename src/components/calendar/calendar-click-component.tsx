import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styled from 'styled-components';

interface ExerciseData {
    이름: string;
    종류: string;
    횟수: string;
    무게: string;
    운동부위: string;
}

interface CalendarClickModalProps {
    setCalendarClick: (value: boolean) => void;
    clickDate: string;
}


const Wrapper = styled.div`
  @media screen and (max-width: 700px) {
    width: 95%;
  }
  width: 80%;
  height: 80vh;
  overflow-y:scroll;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  z-index: 99;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #FC286E;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
    margin-left:auto;
  &:hover {
    background-color: #e55770;
  }
`;

const ExerciseList = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const ExerciseItem = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f1f1f1;
  border-radius: 8px;
`;

const Title = styled.span`
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const Transparency = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 98;
`;

const AreaList = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const DayArea = styled.span`
  display: inline-block;
  font-size: 18px;
  color: #555;
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #e0f7fa;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const CalendarClickModal: React.FC<CalendarClickModalProps> = ({ setCalendarClick, clickDate }) => {
    const [exerciseRecords, setExerciseRecords] = useState<{ [key: string]: ExerciseData[] }>({});
    const [exerciseAreas, setExerciseAreas] = useState<string[]>([]);

    useEffect(() => {
        const fetchExerciseRecords = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const currentUserUID = user.uid;
                    const recordsRef = collection(db, 'records');
                    const querySnapshot = await getDocs(query(recordsRef, where('유저아이디', '==', currentUserUID), where('날짜', '==', clickDate)));
                    
                    const records: { [key: string]: ExerciseData[] } = {};
                    const areas: string[] = [];

                    querySnapshot.forEach(doc => {
                        const data = doc.data() as ExerciseData;
                        if (!records[data.종류]) {
                            records[data.종류] = [];
                        }
                        records[data.종류].push(data);
                        if (!areas.includes(data.운동부위)) {
                            areas.push(data.운동부위);
                        }
                    });

                    Object.keys(records).forEach(key => {
                        records[key].sort((a, b) => {
                            return parseInt(a.무게) - parseInt(b.무게);
                        });
                    });

                    setExerciseRecords(records);
                    setExerciseAreas(areas);
                }
            } catch (error) {
                console.error('Error fetching exercise records:', error);
            }
        };

        fetchExerciseRecords();
    }, [clickDate]);

    return (
        <Transparency>
        <Wrapper>
            <div style={{display:'flex'}}>
            <Button onClick={() => setCalendarClick(false)}>닫기</Button>
            </div>
            <ContentWrapper>
            <AreaList>
            <h1>운동 부위</h1>
                    {exerciseAreas.map((area, index) => (
                        <DayArea key={index}>{area}</DayArea>
                    ))}
            </AreaList>
            <ExerciseList>
                {Object.keys(exerciseRecords).map((exerciseType, index) => (
                    <ExerciseItem key={index}>
                        <Title>{exerciseType}</Title>
                        {exerciseRecords[exerciseType].map((record, recordIndex) => (
                            <p key={recordIndex}> {recordIndex + 1}세트 무게: {record.무게} 횟수/시간:  {record.횟수} 회/분</p>
                        ))}
                    </ExerciseItem>
                ))}
            </ExerciseList>
            </ContentWrapper>
        </Wrapper>
        </Transparency>
    );
}
export default CalendarClickModal