import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"
import { auth, db } from "../firebase";

const Wrapper = styled.div`

`
const Input = styled.input`

`;
const Title = styled.h1`

`;
const Form = styled.form`

`;
const InputBtn = styled.input`

`;
export default function Naming() {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();
    const user = auth.currentUser;
    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const { target: { name, value }, } = e;
        if (name === "nickname") {
            setNickname(value)
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            await addDoc(collection(db,"user"),{
                이름: user?.displayName,
                닉네임: nickname,
                유저아이디: user?.uid,
                날짜: Date.now()
            });
            navigate("/")
        }catch{

        }
    }

    return (
        <Wrapper>
            <Title>활동하실 닉네임을 정해주세요.</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} maxLength={8} type="text" name="nickname" value={nickname} placeholder="닉네임 설정" required></Input>
                <InputBtn type="submit" value={`완료`}></InputBtn>
            </Form>
        </Wrapper>
    )
}