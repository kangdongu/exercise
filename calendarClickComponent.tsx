import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styled from 'styled-components';

interface ExerciseData {
    이름: string;
    종류: string;
    횟수: string;
    무게: string;
}

interface CalendarClickModalProps {
    setCalendarClick: (value: boolean) => void;
    clickDate: string;
}


const Wrapper = styled.div`
    width:80%;
    height:80vh;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    background-color:white;
    z-index:99;
`;
const Button = styled.button`

`;
const ExerciseList = styled.div`

`;
const ExerciseItem = styled.div`

`;
const Title = styled.span`
    color:blue;
    font-size:20px;
    font-weight:600;
`;

const CalendarClickModal: React.FC<CalendarClickModalProps> = ({ setCalendarClick, clickDate }) => {
    const [exerciseRecords, setExerciseRecords] = useState<{ [key: string]: ExerciseData[] }>({});

    useEffect(() => {
        const fetchExerciseRecords = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const currentUserUID = user.uid;
                    const recordsRef = collection(db, 'records');
                    const querySnapshot = await getDocs(query(recordsRef, where('유저아이디', '==', currentUserUID), where('날짜', '==', clickDate)));
                    
                    const records: { [key: string]: ExerciseData[] } = {};

                    querySnapshot.forEach(doc => {
                        const data = doc.data() as ExerciseData;
                        // 운동 종류를 키로 사용하여 그룹화합니다.
                        if (!records[data.종류]) {
                            records[data.종류] = [];
                        }
                        records[data.종류].push(data);
                    });

                    // 각 종류별로 운동 정보를 정렬합니다.
                    Object.keys(records).forEach(key => {
                        records[key].sort((a, b) => {
                            // 정렬 기준을 변경하려면 여기에 원하는 정렬 방식을 추가하세요.
                            // 여기서는 무게를 기준으로 정렬합니다.
                            return parseInt(a.무게) - parseInt(b.무게);
                        });
                    });

                    setExerciseRecords(records);
                }
            } catch (error) {
                console.error('Error fetching exercise records:', error);
                // 오류 처리
            }
        };

        fetchExerciseRecords();
    }, [clickDate]);

    return (
        <Wrapper>
            <Button onClick={() => setCalendarClick(false)}>닫기</Button>
            <ExerciseList>
                {Object.keys(exerciseRecords).map((exerciseType, index) => (
                    <ExerciseItem key={index}>
                        <Title>{exerciseType}</Title>
                        {/* 각 운동 종류별로 운동 정보를 출력합니다. */}
                        {exerciseRecords[exerciseType].map((record, recordIndex) => (
                            <p key={recordIndex}> {recordIndex + 1}세트 무게: {record.무게} 횟수: {record.횟수}</p>
                        ))}
                    </ExerciseItem>
                ))}
            </ExerciseList>
        </Wrapper>
    );
}
export default CalendarClickModal