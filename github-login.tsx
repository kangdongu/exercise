import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styled from "styled-components";

const Button = styled.span`
    width :100%;
    background-color:white;
    font-weght:600;
    border:0;
    display:flex;
    gap:5px;
    align-items:center;
    justify-content:center;
    color:black;
    margin-top: 20px;
    border-radius: 30px;
    padding:5px;
    cursor:pointer;
`
const Logo = styled.img`
    height:25px;
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
            Continue with Github
        </Button>
    )
}