import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styled from "styled-components";

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
    gap:100px;
`
const Logo = styled.img`
    height:30px;
    margin-left:10px;
`


export default function GithubButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider()
            provider.addScope('repo');
            await signInWithPopup(auth, provider)
            navigate("/")
        } catch (error) {
            console.error(error)
        }

    }
    return (
        <Button onClick={onClick}>
            <Logo src="/github-mark.png" />
            Github로 시작하기
        </Button>
    )
}