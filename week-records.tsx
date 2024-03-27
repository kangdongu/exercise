import { QueryDocumentSnapshot, collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { startOfWeek, endOfWeek, format, subWeeks } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styled from 'styled-components';

const Wrapper = styled.div`
  width:100%;
  height:500px;
  display:flex;
`;
const LineWrapper = styled.div`
  width:45%;
  height:300px;
  gap:10%;
`;
const NowWeekWrapper =styled.div`
  width:45%;
  height:300px;
`;

const WeekDates = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [exerciseCount, setExerciseCount] = useState(0);
  const [exerciseCountsByWeek, setExerciseCountsByWeek] = useState<number[]>([]); // 주별 운동 횟수 배열
  const currentUserUID = auth.currentUser?.uid;

  useEffect(() => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 }); // 월요일을 시작으로 하는 주의 시작 날짜
    const sunday = endOfWeek(today, { weekStartsOn: 1 }); // 월요일을 시작으로 하는 주의 끝 날짜
    setStartDate(monday);
    setEndDate(sunday);

    const startDateStr = format(monday, 'yyyy-MM-dd');
    const endDateStr = format(sunday, 'yyyy-MM-dd');



    const fetchExerciseCount = async () => {
      try {
        if (currentUserUID) {
          const recordsCollectionRef = collection(db, 'records');
          const querySnapshot = await getDocs(
            query(
              recordsCollectionRef,
              where('유저아이디', '==', currentUserUID),
              where('날짜', '>=', startDateStr),
              where('날짜', '<=', endDateStr)
            )
          );

          // 중복을 제거한 날짜 목록을 저장할 Set을 생성합니다.
          const uniqueDates = new Set();

          // 각 문서를 반복하면서 중복을 제거한 날짜 목록을 채웁니다.
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const date = doc.data().날짜;
            if (date) {
              uniqueDates.add(date);
            }
          });

          // 중복을 제거한 날짜의 개수를 세어 전체 운동 횟수를 구합니다.
          const count = uniqueDates.size;

          setExerciseCount(count);
          console.log(count)
        }
      } catch (error) {
        console.error('Error fetching exercise count:', error);
      }
    };

    fetchExerciseCount();
  }, []);

  useEffect(() => {
    fetchExerciseCountsByWeek();
  }, [currentUserUID]);

  useEffect(() => {
    console.log(exerciseCountsByWeek); // exerciseCountsByWeek 값이 설정된 후에 실행되도록 이동
}, [exerciseCountsByWeek]);

  const fetchExerciseCountsByWeek = async () => {
    try {
      if (currentUserUID) {
        const currentDate = new Date();
        const weeksAgo = [4, 3, 2, 1]; // 1주부터 4주 전까지의 데이터를 가져옵니다.
        const countsByWeek = await Promise.all(weeksAgo.map(async (week) => {
          const weekStartDate = startOfWeek(subWeeks(currentDate, week), { weekStartsOn: 1 }); 
          const weekEndDate = endOfWeek(subWeeks(currentDate, week), { weekStartsOn: 1 }); 
          const startStr = format(weekStartDate, 'yyyy-MM-dd');
          const endStr = format(weekEndDate, 'yyyy-MM-dd');
          const recordsCollectionRef = collection(db, 'records');
          const querySnapshot = await getDocs(

            query(
              recordsCollectionRef,
              where('유저아이디', '==', currentUserUID),
              where('날짜', '>=', startStr),
              where('날짜', '<=', endStr)
            )
          );
          const uniqueDates = new Set();

          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const date = doc.data().날짜;
            if (date) {
              uniqueDates.add(date);
            }
          });

          return uniqueDates.size;
        }));

        setExerciseCountsByWeek(countsByWeek);
        console.log(exerciseCountsByWeek);
      }
    } catch (error) {
      console.error('Error fetching exercise counts by week:', error);
    }
  };

  Chart.register(...registerables);

  return (
    <Wrapper>
      <NowWeekWrapper>
        <p>월요일: {format(startDate, 'yyyy-MM-dd')}</p>
        <p>일요일: {format(endDate, 'yyyy-MM-dd')}</p>
        <p>이번주는 현재 {exerciseCount}일 운동하셨습니다.</p>
      </NowWeekWrapper>
      <LineWrapper>
        <Line height={400}
          width={600}
          data={{
            labels: ['4주 전', '3주 전', '2주 전', '1주 전', '이번주'],
            datasets: [
              {
                label: '주별 운동 횟수',
                data: [...exerciseCountsByWeek, exerciseCount],
                fill: false,
                type: "line",
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }
            ]
          }}
          options={{
            responsive: false
          }}
        />
      </LineWrapper>
    </Wrapper>
  );
}

export default WeekDates;