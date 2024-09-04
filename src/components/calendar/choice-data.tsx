import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../../firebase";
import { format } from "date-fns";
import CalendarClickModal from "./calendar-click-component";
import { IoIosArrowForward } from "react-icons/io";

const Wrapper = styled.div`
  width: 90%;
  padding: 15px 20px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const ExerciseList = styled.div`
  width: 100%;
`;

const ExerciseItem = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AreaList = styled.div`
  width: 100%;
  margin-bottom: 5px;
`;

const DayArea = styled.span`
  display: inline-block;
  font-size: 16px;
  color: #555;
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #e0f7fa;
  border-radius: 5px;
  margin-bottom: 5px;
`;
const TextWrapper = styled.div`
    width:100%;
`;
const Text = styled.div`
    display:flex;

`;
const Title = styled.div`
    font-weight:600;
`;
const Sub = styled.div`
    margin-left:auto;
`;

interface ChoiceDataProps {
    clickDate: string;
}

interface ExerciseData {
    이름: string;
    종류: string;
    횟수: string;
    무게: string;
    운동부위: string;
}

const ChoiceData: React.FC<ChoiceDataProps> = ({ clickDate }) => {
    const currentUser = auth.currentUser;
    const [exerciseRecords, setExerciseRecords] = useState<{ [key: string]: ExerciseData[] }>({});
    const [exerciseAreas, setExerciseAreas] = useState<string[]>([]);
    const [clickFormat, setClickFormat] = useState<string>("")
    const [clickModal, setClickModal] = useState(false);

    useEffect(() => {
        // clickDate가 변경될 때마다 포맷된 날짜를 설정
        if (clickDate) {
            const formattedDate = format(new Date(clickDate), "yyyy년 MM월 dd일");
            setClickFormat(formattedDate);
        }
    }, [clickDate]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const recordsRefs = collection(db, "records");
                const querySnapshot = await getDocs(query(recordsRefs, where("유저아이디", "==", currentUser?.uid), where("날짜", "==", clickDate)))

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

            } catch (error) {
                console.log(error)
            }
        }
        if (clickDate) {
            fetchRecords();
        }

        fetchRecords()
        console.log(exerciseRecords)
    }, [clickDate])

    return (
        <>
            {exerciseAreas.length !== 0 && (
                <Wrapper>
                    <ContentWrapper>
                        <AreaList>
                            <div style={{ display: 'flex', alignItems:'center' }}>
                                <h3 style={{ fontWeight: '600' }}>{clickFormat}</h3>
                                <IoIosArrowForward onClick={() => setClickModal(true)} style={{marginLeft:'auto', width:'20px', height:'20px'}} />
                            </div>

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
                        <TextWrapper>
                            <Text>
                                <Title>운동 부위</Title>
                                {exerciseAreas.map((area, index) => (
                                    <Sub key={index}>{area}</Sub>
                                ))} 
                            </Text>
                            <Text>
                                <Title>운동 종류</Title>
                                    <Sub></Sub>
                            </Text>
                        </TextWrapper>
                    </ContentWrapper>
                    {clickModal && (
                        <CalendarClickModal setCalendarClick={setClickModal} clickDate={clickDate} />
                    )}
                </Wrapper>
            )}
        </>
    )
}
export default ChoiceData