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
    position:relative;
   }
    width:80%;
    height:80vh;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    background-color:white;
    z-index:99;
    padding-left:3%;
    box-sizing:border-box;
`;
const ContentWrapper = styled.div`
    width:100%;
    display:flex;
`;
const Button = styled.button`
@media screen and (max-width: 700px) {
    display:none;
   }
    margin-bottom:20px;
    margin-left:-3%;
`;
const ExerciseList = styled.div`
    width:50%;
`;
const ExerciseItem = styled.div`

`;
const Title = styled.span`
@media screen and (max-width: 700px) {
    font-size:18px;
   }
    color:blue;
    font-size:20px;
    font-weight:600;
    margin-top:10px;
`;
const Transparency = styled.div`
@media screen and (max-width: 700px) {
    position:relative;
    background-color:white;
   }
width:100%;
height:100vh;
background-color:rgba(0, 0, 0, 0.5);
position:fixed;
top:0;
left:0;
z-index:98;
`;
const AreaList = styled.div`
    width:40%;
`;
const DayArea = styled.span`
    font-size:25px;
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
            <Button onClick={() => setCalendarClick(false)}>닫기</Button>
            <ContentWrapper>
            <AreaList>
            <h1>운동 부위</h1>
                    {exerciseAreas.map((area, index) => (
                        <DayArea key={index}>{area} </DayArea>
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