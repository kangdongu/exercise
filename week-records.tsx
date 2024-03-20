// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

// export default function WeekRecords(){



// const data = [
//     {
//       "name": "Page A",
//       "pv": 7,
//       "amt": 2400
//     },
//     {
//       "name": "Page B",
//       "pv": 3,
//       "amt": 2210
//     },
//     {
//       "name": "Page C",
//       "pv": 4,
//       "amt": 2290
//     },
//     {
//       "name": "Page D",
//       "pv": 2,
//       "amt": 2000
//     },
//     {
//       "name": "Page E",
//       "pv": 5,
//       "amt": 2181
//     },
//     {
//       "name": "Page F",
//       "pv": 6,
//       "amt": 2500
//     },
//     {
//       "name": "Page G",
//       "pv": 6,
//       "amt": 2100
//     }
//   ]
//   return (
                              
//   <LineChart width={730} height={250} data={data}
//     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="name" />
//     <YAxis />
//     <Tooltip />
//     <Legend />
//     <Line type="monotone" dataKey="pv" stroke="#8884d8" />
//   </LineChart>
//   )
//   }

import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface WeeklyExerciseProps {
  closeModal: () => void;
}

export default function WeeklyExerciseStats({ closeModal }: WeeklyExerciseProps) {
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchWeeklyExerciseCount = async () => {
      try {
        if (user) {
          const currentUserUID = user.uid;
          const startDate = new Date();
          const endDate = new Date();
          startDate.setDate(startDate.getDate() - 6); // 일주일 전 날짜 설정
          const startDateStr = formatDate(startDate);
          const endDateStr = formatDate(endDate);

          const recordsCollectionRef = collection(db, 'records');
          const querySnapshot = await getDocs(
            query(recordsCollectionRef, 
                  where('유저아이디', '==', currentUserUID),
                  where('날짜', '>=', startDateStr),
                  where('날짜', '<=', endDateStr))
          );

          let count = 0;
          querySnapshot.forEach((doc) => {
            count++;
          });

          setExerciseCount(count);
        }
      } catch (error) {
        console.error('Error fetching weekly exercise count:', error);
      }
    };

    fetchWeeklyExerciseCount();
  }, [user]);

  return (
    <div>
      <p>이번 주에 {exerciseCount}일 운동하셨습니다.</p>
      <button onClick={closeModal}>닫기</button>
    </div>
  );
}