import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import styled from "styled-components"
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Wrapper = styled.div`
    display:flex;
    justify-content:center;
    `;
    const Button = styled.div`
    background-color:blue;
    width:50%;
    `;
    const Title = styled.h1`
    
    `;

export default function GenderChoice (){
    const navigate = useNavigate()
    const user= auth.currentUser;

    useEffect(()=>{
      const fetchLoad = async () =>{

      const userDocRef = collection(db, "user");
      const querySnapshot = await getDocs(query(userDocRef, where("유저아이디", "==", user?.uid)));

      if (querySnapshot.empty) {
        navigate("/naming")
      }
    }
    fetchLoad();
    },[])
    
    const onClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        try {
          const target = event.target as HTMLDivElement;
    
          // 이름을 정한 페이지에서 추가한 데이터베이스 참조
          const userNamingRef = collection(db, "user");
    
          // 해당 사용자의 UID를 기반으로 이미 존재하는 문서 확인
          const userDocRef = collection(db, "user");
          const querySnapshot = await getDocs(query(userDocRef, where("유저아이디", "==", user?.uid)));
    
          if (!querySnapshot.empty) {
            // 이미 존재하는 문서가 있다면 성별 필드를 업데이트
            const existingDoc = querySnapshot.docs[0];
            await updateDoc(existingDoc.ref, { 성별: target.innerText });
          } else {
            // 존재하지 않는다면 새로운 문서 추가
            await addDoc(userNamingRef, {
              이름: user?.displayName,
              성별: target.innerText,
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
            <Button onClick={onClick}>남자</Button>
            <Button onClick={onClick}>여자</Button>
        </Wrapper>
    )
}