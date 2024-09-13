import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import DateChoice from "../date-picker";
import { format } from 'date-fns';
import MoSlideLeft from "../slideModal/mo-slide-left";
import { AiOutlineDelete } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";


const Wrapper = styled.div`
@media screen and (max-width: 700px) {
  position:relative;
  background-color:white;
}
  width:100%;
  height:100vh;
  background-color:rgba(0, 0, 0, 0.5);
  position:fixed;
  top:0px;
  left:0;
  z-index:102;
`;
const RecordsWrapper = styled.div`
@media screen and (max-width: 700px) {
  position:relative;
  width:100%;
  top:0;
  left:0;
  transform:translate(0px,0px);
  z-index:105;
}
  height:calc(100vh - 80px);
  background-color:#f8f8f8;
  overflow-y:scroll;
  z-index: 105;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding:10px 10px;
  box-sizing:border-box;
  padding-bottom:70px;
`;
const Label = styled.label`
   display: block;
  margin: 10px 0;
  font-size: 16px;
  color: #333;
`;
const Input = styled.input`
 width: 80px;
  padding: 5px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  text-align: center;
`;
const Button = styled.button`
 width: 100%;
  padding: 15px;
  background-color: #FC286E;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
`;
const ListSetButtonWrapper = styled.div`
  width:100%;
  display:flex;
  flex-direction: column;
  gap:10px;
`;
const SetList = styled.div``;
const ListBody = styled.div`
   display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;
const SetPlus = styled.div`
 width: 35%;
  padding: 10px;
  background-color: #53A85B;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display:flex;
  margin-left:auto;
  &:hover {
    background-color: #66bb99;
  }
`;
const SetDelete = styled.div`
 padding: 5px 10px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #ff7875;
  }
`;
const ExerciseDataBtn = styled.div`
 width: 35%;
  padding: 10px;
  background-color: #53A85B;
  margin-left:auto;
  color: white;
  border: none;
  display:flex;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #66bb99;
  }
`;


const DateChoiceWrapper = styled.div`
  margin-top:20px;
`;
const ExerciseNameWrapper = styled.div`
  width:100%;
  height:50px;
  margin-top:20px;
`;

const ExerciseWrapper = styled.div`
  width:95%;
  position:relative;
  background-color:white;
  margin: 15px auto;
  padding:15px;
  border-radius:10px;
`;
const ExericseDelete = styled.div`
  position:absolute;
  right:10px;
  width:30px;
  height:30px;
  svg{
    color:red;
    width:25px;
    height:25px;
  }
