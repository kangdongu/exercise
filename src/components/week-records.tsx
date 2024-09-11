import { QueryDocumentSnapshot, collection, getDocs, DocumentData, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { startOfWeek, endOfWeek, format, subWeeks } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styled from 'styled-components';
import ThisWeekRecords from './this-week-records';

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
  flex-direction: column;
}
  width:100%;
  display:flex;
`;
const LineWrapper = styled.div`
  width:95%;
  height:250px;
  border-radius:10px;
  margin: 0 auto;
  margin-top:25px;
`;
const NowWeekWrapper = styled.div`
  width:100%;
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
          const recordsDocRef = doc(db, 'records', currentUserUID);
          const exerciseCollectionRef = collection(recordsDocRef, '운동기록');

          const exerciseQuerySnapshot = await getDocs(exerciseCollectionRef);

          const uniqueDates = new Set();

          exerciseQuerySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const date = doc.id; // 날짜가 문서 ID로 저장됨
            if (date >= startDateStr && date <= endDateStr) {
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

          const recordsDocRef = doc(db, 'records', currentUserUID);
          const exerciseCollectionRef = collection(recordsDocRef, '운동기록');
          const exerciseQuerySnapshot = await getDocs(exerciseCollectionRef);

          const uniqueDates = new Set();

          exerciseQuerySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const date = doc.id; // 날짜가 문서 ID로 저장됨
            if (date >= startStr && date <= endStr) {
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

  Chart.register(...registerables);

  return (
    <Wrapper>
      <div style={{width:'100%', height:'300px', backgroundColor:'white', marginBottom:'20px'}}>
        <LineWrapper>
          <Line
            data={{
              labels: ['4주 전', '3주 전', '2주 전', '1주 전', '이번주'],
              datasets: [
                {
                  label: '주별 운동 횟수',
                  data: [...exerciseCountsByWeek, exerciseCount],
                  fill: true,
                  type: "line",
                  tension: 0,
                  borderColor: '#FF595E',
                  backgroundColor: 'rgba(255,89,94,0.3)'
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  ticks: {
                    stepSize: 1,
                  }
                }
              }
            }}
          />
        </LineWrapper>
      </div>
      <h4 style={{ margin: "10px 0px" }}>이번주 운동</h4>
      <NowWeekWrapper>
        <p>월요일: {format(startDate, 'yyyy-MM-dd')}</p>
        <p>일요일: {format(endDate, 'yyyy-MM-dd')}</p>
        <ThisWeekRecords />
        <p style={{fontSize:'20px'}}>이번주 현재 {exerciseCount}일 운동하셨습니다.</p>
      </NowWeekWrapper>
    </Wrapper>
  );
}

export default WeekDates;
