import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import styled from "styled-components"
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GrUserManager } from "react-icons/gr";
import { GrUserFemale } from "react-icons/gr";


const Wrapper = styled.div`
    width:100vw;
    height:100vh;

    `;
const Button = styled.div<{ selected: boolean }>`
    background-color:#f3f1f1;
    width:150px;
    height:150px;
    border-radius:50%;
    text-align:center;
    border:${props => props.selected ? "3px solid #990033" : null}
    `;
const Title = styled.h1`
    text-align:center;
    margin-top:50px;
    `;
const ChoiceWrapper = styled.div`
  width:100vw;
  height:300px;
  display:flex;
  justify-content: space-around;
  margin-top:100px;
`;
const CompleteButton = styled.div`
  width:80vw;
  height:50px;
  margin: 0 auto;
  background-color:#990033;
  color:white; 
  text-align:center;
  font-size:25px;
  line-height:50px;
`;

export default function GenderChoice() {
  const navigate = useNavigate()
  const [selectedGender,setSelectedGender] = useState("")
  const user = auth.currentUser;


  useEffect(() => {
    const fetchLoad = async () => {

      const userDocRef = collection(db, "user");
      const querySnapshot = await getDocs(query(userDocRef, where("유저아이디", "==", user?.uid)));

      if (querySnapshot.empty) {
        navigate("/naming")
      }
    }
    fetchLoad();
  }, [])

  const choiceClick = async () => {
    try {

      const userNamingRef = collection(db, "user");

      const userDocRef = collection(db, "user");
      const querySnapshot = await getDocs(query(userDocRef, where("유저아이디", "==", user?.uid)));

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(existingDoc.ref, { 성별: selectedGender });
      } else {
        await addDoc(userNamingRef, {
          이름: user?.displayName,
          성별: selectedGender,
          유저아이디: user?.uid,
          날짜: Date.now(),
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error updating gender:", error);
    }
  };


  return (
    <Wrapper>
      <Title>성별을 선택해주세요.</Title>
      <ChoiceWrapper>
        <Button selected={selectedGender === '남자'} onClick={() => setSelectedGender('남자')}>
          <GrUserManager style={{width:"100px", height:"100px", color:selectedGender === "남자" ? "#990033" :"gray", marginTop:"25px"}} />
          <h3>남자</h3>
        </Button>
        <Button selected={selectedGender === '여자'} onClick={() => setSelectedGender('여자')}>
          <GrUserFemale style={{width:"100px", height:"100px", color:selectedGender === "여자" ? "#990033" :"gray", marginTop:"25px"}} />
          <h3>여자</h3>
        </Button>
      </ChoiceWrapper>
      <CompleteButton onClick={choiceClick}>선택완료</CompleteButton>
    </Wrapper>
  )
}