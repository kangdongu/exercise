import { QueryDocumentSnapshot, collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import Profile from '../routes/profile';
import { startOfWeek, endOfWeek, format } from 'date-fns';
// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"



const WeekDates = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [exerciseCount, setExerciseCount] = useState(0);

  useEffect(() => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 }); // 월요일을 시작으로 하는 주의 시작 날짜
    const sunday = endOfWeek(today, { weekStartsOn: 1 }); // 월요일을 시작으로 하는 주의 끝 날짜
    setStartDate(monday);
    setEndDate(sunday);

    const startDateStr = format(monday, 'yyyy-MM-dd');
    const endDateStr = format(sunday, 'yyyy-MM-dd');

    const currentUserUID = auth.currentUser?.uid;

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

          // 객체를 사용하여 각 날짜의 운동 횟수를 저장합니다.
          const exerciseCountPerDate: Record<string, number> = {};

          // 각 문서를 반복하면서 날짜별 운동 횟수를 계산합니다.
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            const date = doc.data().날짜;
            if (date) {
              exerciseCountPerDate[date] = (exerciseCountPerDate[date] || 0) + 1;
            }
          });

          // 객체에 저장된 날짜의 개수를 세어 전체 운동 횟수를 구합니다.
          const count = Object.keys(exerciseCountPerDate).length;

          setExerciseCount(count);
        }
      } catch (error) {
        console.error('Error fetching exercise count:', error);
      }
    };

    fetchExerciseCount();
  }, [Profile]);

  
  

  // const data = [
  //   {
  //     "name": `저저저저저번주`,
  //     "pv": 3,
  //     "amt": 2210
  //   },
  //   {
  //     "name": "저저저저번주",
  //     "pv": 4,
  //     "amt": 2290
  //   },
  //   {
  //     "name": "저저저번주",
  //     "pv": 2,
  //     "amt": 2000
  //   },
  //   {
  //     "name": "저저번주",
  //     "pv": 5,
  //     "amt": 2181
  //   },
  //   {
  //     "name": "저번주",
  //     "pv": 6,
  //     "amt": 2500
  //   },
  //   {
  //     "name": `${startDate.toISOString().slice(0, 10)}<br />${endDate.toISOString().slice(0, 10)}`,
  //     "pv": exerciseCount,
  //     "amt": 2400
  //   }
  // ]

  return (
    <div>
      <p>월요일: {startDate.toISOString().slice(0, 10)}</p>
      <p>일요일: {endDate.toISOString().slice(0, 10)}</p>
      <p>이번주는 현재 {exerciseCount}일 운동하셨습니다.</p>
      {/* <LineChart width={730} height={250} data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
      </LineChart> */}
    </div>
  );
}

export default WeekDates;




