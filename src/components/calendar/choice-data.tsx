import { collection, doc, getDocs } from "firebase/firestore";
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
  margin-bottom:20px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;
const AreaList = styled.div`
  width: 100%;
  margin-bottom: 5px;
`;
const TextWrapper = styled.div`
  margin-top: 10px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const Text = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
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
    세트:number;
}

const ChoiceData: React.FC<ChoiceDataProps> = ({ clickDate }) => {
    const currentUser = auth.currentUser;
    const [exerciseRecords, setExerciseRecords] = useState<{ [key: string]: ExerciseData[] }>({});
    const [exerciseAreas, setExerciseAreas] = useState<string[]>([]);
    const [clickFormat, setClickFormat] = useState<string>("");
    const [clickModal, setClickModal] = useState(false);
    const [totalSets, setTotalSets] = useState<number>(0);
    const [totalReps, setTotalReps] = useState<number>(0);
    const [totalWeight, setTotalWeight] = useState<number>(0);
  
    useEffect(() => {
      if (clickDate) {
        const formattedDate = format(new Date(clickDate), "yyyy년 MM월 dd일");
        setClickFormat(formattedDate);
      }
    }, [clickDate]);
  
    useEffect(() => {
      const fetchRecords = async () => {
        try {
          if(!currentUser?.uid){
            alert("로그인을 확인해주세요")
            return;
          }
          const recordsDocRefs = doc(db, "records", currentUser?.uid);
          const recordsCollectionRef = doc(collection(recordsDocRefs, "운동기록"), clickDate);
          const exercisesCollectionRef = collection(recordsCollectionRef, "exercises")

          const recordsQuerySnapshot = await getDocs(exercisesCollectionRef)

  
          const records: { [key: string]: ExerciseData[] } = {};
          const areas: string[] = [];
          let sets = 0;
          let reps = 0;
          let weight = 0;
  
          recordsQuerySnapshot.forEach((doc) => {
            const data = doc.data() as ExerciseData;
            if (!records[data.종류]) {
              records[data.종류] = [];
            }
            records[data.종류].push(data);
            if (!areas.includes(data.운동부위)) {
              areas.push(data.운동부위);
            }
            sets++;
            reps += parseInt(data.횟수);
            const weightValue = data.무게 === "" ? 0 : parseInt(data.무게);
            weight += weightValue * parseInt(data.횟수);
          });
  
          Object.keys(records).forEach((key) => {
            records[key].sort((a, b) => {
              return parseInt(a.무게) - parseInt(b.무게);
            });
          });
  
          setExerciseRecords(records);
          setExerciseAreas(areas);
          setTotalSets(sets);
          setTotalReps(reps);
          setTotalWeight(weight);
  
        } catch (error) {
          console.log(error);
        }
      };
      if (clickDate) {
        fetchRecords();
      }
    }, [clickDate]);
  
    return (
      <>
        {exerciseAreas.length !== 0 && (
          <Wrapper>
            <ContentWrapper>
              <AreaList>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: '600', fontSize:'18px' }}>{clickFormat}</h3>
                  <IoIosArrowForward onClick={() => setClickModal(true)} style={{ marginLeft: 'auto', width: '18px', height: '18px' }} />
                </div>
                <TextWrapper>
                  <Text>
                    <Title>운동 부위</Title>
                    <Sub>{exerciseAreas.join(", ")}</Sub>
                  </Text>
                  <Text>
                    <Title>운동 종류</Title>
                    <Sub>{Object.keys(exerciseRecords).length}개</Sub>
                  </Text>
                  <Text>
                    <Title>총 세트 수</Title>
                    <Sub>{totalSets}세트</Sub>
                  </Text>
                  <Text>
                    <Title>총 횟수</Title>
                    <Sub>{totalReps}회</Sub>
                  </Text>
                  <Text>
                    <Title>총 무게</Title>
                    <Sub>{totalWeight}kg</Sub>
                  </Text>
                </TextWrapper>
              </AreaList>
            </ContentWrapper>
            {clickModal && (
              <CalendarClickModal setCalendarClick={setClickModal} clickDate={clickDate} />
            )}
          </Wrapper>
        )}
      </>
    );
  };
  
  export default ChoiceData;