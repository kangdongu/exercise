import styled from "styled-components"
import GithubButton from "../components/github-login";
import GoogleButton from "../components/gogle-login";

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
    margin:100px auto;
    margin-bottom:10px;
`;
const TextWrapper = styled.div`
    width:100%;
    height:100px;
    font-size:23px;
    font-weight:800;
`;
const ContentWrapper = styled.div`
    width:90%;
    margin: 0 auto;
`;
const Size = styled.div`
    position:absolute;
    bottom:50px;
    text-align:center;
    width:100%;
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
            <Size>현재 개발자모드 Samsung Galaxy S20 Ultra에<br />최적화 되어 있습니다.</Size>
        </Wrapper>
    )
}