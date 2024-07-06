import { differenceInDays, parseISO } from "date-fns";
import styled from "styled-components"
import { CiLock } from "react-icons/ci";

const Wrapper = styled.div`
    width:100vw;
    height:100vh;
    background-color: rgba(0,0,0,0.5);
    position: fixed;
    top:0;
    left:0;
    z-index:99;
`;
const BackWrapper = styled.div`
    width:100vw;
    height:100vh
`;
const GlassesWrapper = styled.div`
    width:80vw;
    position:fixed;
    background-color:white;
    top:50%;
    left:50%;
    transform: translate(-50%,-60%);
    padding: 0px 7px;
    box-sizing: border-box
    z-index:100;
`;
const Back = styled.div`
width: 20px;
height: 20px;
margin:5px;
font-size:25px;
`;
const ManagerProfileWrapper = styled.div`
    width:100%;
    height:80px;
    margin-top:15px;
    display:flex;
    align-items:center;
    gap:15px;
    margin-bottom:20px;
`;
const PeopleSecret = styled.div`
    width:100%;
    display:flex;
    margin-top:10px;
`;
const Secret = styled.div`
`;
const People = styled.div`
    height:30px;
    margin-left:auto;
`;
const ChallengeContentWrapper = styled.div`
    margin-top:5px;
`;
const ChallengeTitle = styled.div`
    width:100%;
    height:40px;
    border:1px solid black;
    box-sizing:border-box;
    border-radius:5px;
    line-height:40px;
    padding:0px 5px;
`;
const ChallengeContent = styled.div`
    width:100%;
    height:100px;
    border:1px solid black;
    box-sizing:border-box;
    border-radius:5px;
    margin-top:10px;
    padding:0px 5px;
    overflow-y:scroll;
`;
const DateWrapper = styled.div`
     h4{
        margin-bottom:0px;
    }
`;
const DateEnd = styled.div`
    display:flex;
    justify-content: space-between;
`;
const WeekWrapper = styled.div`
    h4{
        margin-bottom:0px;
    }
`;
const Week = styled.div`
    
`;
const DaysWrapper = styled.div`
    margin-bottom:20px;
    h4{
        margin-bottom:0px;
    }
`;
const Day = styled.div`
   display:flex;
   gap:5px;
`;
const ProfileImgWrapper = styled.div`
    width:80px;
    height:80px;
    border-radius:50%;
    border: 0.3px solid gray;
`;
const ProfileImg = styled.img`
    width:100%;
    border-radius:50%;
`;
const ProfileNicknameWrapper = styled.div`
    font-size:20px;
    font-weight:600;
`;

interface Challenge {
    id: string;
    방장아이디: string;
    비밀방여부: boolean;
    그룹챌린지제목: string;
    그룹챌린지내용: string;
    주에몇일: string;
    시작날짜: string;
    종료날짜: string;
    요일선택: string[];
    유저아이디: string[];
    방장프로필:string;
    방장닉네임:string;
    인원수:number;
}
interface GlassesProps {
    onBack: () => void;
    challenge: Challenge;
}
const GroupGlasses: React.FC<GlassesProps> = ({ onBack, challenge }) => {

    return (
        <Wrapper>
            <BackWrapper onClick={onBack}></BackWrapper>
            <GlassesWrapper>
                <Back onClick={onBack}>
                    x
                </Back>
                <ManagerProfileWrapper>
                    <ProfileImgWrapper>
                        <ProfileImg src={challenge.방장프로필} />
                    </ProfileImgWrapper>
                    <ProfileNicknameWrapper>
                        {challenge.방장닉네임}
                    </ProfileNicknameWrapper>
                </ManagerProfileWrapper>
                <PeopleSecret>
                    {challenge.비밀방여부 ? (
                        <Secret>
                            <CiLock style={{ width: "20px", height: "20px", }} />
                        </Secret>) : null}
                    <People>인원수: {challenge.유저아이디.length}/{challenge.인원수}</People>
                </PeopleSecret>
                <ChallengeContentWrapper>
                    <ChallengeTitle>{challenge.그룹챌린지제목}</ChallengeTitle>
                    <ChallengeContent>{challenge.그룹챌린지내용}</ChallengeContent>
                </ChallengeContentWrapper>
                <DateWrapper>
                    <h4>챌린지 기간</h4>
                    <DateEnd>
                        <div>종료날짜: {challenge.종료날짜}</div>
                        <div>D-{differenceInDays(parseISO(challenge.종료날짜), new Date())}</div>
                    </DateEnd>
                </DateWrapper>
                <WeekWrapper>
                    <h4>주에 몇일</h4>
                    <Week>주 {challenge.주에몇일} 챌린지</Week>
                </WeekWrapper>
                <DaysWrapper>
                    <h4>진행 요일</h4>
                    <Day>
                        {challenge.요일선택.map((day, index) => (
                            <div key={index}>{day}</div>
                        ))}
                    </Day>
                </DaysWrapper>
            </GlassesWrapper>
        </Wrapper>
    )
}
export default GroupGlasses