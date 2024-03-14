import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components"
import { auth, db } from "../firebase";
import DateChoice from "./date-picker";

const Wrapper = styled.div`
width:50%;
height: 50vh;
z-index:99;
position:fixed;
background-color:white;
top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border:1px solid gray;
display:flex;
flex-direction: column;
gap:10px;
`;
const Label = styled.label`
width:100%;
height:50px;
`;
const Input = styled.input`
height:30px;
`;
const Button = styled.div`
font-size:30px;
text-align:center;
font-weight:600;
background-color: blue;
`;
const CloseBtn = styled.div`
margin-left:90%;
margin-bottom:10px;
`;


interface ExerciseRegistrationProps {
    closeModal: () => void; // closeModal 함수의 타입을 명시적으로 선언
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

export default function ExerciseRegistration({ closeModal }: ExerciseRegistrationProps) {
    //const day = new Date()
    const user = auth.currentUser;
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // 선택한 날짜 상태 추가

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };
    const [exerciseType, setExerciseType] = useState("");
    const [count, setCount] = useState("");
    const [set, setSet] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "exerciseType") {
            setExerciseType(value);
        } else if (name === "count") {
            setCount(value);
        } else if (name === "set") {
            setSet(value);
        }
    }

    const onClick = async () => {
        if (exerciseType !== "" && count !== "" && set !== "") {
            try {
                await addDoc(collection(db, "records"), {
                    이름: user?.displayName,
                    종류: exerciseType,
                    횟수: count,
                    세트: set,
                    유저아이디: user?.uid,
                    날짜: formatDate(selectedDate!),
                });
                closeModal()
            } catch {

            }
        } else {
            alert("모두 입력해주세요.")
        }
    };
    const back = () => {
        closeModal()
    }

    return (
        <Wrapper>
            <CloseBtn onClick={back}>X</CloseBtn>
            <DateChoice onDateChange={handleDateChange} />
            <Label>운동종류: <Input onChange={onChange} value={exerciseType} type="text" name="exerciseType" /></Label>
            <Label>횟수: <Input onChange={onChange} value={count} type="number" name="count" />개</Label>
            <Label>세트: <Input onChange={onChange} value={set} type="number" name="set" />세트</Label>
            <Button onClick={onClick}>운동 기록</Button>
        </Wrapper>
    )
}