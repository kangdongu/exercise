import {  GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

const Button = styled.div`
    width :100%;
    background-color:white;
    font-weght:600;
    border:0;
    display:flex;
    align-items:center;
    color:black;
    margin-top: 20px;
    border-radius: 10px;
    padding:5px;
    cursor:pointer;
    height:50px;
    gap: 100px;
`
const Logo = styled.img`
    height:30px;
    margin-left:10px;
`

export default function GoogleButton() {
  const navigate = useNavigate();
  const onClick = async () => {
      try {
          const provider = new GoogleAuthProvider()
          await signInWithPopup(auth, provider)
          navigate("/")
      } catch (error) {
          console.error(error)
      }

  }
  return (
      <Button onClick={onClick}>
          <Logo src="/web_light_sq_na@1x.png" />
          <span>Google로 시작하기</span>
      </Button>
  )
}