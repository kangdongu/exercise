// import React, { useEffect } from 'react';
// import { addDoc, collection } from 'firebase/firestore';
// import { db } from '../firebase';

// const ExerciseDataComponent: React.FC = () => {
//   useEffect(() => {
//     const exercisesData = [
//         { 운동부위: '하체', 운동이름: '맨몸 스쿼트', 카테고리: '맨몸운동' },
//         { 운동부위: '복근', 운동이름: '크런치', 카테고리: '맨몸운동' },
//         { 운동부위: '삼두', 운동이름: '딥스', 카테고리: '맨몸운동' },
//         { 운동부위: '하체', 운동이름: '런지', 카테고리: '맨몸운동' },
//         { 운동부위: '가슴', 운동이름: '푸쉬업', 카테고리: '맨몸운동' },
//         { 운동부위: '복근', 운동이름: '플랭크', 카테고리: '맨몸운동' },
//         { 운동부위: '등', 운동이름: '풀업', 카테고리: '맨몸운동' },
//         { 운동부위: '하체', 운동이름: '스쿼트', 카테고리: '헬스' },
//         { 운동부위: '등', 운동이름: '데드리프트', 카테고리: '헬스' },
//         { 운동부위: '가슴', 운동이름: '벤치프레스', 카테고리: '헬스' },
//         { 운동부위: '가슴', 운동이름: '스미스 머신 벤치프레스', 카테고리: '헬스' },
//         { 운동부위: '가슴', 운동이름: '스미스 머신 인클라인 벤치', 카테고리: '헬스' },
//         { 운동부위: '가슴', 운동이름: '스미스 머신 디클라인 벤치', 카테고리: '헬스' },
//         { 운동부위: '하체', 운동이름: '바벨 런지', 카테고리: '헬스' },
//         { 운동부위: '등', 운동이름: '바벨 로우', 카테고리: '헬스' },
//         { 운동부위: '어깨', 운동이름: '숄더 프레스', 카테고리: '헬스' },
//     ];

//     // Firestore에 운동 데이터 저장
//     exercisesData.forEach(async (exercise) => {
//       try {
//         const docRef = await addDoc(collection(db, 'exercises'), exercise);
//         console.log('운동 데이터 추가됨:', docRef.id);
//       } catch (error) {
//         console.error('운동 데이터 추가 실패:', error);
//       }
//     });
//   }, []); 

//   return null; 
// };

// export default ExerciseDataComponent;