`;

const ExerciseRecords = () => {
  const currentUser = auth.currentUser;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [exercises, setExercises] = useState<{ exerciseType: string; sets: { kg: string; count: string }[]; areaDb: string; }[]>([]);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const initialExercises = location.state?.exercises || [];
    setExercises(initialExercises);
  }, [location.state]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const onChange = (
    exerciseIndex: number,
    setIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex] = { ...newExercises[exerciseIndex].sets[setIndex], [name]: value };
    setExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets.push({ kg: "", count: "" })
    setExercises(newExercises)
  };

  const addExercise = () => {
    setExercises([...exercises, { exerciseType: "", sets: [{ kg: "", count: "" }], areaDb: "" }]);
  };

  const onClick = async () => {
    if (exercises.every(exercise => exercise.exerciseType !== '' && exercise.sets.every(set => set.count))) {
      try {
        const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
        const userId = currentUser?.uid;
        if (!userId) {
          alert('사용자 정보가 없습니다. 로그인을 확인해주세요.');
          return;
        }

        const userDocRef = doc(db, 'records', userId);
        const dateDocRef = doc(collection(userDocRef, '운동기록'), date);

        await setDoc(dateDocRef, { 날짜: date });

        const exercisePromises = exercises.map((exercise) => {
          const exercisesCollectionRef = collection(dateDocRef, 'exercises');
          const setPromises = exercise.sets.map((set, index) =>
            addDoc(exercisesCollectionRef, {
              종류: exercise.exerciseType,
              횟수: set.count,
              세트: index + 1,
              무게: set.kg,
              운동부위: exercise.areaDb,
            })
          );
          return Promise.all(setPromises);
        });

        await Promise.all(exercisePromises);

        const usersRef = collection(db, 'user');
        const userQuerySnapshot = await getDocs(query(usersRef, where("유저아이디", "==", userId)));

        if (!userQuerySnapshot.empty) {
          const userDoc = userQuerySnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            마지막운동: date,
          });
        }

        navigate('/records', { state: { congratulations: true, recordsComplete: true } });
      } catch (error) {
        console.error('운동 기록 저장 중 오류 발생: ', error);
      }
    } else {
      alert('모든 운동의 종류와 횟수를 입력해주세요.');
    }
  };


  const onDelete = (exerciseIndex: number, setIndex: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(newExercises);
  };

  const exerciseDelete = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const ExerciseChoice = () => {
    navigate('/exercise-choice');
  };
  const handleClose = () => {
    navigate('/exercise-choice');
  };

  return (
    <Wrapper>
      <MoSlideLeft onClose={handleClose}>
        <RecordsWrapper>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0px' }}>
            <h3 style={{ fontSize: '18px', margin: '0' }}>운동기록</h3>
          </div>
          <DateChoiceWrapper>
            <DateChoice onDateChange={handleDateChange} />
          </DateChoiceWrapper>
          <div style={{ color: 'green' }} onClick={addExercise}>+ 운동추가</div>
          {exercises.map((exercise, exerciseIndex) => (
            <ExerciseWrapper key={exerciseIndex}>
              <ExericseDelete onClick={(event) => exerciseDelete(exerciseIndex, event)}>
                <AiOutlineDelete />
              </ExericseDelete>
              <ExerciseNameWrapper>
                <Label>
                  운동종류:{" "}
                  <Input
                    style={{ width: '127px', border: '1px solid #333333' }}
                    onChange={(e) => {
                      const newExercises = [...exercises];
                      newExercises[exerciseIndex].exerciseType = e.target.value;
                      setExercises(newExercises);
                    }}
                    value={exercise.exerciseType}
                    type="text"
                    name="exerciseType"
                    placeholder="운동 직접입력"
                  />
                </Label>
              </ExerciseNameWrapper>
              <ListSetButtonWrapper>
                <ExerciseDataBtn onClick={() => ExerciseChoice()}>운동선택<span style={{ marginLeft: "auto", fontSize: "20px", fontWeight: '600' }}>&gt;</span></ExerciseDataBtn>
                <SetPlus onClick={() => addSet(exerciseIndex)}>세트추가<span style={{ marginLeft: "auto", fontSize: "20px", fontWeight: '600' }}>+</span></SetPlus>
              </ListSetButtonWrapper>
              <SetList>
                {exercise.sets.map((set, setIndex) => (
                  <ListBody key={setIndex}>
                    <span>{setIndex + 1}. 세트</span>
                    <Input
                      type="number"
                      name="kg"
                      value={set.kg}
                      onChange={(e) => onChange(exerciseIndex, setIndex, e)}
                      placeholder="kg"
                    />
                    <Input
                      type="number"
                      name="count"
                      value={set.count}
                      onChange={(e) => onChange(exerciseIndex, setIndex, e)}
                      placeholder="회/분"
                    />
                    <SetDelete onClick={(event) => onDelete(exerciseIndex, setIndex, event)}>-</SetDelete>
                  </ListBody>
                ))}
              </SetList>
            </ExerciseWrapper>
          ))}
          <Button onClick={onClick}>운동 완료</Button>
        </RecordsWrapper>
      </MoSlideLeft>
    </Wrapper>
  );
}
export default ExerciseRecords