import { QueryDocumentSnapshot, collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { startOfWeek, endOfWeek, format, subWeeks } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styled from 'styled-components';

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
  flex-direction: column;
}
  width:100%;
  height:500px;
  display:flex;
`;
const LineWrapper = styled.div`
  width:100%;
  height:300px;
  display: flex;
  justify-content: center;
  background-color:white;
  border-radius:10px;
  margin-bottom:20px;
`;
const NowWeekWrapper = styled.div`
  width:100%;
  height:150px;
  background-color:white;
  border-radius:10px;
  margin-bottom:20px;
  padding: 10px 15px;
`;

const WeekDates = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [exerciseCount, setExerciseCount] = useState(0);
  const [exerciseCountsByWeek, setExerciseCountsByWeek] = useState<number[]>([]);
  const currentUserUID = auth.currentUser?.uid;
  const [chartWidth, setChartWidth] = useState(window.innerWidth >= 700 ? 600 : 350);
  const [chartHeight, setChartHeight] = useState(window.innerWidth >= 700 ? 400 : 300)

  const updateChartSize = useCallback(() => {
    setChartWidth(window.innerWidth >= 700 ? 600 : 350);
    setChartHeight(window.innerWidth >= 700 ? 400 : 300);
  }, []);

  useEffect(() => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const sunday = endOfWeek(today, { weekStartsOn: 1 });
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

          const uniqueDates = new Set();

          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const date = doc.data().날짜;
            if (date) {
              uniqueDates.add(date);
            }
          });

          const count = uniqueDates.size;

          setExerciseCount(count);
        }
      } catch (error) {
        console.error('운동 횟수 가져오는 중 오류 발생:', error);
      }
    };

    fetchExerciseCount();
  }, []);

  useEffect(() => {
    fetchExerciseCountsByWeek();
  }, []);

  const fetchExerciseCountsByWeek = async () => {
    try {
      if (currentUserUID) {
        const currentDate = new Date();
        const weeksAgo = [4, 3, 2, 1];
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
      }
    } catch (error) {
      console.error('주별 운동 횟수 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      updateChartSize();
    };

    window.addEventListener('resize', handleResize);

    updateChartSize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  Chart.register(...registerables);

  return (
    <Wrapper>
      <LineWrapper>
        <Line height={chartHeight}
          width={chartWidth}
          data={{
            labels: ['4주 전', '3주 전', '2주 전', '1주 전', '이번주'],
            datasets: [
              {
                label: '주별 운동 횟수',
                data: [...exerciseCountsByWeek, exerciseCount],
                fill: true,
                type: "line",
                tension: 0,
                borderColor:'#FF595E',
                backgroundColor:'rgba(255,89,94,0.3)'
              }
            ]
          }}
          options={{
            responsive: false,
            scales: {
              y: {
                min: 0,
                max: 7,
                ticks: {
                  stepSize: 1,
                }
              }
            }
          }}
        />
      </LineWrapper>
      <h4 style={{ fontSize: "18px", margin: "0px" }}>이번주 운동</h4>
      <NowWeekWrapper>
        <p>월요일: {format(startDate, 'yyyy-MM-dd')}</p>
        <p>일요일: {format(endDate, 'yyyy-MM-dd')}</p>
        <p>이번주는 현재 {exerciseCount}일 운동하셨습니다.</p>
      </NowWeekWrapper>
    </Wrapper>
  );
}

export default WeekDates;