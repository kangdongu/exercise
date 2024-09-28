import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import DateChoice from "../date-picker";
import { format } from 'date-fns';
import MoSlideLeft from "../slideModal/mo-slide-left";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useExerciseContext } from "./exercises-context";


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
  width:95%;
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
const ExercisePlus = styled.div`
  color:#53A85B;
  background-color:white;
  padding:8px 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin:5px auto;
  width:100%;
  text-align:center;
  font-size:18px;
  font-weight:600;
  border:5px;
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
`;
const SetList = styled.div``;
const ListBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;
const SetPlus = styled.div`
    width: 100%;
    padding: 10px;
    color: #53A85B;
    font-size: 16px;
    cursor: pointer;
    font-weight: 600;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
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

const DateChoiceWrapper = styled.div`
  margin-top:20px;
`;
const ExerciseNameWrapper = styled.div`
  width:100%;
  height:50px;
  margin-top:20px;
`;

const ExerciseWrapper = styled.div`
  width:100%;
  position:relative;
  background-color:white;
  margin: 15px auto;
  padding:15px;
  border-radius:10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
const InputTitle = styled.input`

`;


const ExerciseRecords = () => {
  const currentUser = auth.currentUser;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const navigate = useNavigate();
  const { exercise, setExercise } = useExerciseContext();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (!Array.isArray(exercise)) {
      console.error('exercise is not an array', exercise);
    } else {
      console.log('exercise is an array:', exercise);
    }
  }, [exercise]);


  const onChangeType = (exerciseIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newExercises = [...exercise];
    newExercises[exerciseIndex].exerciseType = e.target.value;
    setExercise(newExercises);
  };

  const onChangeSets = (exerciseIndex: number, setIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newExercises = [...exercise];
    newExercises[exerciseIndex].sets[setIndex] = { ...newExercises[exerciseIndex].sets[setIndex], [name]: value };
    setExercise(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercise];
    newExercises[exerciseIndex].sets.push({ kg: "", count: "" });
    setExercise(newExercises);
  };

  const addExercise = () => {
    setExercise([...exercise]);
    navigate("/exercise-choice");
  };

  const onClick = async () => {
    if (exercise.every(exercise => exercise.exerciseType !== '' && exercise.sets.every(set => set.count))) {
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

        const exercisePromises = exercise.map((exercise) => {
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
    const newExercises = [...exercise];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercise(newExercises);
  };

  const exerciseDelete = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const newExercises = exercise.filter((_, i) => i !== index);
    setExercise(newExercises);
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
          <ExercisePlus onClick={addExercise}>+ 운동추가</ExercisePlus>
          {exercise.map((exercise, exerciseIndex) => (
            <ExerciseWrapper key={exerciseIndex}>
              <ExericseDelete onClick={(event) => exerciseDelete(exerciseIndex, event)}>
                <AiOutlineDelete />
              </ExericseDelete>
              <ExerciseNameWrapper>
                  <InputTitle
                    style={{ border: 'none', fontSize:'16px', fontWeight:'600', padding:'0' }}
                    onChange={(e) => {
                      onChangeType(exerciseIndex, e)
                    }}
                    value={exercise.exerciseType}
                    type="text"
                    name="exerciseType"
                    placeholder="운동 직접입력"
                  />
              </ExerciseNameWrapper>
              <ListSetButtonWrapper>
                <SetPlus onClick={() => addSet(exerciseIndex)}><span style={{ fontSize: '20px' }}>+ </span> 세트추가</SetPlus>
              </ListSetButtonWrapper>
              <SetList>
                {exercise.sets.map((set, setIndex) => (
                  <ListBody key={setIndex}>
                    <span>{setIndex + 1}. 세트</span>
                    <Input
                      type="number"
                      name="kg"
                      value={set.kg}
                      onChange={(e) => onChangeSets(exerciseIndex, setIndex, e)}
                      placeholder="kg"
                    />
                    <Input
                      type="number"
                      name="count"
                      value={set.count}
                      onChange={(e) => onChangeSets(exerciseIndex, setIndex, e)}
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