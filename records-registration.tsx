import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import DateChoice from "./date-picker";

const Wrapper = styled.div`
  width: 50%;
  height: 60vh;
  overflow-y:scroll;
  z-index: 99;
  position: fixed;
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Label = styled.label`
  width: 100%;
  height: 50px;
`;
const Input = styled.input`
  height: 30px;
`;
const Button = styled.button` // 버튼 태그로 수정
  font-size: 30px;
  text-align: center;
  font-weight: 600;
  background-color: blue;
`;
const CloseBtn = styled.div`
  margin-left: 90%;
  margin-bottom: 10px;
`;
const SetList = styled.div``;
const ListHeader = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-around;
`;
const ListBody = styled.div`
  display: flex;
  justify-content: space-around;
`;
const SetPlus = styled.div`
cursor:pointer;
`;
const SetDelete = styled.div`
line-height:20px;
width:30px;
height:30px;
text-align:center;
font-size:35px;
color:red;
border:1px solid red;
border-radius:50%;
font-weight:900;
cursor:pointer;
`;
interface ExerciseRegistrationProps {
  closeModal: () => void;
}

// function formatDate(date: Date): string {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0");
//   const day = date.getDate().toString().padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }
function formatDateToISO(date: Date): string {
    return date.toISOString();
  }

export default function ExerciseRegistration({
  closeModal,
}: ExerciseRegistrationProps) {
  const user = auth.currentUser;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [exerciseType, setExerciseType] = useState("");
  const [sets, setSets] = useState<{ kg: string; count: string }[]>([
    { kg: "", count: "" },
  ]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const onChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newSets = [...sets]; // 새로운 배열 생성
    newSets[index] = { ...newSets[index], [name]: value }; // 해당 인덱스의 요소를 새로운 값으로 갱신
    setSets(newSets); // 상태 업데이트
  };

  const addSet = () => {
    setSets([...sets, { kg: "", count: "" }]);
  };

  const onClick = async () => {
    if (exerciseType !== "" && sets.every((set) => set.count)) {
      try {
        const recordsRef = collection(db, "records");
        // const date = formatDate(selectedDate!);
        const date = formatDateToISO(selectedDate!);
        const promises = sets.map((set) =>
          addDoc(recordsRef, {
            이름: user?.displayName,
            종류: exerciseType,
            횟수: set.count,
            무게: set.kg,
            유저아이디: user?.uid,
            날짜: date,
          })
        );
        await Promise.all(promises);
        closeModal();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      alert("운동종류와 횟수를 입력해주세요.");
    }
  };

  const back = () => {
    closeModal();
  };
  
  const onDelete = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault(); // 이벤트의 기본 동작을 막습니다
    const newSets = sets.filter((_, i) => i !== index); // 삭제할 세트를 걸러냅니다
    setSets(newSets); // 걸러진 배열로 세트 상태를 업데이트합니다
};

  return (
    <Wrapper>
      <CloseBtn onClick={back}>X</CloseBtn>
      <DateChoice onDateChange={handleDateChange} />
      <Label>
        운동종류:{" "}
        <Input
          onChange={(e) => setExerciseType(e.target.value)}
          value={exerciseType}
          type="text"
          name="exerciseType"
        />
      </Label>
      <SetList>
        <ListHeader>
          <li></li>
          <li>kg</li> <li>회</li>
        </ListHeader>
        {sets.map((set, index) => (
          <ListBody key={index}>
            {index + 1}.
            <Input
              onChange={(e) => onChange(index, e)}
              value={set.kg}
              type="number"
              name="kg"
            />
            <Input
              onChange={(e) => onChange(index, e)}
              value={set.count}
              type="number"
              name="count"
            />
            <SetDelete onClick={(event) => onDelete(index, event)}>-</SetDelete>
          </ListBody>
        ))}
      </SetList>
      <SetPlus onClick={addSet}>세트 추가</SetPlus>
      <Button onClick={onClick}>운동 기록</Button>
    </Wrapper>
  );
}