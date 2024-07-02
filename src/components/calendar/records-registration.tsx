import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import DateChoice from "../date-picker";
import { format } from 'date-fns';
import MoSlideModal from "../slideModal/mo-slide-modal";
import BottomSheet from "../bottomSheet/bottom-sheet-component";

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
  position:relative;
  background-color:white;
}
  width:100%;
  height:100vh;
  background-color:rgba(0, 0, 0, 0.5);
  position:fixed;
  top:0;
  left:0;
  z-index:98;
`;
const RecordsWrapper = styled.div`
@media screen and (max-width: 700px) {
  position:relative;
  width:100%;
  top:0;
  left:0;
  transform:translate(0px,0px);
}
width: 50%;
height: 70vh;
overflow-y:scroll;
z-index: 99;
position: fixed;
background-color: white;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
padding:2%;
box-sizing:border-box;
`;
const Label = styled.label`
  width: 100%;
  height: 50px;
  margin-top: 20px;
`;
const Input = styled.input`
  width:100px;
  height: 30px;
  padding: 0;
  margin-top: 10px;
  border-radius:5px;
`;
const Button = styled.button`
width:90%;
margin: 0 auto;
  font-size: 30px;
  text-align: center;
  background-color: #FF3232;
  color:white;
  border-radius:10px;
      position: absolute;
    bottom: 10px;
`;
const CloseBtn = styled.div`
  margin-bottom: 10px;
  cursor:pointer;
`;
const SetList = styled.div``;
const ListBody = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    height: 50px;
    line-height: 50px;
`;
const SetPlus = styled.div`
@media screen and (max-width: 700px) {
  margin-left:65%;
}
width:120px;
height:30px;
text-align:center;
border-radius:5px;
color:#5882FA;
line-height:30px;
cursor:pointer;
color:white;
background-color:#5882FA;
margin-left:80%;
margin-bottom:20px;
span{
  font-size:23px;
  font-weight:600;
  margin-left:10px;
}
`;
const SetDelete = styled.div`
width:30px;
height:30px;
text-align:center;
font-size:35px;
color:red;
border:1px solid red;
border-radius:50%;
font-weight:900;
cursor:pointer;
margin-top:10px;
line-height:18px;
`;
const ExerciseDataBtn = styled.div`
@media screen and (max-width: 700px) {
  margin-left:65%;
}
  width:120px;
  height:30px;
  cursor:pointer;
  line-height:30px;
  border-radius:5px;
  color:white;
  background-color:#55a38d;
  margin-bottom:10px;
  text-align:center;
  margin-left:80%;
  span{
    font-size:23px;
    font-weight:600;
    margin-left:10px;
  }
`;
const ExerciseChoiceModal = styled.div`
@media screen and (max-width: 700px) {
  position:relative;
  width:100vw;
  height:90vh;
  top:0;
  left:0;
  transform: translate(0px,0px);
}
  width:70%;
  height:80vh;
  overflow-y:scroll;
  background-color:white;
  position:fixed;
  z-index:100;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
`;
const TypeWrapper = styled.ul`
@media screen and (max-width: 700px) {
  width:100%;
  height:20px;
  gap:5px;
  padding:0px;
}
  width:80%;
  height:20px;
  display:flex;
  list-style: none;
  gap:15px;
`;
const TypeMenu = styled.li<{ selected: boolean }>`
width:70px;
  height:20px;
  font-size:13px;
  font-weight:600;
  border:1px solid gray;
  text-align:center;
  border-radius:30px;
  cursor: pointer;
  background-color: ${(props) => props.selected ? "#ff0000" : "transparent"};
  color: ${(props) => props.selected ? "white" : "black"};
`;
const AreaMenu = styled.li<{ selected: boolean }>`
width:70px;
  height:20px;
  font-size:13px;
  font-weight:600;
  border:1px solid gray;
  text-align:center;
  border-radius:30px;
  cursor: pointer;
  background-color: ${(props) => props.selected ? "#ff0000" : "transparent"};
  color: ${(props) => props.selected ? "white" : "black"};
`;
const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width:94%;
margin:0 auto;
`;

const ExerciseItem = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor:pointer;
`;
const DateChoiceWrapper = styled.div`
  margin-top:20px;
`;
const ExerciseNameWrapper = styled.div`
  width:100%;
  height:50px;
  margin-top:20px;
`;

interface Exercise {
  name: string;
  type: string;
  area: string;
}

interface ExerciseRegistrationProps {
  closeModal: () => void;
}

