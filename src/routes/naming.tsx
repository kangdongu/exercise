import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
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
  padding: 10px;
  font-size:16px;
  width: 300px;
  border-radius:5px;
`;

const Title = styled.h1`
  margin-bottom: 60px;
  margin-top:0;
  font-size:25px;
  text-align:center;
  span{
    font-size:14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputBtn = styled.input`
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color:#FC286E;
  color:white;
  border-radius:10px;
  width:100%;
  margin-top:30px;
  border:none;
`;

const ValidationMessage = styled.div<{ isValid: boolean | null }>`
  color: ${({ isValid }) => (isValid === null ? "black" : isValid ? "green" : "red")};
  margin-top:5px;
  font-size:14px;
`;

export default function Naming() {
  const [nickname, setNickname] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [doubleCheck, setDoubleCheck] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const validateNickname = (nickname: string): string => {
    if (nickname.length < 2) return "닉네임이 너무 짧습니다. 최소 2자 이상 입력해주세요.";
    if (nickname.length > 10) return "닉네임이 너무 깁니다. 최대 10자 이하로 입력해주세요.";
    if (/[^a-zA-Z0-9가-힣]/.test(nickname)) return "닉네임에 금지된 문자가 포함되어 있습니다.";
    if (/\s/.test(nickname)) return "닉네임에 공백이 포함될 수 없습니다.";
    return "";
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    if (name === "nickname") {
      setNickname(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationMessage = validateNickname(nickname);
    if (validationMessage) {
      setIsNicknameAvailable(false);
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setDoubleCheck(true);

      const userRef = collection(db, "user");
      const q = query(userRef, where("닉네임", "==", nickname));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsNicknameAvailable(false);
        setErrorMessage("이미 사용 중인 닉네임입니다.");
        setDoubleCheck(false);
        return;
      }

      setIsNicknameAvailable(true);

      await addDoc(collection(db, "user"), {
        이름: user?.displayName,
        닉네임: nickname,
        유저아이디: user?.uid,
        날짜: Date.now(),
        프로필안내: false,
        개인챌린지가이드: false,
        프로필사진: "",
        그룹챌린지가이드: false,
        개인챌린지생성: 0,
        개인챌린지완료: 0,
        장기챌린지종료: 0,
        운동일수: 0,
        캐릭터: "",
        오늘운동: false,
        단계: "1단계",
        마지막운동: "",
        선택단계:'1단계',
        선택뱃지:[],
      });

      navigate("/gender");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setDoubleCheck(false);
    }
  };

  return (
    <Wrapper>
      <Title>
        활동하실 닉네임을 설정해주세요<br />
        <span>(2자에서 10자 사이의 문자로 설정할 수 있습니다.)</span>
      </Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          maxLength={10}
          type="text"
          name="nickname"
          value={nickname}
          placeholder="닉네임 설정"
          required
        />
        <ValidationMessage isValid={isNicknameAvailable}>
          {isNicknameAvailable === null
            ? "닉네임을 입력해주세요."
            : isNicknameAvailable
              ? "사용 가능한 닉네임입니다."
              : errorMessage}
        </ValidationMessage>
        <InputBtn type="submit" value={doubleCheck ? "확인 중..." : "완료"} disabled={doubleCheck} />
      </Form>
    </Wrapper>
  );
}
