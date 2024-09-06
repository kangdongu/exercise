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
const AreaList = styled.div`
  width: 100%;
  margin-bottom: 5px;
`;
const TextWrapper = styled.div`
  margin-top: 10px;
  background-color: #f9f9f9;
  padding: 15px; /* 여백을 늘려서 정보가 빽빽하지 않도록 */
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const Text = styled.div`
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 텍스트 정렬 */
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea; /* 섹션 구분선 */
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
          const recordsRefs = collection(db, "records");
          const querySnapshot = await getDocs(query(recordsRefs, where("유저아이디", "==", currentUser?.uid), where("날짜", "==", clickDate)));
  
          const records: { [key: string]: ExerciseData[] } = {};
          const areas: string[] = [];
          let sets = 0;
          let reps = 0;
          let weight = 0;
  
          querySnapshot.forEach((doc) => {
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
            weight += (parseInt(data.무게) * parseInt(data.횟수));
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
                  <h3 style={{ fontWeight: '600' }}>{clickFormat}</h3>
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