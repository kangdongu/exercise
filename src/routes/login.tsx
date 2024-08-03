import styled from "styled-components"
import GithubButton from "../components/github-login";
import GoogleButton from "../components/gogle-login";
// import { FaArrowRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
    height: 100vh;
    width:100vw;
   }
    width:412px;
    height:915px;
    margin:0 auto;
display: flex;
background-color:#f3f1f1;
flex-direction: column;
padding: 50px 0px;
    `;
const LoginButtonWrapper = styled.div`
    width:90%;
    margin: 0px auto;
    border-top: 0.2px solid #333333;
`;
const Title = styled.div`
    font-size: 70px;
    color:#990033;
    font-weight:800;
    width:100%;
    line-height:150px;
    text-align:center;
    margin:5vh auto;
    margin-bottom:10px;
`;
const TextWrapper = styled.div`
    width:100%;
    font-size:23px;
    font-weight:800;
`;
const ContentWrapper = styled.div`
@media screen and (max-width: 700px) {
    width:90vw;
   }
    width:412px;
    padding: 0px 5px;
    margin: 0 auto;
    margin-bottom : 20px;
`;
const Size = styled.div`
@media screen and (max-width: 700px) {
       width:100%;
   }
    position:absolute;
    bottom:50px;
    text-align:center;
    width:412px;
`;
// const Interviewer = styled.div`
//     width:90%;
//     height:50px;
//     background-color:white;
//     display: flex;
//     align-items: center;
//     justify-content: space-around;
//     margin: 0 auto;
//     border-radius:10px;
// `;


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
    // const navigate = useNavigate()

    // const createAccount = () => {
    //     navigate("/create-account")
    // }

    return (
        <Wrapper>
            <ContentWrapper>
                <TextWrapper>
                    간편하게 로그인하여<br /> 운동습관 만들기를 시작해보세요
                </TextWrapper>
                <Title>Habit</Title>
                <LoginButtonWrapper>
                    <GithubButton />
                    <GoogleButton />
                </LoginButtonWrapper>
            </ContentWrapper>
            {/* <Interviewer onClick={createAccount}>
                <span>면접관님 전용 로그인</span> 
                <FaArrowRight />
            </Interviewer> */}
            <Size>현재 개발자모드 Samsung Galaxy S20 Ultra에<br />최적화 되어 있습니다.</Size>
        </Wrapper>
    )
}