export default function ExerciseRegistration({
  closeModal,
}: ExerciseRegistrationProps) {
  const user = auth.currentUser;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseData, setExerciseData] = useState<Exercise[]>([]);
  const [exerciseModal, setExerciseModal] = useState(false)
  const [areaDb, setAreaDb] = useState("");
  const [sets, setSets] = useState<{ kg: string; count: string }[]>([
    { kg: "", count: "" },
  ]);
  const [selectedType, setSelectedType] = useState<string>("전체");
  const [selectedArea, setSelectedArea] = useState<String>("전체");
  const [bottomSheetOpen] = useState(false);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const fetchExerciseData = async () => {
    try {
      const exerciseDataSnapshot = await getDocs(collection(db, "exercises"));
      const exercises: Exercise[] = [];
      exerciseDataSnapshot.forEach((doc) => {
        const data = doc.data();
        exercises.push({
          name: data.운동이름,
          type: data.카테고리,
          area: data.운동부위,
        });
      });

      setExerciseData(exercises);
    } catch (error) {
      console.error("Error fetching exercise data: ", error);
    }
  };

  const onChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [name]: value };
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, { kg: "", count: "" }]);
  };

  const onClick = async () => {
    if (exerciseType !== '' && sets.every((set) => set.count)) {
      try {
        const recordsRef = collection(db, 'records');
        const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
        const promises = sets.map((set) =>
          addDoc(recordsRef, {
            이름: user?.displayName,
            종류: exerciseType,
            횟수: set.count,
            무게: set.kg,
            유저아이디: user?.uid,
            운동부위: areaDb,
            날짜: date,
          })
        );
        await Promise.all(promises);
        closeModal();
      } catch (error) {
        console.error('문서 추가 오류: ', error);
      }
    } else {
      alert('운동종류와 횟수를 입력해주세요.');
    }
  };

  const back = () => {
    closeModal();
  };

  const onDelete = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const ExerciseChoice = () => {
    setExerciseModal(true)
  }
  const ExeerciseChoiceClose = () => {
    setExerciseModal(false);
  };

  return (
    <Wrapper>
      {window.innerWidth <= 700 ? (<BottomSheet open={bottomSheetOpen} onClose={closeModal}>
        <RecordsWrapper>
          <CloseBtn onClick={back}>X</CloseBtn>
          <DateChoiceWrapper>
            <DateChoice onDateChange={handleDateChange} />
          </DateChoiceWrapper>
          <ExerciseNameWrapper>
            <Label>
              운동종류:{" "}
              <Input
                onChange={(e) => setExerciseType(e.target.value)}
                value={exerciseType}
                type="text"
                name="exerciseType"
                placeholder="운동 직접입력"
              />
            </Label>
          </ExerciseNameWrapper>
          <ExerciseDataBtn onClick={ExerciseChoice}>운동선택<span>&gt;</span></ExerciseDataBtn>
          <SetPlus onClick={addSet}>세트추가<span>+</span></SetPlus>
          <SetList>
            {sets.map((set, index) => (
              <ListBody key={index}>
                {index + 1}.세트
                <Input
                  onChange={(e) => onChange(index, e)}
                  value={set.kg}
                  type="number"
                  name="kg"
                />kg
                <Input
                  onChange={(e) => onChange(index, e)}
                  value={set.count}
                  type="number"
                  name="count"
                />회/ 분
                <SetDelete onClick={(event) => onDelete(index, event)}>-</SetDelete>
              </ListBody>
            ))}
          </SetList>
          <Button onClick={onClick}>운동 완료</Button>
        </RecordsWrapper>
      </BottomSheet>) : null}
      {window.innerWidth >= 700 ? (<RecordsWrapper>
        <CloseBtn onClick={back}>X</CloseBtn>
        <DateChoice onDateChange={handleDateChange} />
        <Label>
          운동종류:{" "}
          <Input
            onChange={(e) => setExerciseType(e.target.value)}
            value={exerciseType}
            type="text"
            name="exerciseType"
            placeholder="운동 직접입력"
          />
        </Label>
        <ExerciseDataBtn onClick={ExerciseChoice}>운동선택<span>&gt;</span></ExerciseDataBtn>
        <SetPlus onClick={addSet}>세트추가<span>+</span></SetPlus>
        <SetList>
          {sets.map((set, index) => (
            <ListBody key={index}>
              {index + 1}.세트
              <Input
                onChange={(e) => onChange(index, e)}
                value={set.kg}
                type="number"
                name="kg"
              />kg
              <Input
                onChange={(e) => onChange(index, e)}
                value={set.count}
                type="number"
                name="count"
              />회/ 분
              <SetDelete onClick={(event) => onDelete(index, event)}>-</SetDelete>
            </ListBody>
          ))}
        </SetList>
        <Button onClick={onClick}>운동 완료</Button>
      </RecordsWrapper>) : null}
      {exerciseModal && window.innerWidth <= 700 ? <MoSlideModal onClose={() => setExerciseModal(false)}>
        <ExerciseChoiceModal>
          <TypeWrapper>
            <TypeMenu onClick={() => setSelectedType("전체")}
              selected={selectedType === "전체"}>전체</TypeMenu>
            <TypeMenu onClick={() => setSelectedType("맨몸운동")}
              selected={selectedType === "맨몸운동"}>맨몸운동</TypeMenu>
            <TypeMenu onClick={() => setSelectedType("헬스")}
              selected={selectedType === "헬스"}>헬스</TypeMenu>
            <TypeMenu onClick={() => setSelectedType("수영")}
              selected={selectedType === "수영"}>수영</TypeMenu>
          </TypeWrapper>
          <TypeWrapper>
            <AreaMenu onClick={() => setSelectedArea("전체")}
              selected={selectedArea === "전체"}>전체</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("가슴")}
              selected={selectedArea === "가슴"}>가슴</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("등")}
              selected={selectedArea === "등"}>등</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("하체")}
              selected={selectedArea === "하체"}>하체</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("삼두")}
              selected={selectedArea === "삼두"}>삼두</AreaMenu>
            <AreaMenu onClick={() => setSelectedArea("어깨")}
              selected={selectedArea === "어깨"}>어깨</AreaMenu>
          </TypeWrapper>
          <ExerciseList>
            {exerciseData
              .filter(
                (exercise) =>
                  (selectedType === "전체" || exercise.type === selectedType) &&
                  (selectedArea === "전체" || exercise.area === selectedArea)
              )
              .map((exercise, index) => (
                <ExerciseItem key={index} onClick={() => { setExerciseType(exercise.name); setAreaDb(exercise.area); setExerciseModal(false); }}>
                  <div>운동이름: {exercise.name}</div>
                  <div>운동종류: {exercise.type}</div>
                  <div>운동부위: {exercise.area}</div>
                </ExerciseItem>
              ))}
          </ExerciseList>
        </ExerciseChoiceModal>
      </MoSlideModal> : null}

      {exerciseModal && window.innerWidth >= 700 ? <ExerciseChoiceModal>
        <button onClick={ExeerciseChoiceClose}>닫기</button>
        <TypeWrapper>
          <TypeMenu onClick={() => setSelectedType("전체")}
            selected={selectedType === "전체"}>전체</TypeMenu>
          <TypeMenu onClick={() => setSelectedType("맨몸운동")}
            selected={selectedType === "맨몸운동"}>맨몸운동</TypeMenu>
          <TypeMenu onClick={() => setSelectedType("헬스")}
            selected={selectedType === "헬스"}>헬스</TypeMenu>
          <TypeMenu onClick={() => setSelectedType("수영")}
            selected={selectedType === "수영"}>수영</TypeMenu>
        </TypeWrapper>
        <TypeWrapper>
          <AreaMenu onClick={() => setSelectedArea("전체")}
            selected={selectedArea === "전체"}>전체</AreaMenu>
          <AreaMenu onClick={() => setSelectedArea("가슴")}
            selected={selectedArea === "가슴"}>가슴</AreaMenu>
          <AreaMenu onClick={() => setSelectedArea("등")}
            selected={selectedArea === "등"}>등</AreaMenu>
          <AreaMenu onClick={() => setSelectedArea("하체")}
            selected={selectedArea === "하체"}>하체</AreaMenu>
          <AreaMenu onClick={() => setSelectedArea("삼두")}
            selected={selectedArea === "삼두"}>삼두</AreaMenu>
          <AreaMenu onClick={() => setSelectedArea("어깨")}
            selected={selectedArea === "어깨"}>어깨</AreaMenu>
        </TypeWrapper>
        <ExerciseList>
          {exerciseData
            .filter(
              (exercise) =>
                (selectedType === "전체" || exercise.type === selectedType) &&
                (selectedArea === "전체" || exercise.area === selectedArea)
            )
            .map((exercise, index) => (
              <ExerciseItem key={index} onClick={() => { setExerciseType(exercise.name); setAreaDb(exercise.area); setExerciseModal(false); }}>
                <div>운동이름: {exercise.name}</div>
                <div>운동종류: {exercise.type}</div>
                <div>운동부위: {exercise.area}</div>
              </ExerciseItem>
            ))}
        </ExerciseList>
      </ExerciseChoiceModal> : null}
    </Wrapper>
  );
}