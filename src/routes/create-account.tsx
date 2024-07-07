import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components"
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import GithubButton from "../components/github-login";
import GoogleButton from "../components/gogle-login";

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
    height: 100vh;
    width:100vw;
   }
height: 900px;
display: flex;
flex-direction: column;
align-items: center;
width: 412px;
margin: 0 auto;
padding: 50px 10px;
background-color:#f3f1f1;
`;
const Title = styled.h1`
font-size: 42px;
color:#990033;
`;
const CreateForm = styled.form`
margin-top: 50px;
margin-bottom : 10px;
display: flex;
flex-direction: column;
gap: 10px;
width: 100%;
`;
const CreateInput = styled.input`
padding: 10px 20px;
border-radius: 50px;
border: none;
width: 100%;
font-size: 16px;
&[type="submit"] {
cursor: pointer;
&:hover {
opacity: 0.8;
}
}
`;
const CreateButton = styled.input`
padding: 10px 20px;
border-radius: 50px;
border: none;
width: 100%;
background-color:#990033;
font-size: 16px;
&[type="submit"] {
cursor: pointer;
color:white;
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

export default function CreateAccount(){
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value }, } = e;
        if (name === "name") {
            setName(value)
        } else if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    const onSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || name === "" || email === "" || password === "") return;
        try {
            setLoading(true)
            const credentials = await createUserWithEmailAndPassword(auth, email, password)
            const user = credentials.user;
            console.log(credentials.user)
            if(user){
                await sendEmailVerification(user);
                await updateProfile(user, {
                    displayName: name,
                });
                navigate("/")
            }else{
                setError("회원가입 중 오류가 발생했습니다.");
            }
           
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
            <Title>Habit</Title>
            <CreateForm onSubmit={onSubmit}>
                <CreateInput onChange={onChange} name="name" value={name} placeholder="이름" type="text" required />
                <CreateInput onChange={onChange} name="email" value={email} placeholder="이메일" type="email" required />
                <CreateInput onChange={onChange} name="password" value={password} placeholder="비밀번호" type="password" required />
                <CreateButton type="submit" value={isLoading ? "로딩중..." : "계정생성"} />
            </CreateForm>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                계정이 있으신가요? <Link to="/login">로그인 &rarr;</Link>
            </Switcher>
            <GithubButton />
            <GoogleButton />
            <div style={{width:"90%", margin:"20px auto", textAlign:'center'}}>아무 이름과 이메일, 비밀번호를 입력하시면 로그인 가능합니다.</div>
        </Wrapper>
    )
}
