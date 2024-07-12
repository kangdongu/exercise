import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, db } from "../firebase";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width:100vw;
  background-color: #f0f0f0;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  width: 300px;
`;

const Title = styled.h1`
  margin-bottom: 60px;
  margin-top:0;
  font-size:25px;
  text-align:center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputBtn = styled.input`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color:#990033;
  color:white;
  width:150px;
`;

export default function Naming() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    if (name === "nickname") {
      setNickname(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "user"), {
        이름: user?.displayName,
        닉네임: nickname,
        유저아이디: user?.uid,
        날짜: Date.now(),
        프로필안내:false,
        개인챌린지가이드:false,
        프로필사진:"",
        그룹챌린지가이드:false,
        개인챌린지생성:0,
        개인챌린지완료:0,
        장기챌린지종료:0,
      });
      navigate("/gender");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Wrapper>
      <Title>활동하실 닉네임을 설정해주세요.</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          maxLength={8}
          type="text"
          name="nickname"
          value={nickname}
          placeholder="닉네임 설정"
          required
        />
        <InputBtn type="submit" value="완료" />
      </Form>
    </Wrapper>
  );
}
