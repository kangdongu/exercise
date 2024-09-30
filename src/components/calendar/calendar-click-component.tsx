import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, doc, getDocs, orderBy, query } from 'firebase/firestore';
import styled from 'styled-components';
import MoSlideLeft from '../slideModal/mo-slide-left';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useExerciseContext } from './exercises-context';

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
  getData: boolean;
}


const Wrapper = styled.div`
  @media screen and (max-width: 700px) {
    width: 95%;
  }
  width: 80%;
  height: calc(100vh - 40px);
  overflow-y:scroll;
  background-color: white;
  z-index: 99;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 12px;
  position:relative;
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  margin-bottom:40px;
  flex-direction: column;
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
const AreaList = styled.div`
  width: 100%;
  margin-bottom: 20px;
  h1{
    font-size:25px;
  }
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
const GetDataButtonWrapper = styled.div`
  position:fixed;
  display:flex;
  width:100%;
  justify-content:center;
  bottom:50px;
`;
const GetDataButton = styled.button`
    background-color;
    padding:8px 15px;
    background-color:blue;
    color:white;
    font-size:16px;
    border-radius:7px;
`;

const CalendarClickModal: React.FC<CalendarClickModalProps> = ({ setCalendarClick, clickDate, getData }) => {
  const [exerciseRecords, setExerciseRecords] = useState<{ [key: string]: ExerciseData[] }>({});
  const [exerciseAreas, setExerciseAreas] = useState<string[]>([]);
  const [formatDate, setFormatDate] = useState<string>("")
  const user = auth.currentUser;
  const [getDataButton, setGetDataButton] = useState(false);
  const navigate = useNavigate();
  const { exercise, setExercise } = useExerciseContext()


  useEffect(() => {
    const formatClickDate = format(clickDate, "yyyy년 MM월 dd일")
    setFormatDate(formatClickDate)
  }, [])

  useEffect(() => {
    if (getData === true) {
      setGetDataButton(true);
    }
  }, []);

  useEffect(() => {
    const fetchExerciseRecords = async () => {
      try {
        const currentUserUID = user?.uid;
        if (!currentUserUID) {
          alert("로그인을 확인해주세요")
          return;
        }

        const recordsDocRef = doc(db, 'records', currentUserUID);
        const recordsCollectionRef = doc(collection(recordsDocRef, "운동기록"), clickDate)
        const exercisesCollectionRef = query(collection(recordsCollectionRef, "exercises"), orderBy("세트", "asc"));

        const recordsQuerySnapshot = await getDocs(exercisesCollectionRef);

        const records: { [key: string]: ExerciseData[] } = {};
        const areas: string[] = [];

        recordsQuerySnapshot.forEach(doc => {
          const data = doc.data() as ExerciseData;
          if (!records[data.종류]) {
            records[data.종류] = [];
          }
          records[data.종류].push(data);
          if (!areas.includes(data.운동부위)) {
            areas.push(data.운동부위);
          }
        });

        setExerciseRecords(records);
        setExerciseAreas(areas);

      } catch (error) {
        console.error('Error fetching exercise records:', error);
      }
    };

    fetchExerciseRecords();
  }, []);

  const pushData = async () => {
    try {
      const currentUserUID = user?.uid;
      if (!currentUserUID) {
        alert("로그인을 확인해주세요");
        return;
      }
      setExercise([])
      const userDocRef = doc(db, 'records', currentUserUID);
      const dateDocRef = doc(collection(userDocRef, '운동기록'), clickDate);

      const exerciseCollectionRef = query(collection(dateDocRef, "exercises"), orderBy("세트", "asc"));
      const exercisesQuerySnapshot = await getDocs(exerciseCollectionRef);

      const exerciseMap: { [key: string]: { exerciseType: string, sets: { kg: string, count: string }[], areaDb: string } } = {};

      exercisesQuerySnapshot.forEach(doc => {
        const data = doc.data();
        if (exerciseMap[data.종류]) {
          exerciseMap[data.종류].sets.push({ kg: data.무게, count: data.횟수 });
        } else {
          exerciseMap[data.종류] = {
            exerciseType: data.종류,
            sets: [{ kg: data.무게, count: data.횟수 }],
            areaDb: data.운동부위,
          };
        }
      });

      setExercise(ex => [...ex, ...Object.values(exerciseMap)]);
      console.log(exerciseMap);
    } catch (error) {
      console.error(error);
    }
  }

  if (exercise.length !== 0) {
    navigate("/exercise-records", { state: { clickDate } })
  }

  return (
    <MoSlideLeft onClose={() => setCalendarClick(false)}>
      <Wrapper>
        <div style={{ fontSize: '20px', fontWeight: '600' }}>{formatDate}</div>
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
        {getDataButton && (
          <GetDataButtonWrapper>
            <GetDataButton onClick={pushData}>해당 기록으로 운동기록하기</GetDataButton>
          </GetDataButtonWrapper>
        )}
      </Wrapper>
    </MoSlideLeft>
  );
}
export default CalendarClickModal