import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components"
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
display:flex;
flex-direction: column;
align-items: center;
`;
const Label = styled.label`

`;
const Input = styled.input`

`;
const Button = styled.div`
font-size:30px;
text-align:center;
font-weight:600;
background-color: blue;
`;



export default function ExerciseRegistration() {
    const day = new Date()
    const user = auth.currentUser;
    const navigate = useNavigate();
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
                    날짜: `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${day.getDate()}`
                });
                navigate("/records")
            } catch {

            }
        }else{
            alert("모두 입력해주세요.")
        }
    };

    return (
        <Wrapper>
            <Label>운동종류: <Input onChange={onChange} value={exerciseType} type="text" name="exerciseType" /></Label>
            <Label>횟수: <Input onChange={onChange} value={count} type="number" name="count" />개</Label>
            <Label>세트: <Input onChange={onChange} value={set} type="number" name="set" />세트</Label>
            <Button onClick={onClick}>운동 기록</Button>
        </Wrapper>
    )
}