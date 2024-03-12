import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components"
import { auth } from "../firebase";
import GithubButton from "../components/github-login";
import GoogleButton from "../components/gogle-login";

const Wrapper = styled.div`
    height: 100%;
display: flex;
width:50%;
background-color:lightblue;
flex-direction: column;
align-items: center;
width: 420px;
padding: 50px 0px;
    `;
const Title = styled.h1`
    font-size: 42px;
    `;
const LoginForm = styled.form`
    margin-top: 50px;
margin-bottom : 10px;
display: flex;
flex-direction: column;
gap: 10px;
width: 90%;
    `;
const LoginInput = styled.input`
    padding: 10px 20px;
border-radius: 50px;
border: none;
width: 90%;
font-size: 16px;
&[type="submit"] {
cursor: pointer;
&:hover {
opacity: 0.8;
}
}
    `;
export const Error = styled.span`
font-weight: 600;
color: tomato;
`;
export const Switcher = styled.span`
    margin-top:20px;
    a{
        color:blue;
    }
`;

export default function Login() {

    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value }, } = e;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("");
        if (isLoading || email === "" || password === "") return;
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, email, password);
            if (!auth.currentUser?.emailVerified) throw setError("Not verified.");
            navigate("/")
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message)
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Wrapper>
            <Title>로그인</Title>
            <LoginForm onSubmit={onSubmit}>
                <LoginInput onChange={onChange} name="email" value={email} placeholder="이메일" type="email" required />
                <LoginInput onChange={onChange} name="password" value={password} placeholder="비밀번호" type="password" required />
                <LoginInput onChange={onChange} type="submit" value={isLoading ? "Loading..." : "로그인"}/>
            </LoginForm>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                계정이없으신가요? <Link to="/create-account">회원가입 &rarr;</Link>
            </Switcher>
            <GithubButton />
            <GoogleButton />
        </Wrapper>
    )
}