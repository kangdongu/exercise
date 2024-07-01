import { useEffect, useState } from "react";
import styled from "styled-components"
import DateChoiceFuture from "../date-pick";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { format } from "date-fns";
import { getDownloadURL, ref } from "firebase/storage";
import { useChallenges } from "./group-context";


const Wrapper = styled.div`
    width:100vw;
    height:97vh;
    position:fixed;
    background-color:white;
    left:0;
    top:0;
    padding-left:10px;
    box-sizing:border-box;
    overflow:hidden;
    overflow-y:scroll;
`;

const Back = styled.div`
width: 20px;
  height: 20px;
  margin:10px;
`;
const TitleWrapper = styled.div`

`;
const TitleTitle = styled.h4`

`;
const Title = styled.input`
    font-size:16px;
    width:95%;
    height:40px;
    border-radius:5px;
`;
const ContentWrapper = styled.div`

`;
const ContentTitle = styled.h4`

`;
const ContentText = styled.textarea`
    height:70px;
    width:95%;
    font-size:16px;
    border-radius:10px;
    padding-top: 5px;
    box-sizing: border-box;
    padding-left:5px;
`;
const WeekWrapper = styled.div`
margin-bottom:20px;
`;
const WeekListWrapper = styled.div`
    width:120%;
    margin-bottom: 20px;
    display: flex;
    margin-top: 5px;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 5px; 
`;
const WeekTitle = styled.h4`

`;
const WeekList = styled.span<{ selected: boolean }>`
    padding:2px 7px;
    border-radius:10px;
    border: ${props => props.selected ? 'none' : '0.5px solid gray'};
    text-align:center;
    line-height:25px;
    background-color: ${props => props.selected ? '#FF3232' : 'white'};
    color:${props => props.selected ? 'white' : 'black'}
`;
const DaysChoiceWrapper = styled.div`

`;
const DaysChoiceTitle = styled.h4`
    span{
        font-weight:500;
        font-size:14px;
    }
`;
const DaysChoiceListWrapper = styled.div`
    display:flex;
    gap:10px;
`;
const DaysChoiceList = styled.span<{ selected: boolean }>`
  padding: 5px 8px;
  border: ${(props) => (props.selected ? "none" : "0.5px solid gray")};
  border-radius: 10px;
  background-color: ${(props) => (props.selected ? "#FF3232" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
`;
const DateChoiceWrapper = styled.div`

`;
const DateChoiceTitle = styled.h4`

`;
const SecretWrapper = styled.div`

`;
const SecretTitle = styled.h4`

`;
const SecretCheckWrapper = styled.div`

`;
const SecretCheckBox = styled.div`
    width:70px;
    height:25px;
    position:relative;
    border-radius:50px;
`;
const SecretCheckMove = styled.div`
    width:25px;
    height:25px;
    position:absolute;
    border-radius:50%;
    background-color:white;
    border:0.5px solid gray;
`;
const SecretCheck = styled.div`
    display:flex;
    gap:10px;
`;
const PassWordWrapper = styled.div`
    display:flex;
    gap:10px;
    height: 40px;
    width: 100%;
    line-height:40px;
    margin-top:10px;
`;
const PassWordSetting = styled.div`
    width:185px;
    height:35px;
`;
const PassWordInput = styled.input`
    width:185px;
    height:30px;
    margin-top: 5px;
    border-radius:5px;
`;
const PeopleCompleteWrapper = styled.div`
    display:flex;
    margin-top:20px;
    justify-content: space-around;
`;
const CompleteButton = styled.div`
    width:100px;
    height:50px;
    background-color:#ff0000;
    text-align:center;
    line-height:50px;
    color:white;
    border-radius:15px;
`;
const PasswordReWrapper = styled.div`
      display:flex;
    gap:10px;
    height: 40px;
    width: 100%;
    line-height:40px;
    margin-top:10px;
`;
const People = styled.div`
 width:100px;
    height:50px;
    background-color:lightgray;
    text-align:center;
    line-height:50px;
    color:white;
    border-radius:15px;
`;

interface CreateProps {
    onBack: () => void
}
const GroupCreate: React.FC<CreateProps> = ({ onBack }) => {
    const { setChallenges } = useChallenges();
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());
    const [secretCheckToggle, setSecretCheckToggle] = useState(false)
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [manualSelectedWeek, setManualSelectedWeek] = useState("1일");
    const [title, setTitle] = useState("")
    const [contentText, setContentText] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [userProfileUrl, setUserProfileUrl] = useState("")
    const [nickname, setNickname] = useState("")
    const currentUser = auth.currentUser

   

    const TitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "title") {
            setTitle(value)
        }
    }

    const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "content_text") {
            setContentText(value)
        }
    }

    const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "password") {
            setPassword(value)
        }
    }

    const rePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "re_password") {
            setRePassword(value)
        }
    }

    const EndDateChange = (date: Date | null) => {
        setSelectedEndDate(date);
    };

    const SecretCheckClick = () => {
        setSecretCheckToggle((e) => !e)
    }


    const calculateSelectedWeek = () => {
        if (selectedDays.includes("상관없음")) {
            return manualSelectedWeek;
        }
        return `${selectedDays.length}`;
    };

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            const currentUser = auth.currentUser
            try {
                if (currentUser) {
                    const storageRef = ref(storage, `avatars/${currentUser.uid}`);

                    const userProfileUrl = await getDownloadURL(storageRef);
                    setUserProfileUrl(userProfileUrl);
                }
            } catch (error) {
                console.error("유저 프로필을 찾지 못했습니다:", error);
            }
        };

        fetchUserProfilePic();
    }, []);

    const handleDayClick = (day: string) => {
        let updatedDays;
        updatedDays = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];

        setSelectedDays(updatedDays);
    };

    useEffect(() => {
        const daysOrder = ["월", "화", "수", "목", "금", "토", "일"];
        setSelectedDays((prevSelectedDays) =>
            [...prevSelectedDays].sort(
                (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
            )
        );
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (currentUser) {
                    const currentUserUID = currentUser.uid;
                    const usersCollectionRef = collection(db, "user");
                    const querySnapshot = await getDocs(
                        query(usersCollectionRef, where("유저아이디", "==", currentUserUID))
                    );
                    if (!querySnapshot.empty) {
                        const userNickname = querySnapshot.docs[0].data().닉네임;
                        setNickname(userNickname);
                    } else {
                        console.error("사용자 문서가 존재하지 않습니다.");
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [currentUser]);

    const createRoom = async () => {
        if (password === rePassword && title !== "" && contentText !== "") {
            const user = auth.currentUser;
            const recordsRef = collection(db, "groupchallengeroom");
            const startDate = new Date();
            const endDateFormat = selectedEndDate ? format(selectedEndDate, "yyyy-MM-dd") : "";

            const newChallenge = {
                유저아이디: [user?.uid],
                그룹챌린지제목: title,
                그룹챌린지내용: contentText,
                주에몇일: calculateSelectedWeek(),
                요일선택: selectedDays,
                비밀방여부: secretCheckToggle,
                시작날짜: format(startDate, "yyyy-MM-dd"),
                종료날짜: endDateFormat,
                방장아이디: user?.uid,
                비밀번호: rePassword,
                방장프로필: userProfileUrl,
                방장닉네임: nickname,
            };

            try {
                const docRef = await addDoc(recordsRef, newChallenge);
                setChallenges((prevChallenges) => [...prevChallenges, { id: docRef.id, ...newChallenge }]);
                alert("방이 생성되었습니다!");
                onBack();
            } catch (error) {
                console.error("방 생성 중 오류가 발생했습니다: ", error);
            }
        } else if (password !== rePassword) {
            alert("비밀번호가 다릅니다");
        }
    };
    
    return (
        <Wrapper>

            <Back onClick={onBack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </Back>
            <h3>챌린지 그룹방을 생성해주세요</h3>
            <TitleWrapper>
                <TitleTitle>챌린지 제목을 적어주세요</TitleTitle>
                <Title placeholder="챌린지 제목 입력" onChange={TitleChange} value={title} type="text" name="title" />
            </TitleWrapper>
            <ContentWrapper>
                <ContentTitle>챌린지 내용을 입력해주세요</ContentTitle>
                <ContentText placeholder="챌린지 내용 입력" onChange={contentChange} value={contentText} name="content_text" />
            </ContentWrapper>
            <WeekWrapper>
                <WeekTitle>주에 몇일</WeekTitle>
                <WeekListWrapper>
                    {["1", "2", "3", "4", "5", "6", "7"].map((week) => (
                        <WeekList
                            key={week}
                            selected={calculateSelectedWeek() === week}
                            onClick={() => selectedDays.includes("상관없음") && setManualSelectedWeek(week)}
                        >
                            {week}일
                        </WeekList>
                    ))}
                </WeekListWrapper>
            </WeekWrapper>
            <DaysChoiceWrapper>
                <DaysChoiceTitle>매주 진행할 요일을 선택해주세요<span> (복수선택가능)</span></DaysChoiceTitle>
                <DaysChoiceListWrapper>
                    {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                        <DaysChoiceList
                            key={day}
                            selected={selectedDays.includes(day)}
                            onClick={() => handleDayClick(day)}
                        >
                            {day}
                        </DaysChoiceList>
                    ))}
                </DaysChoiceListWrapper>
            </DaysChoiceWrapper>
            <DateChoiceWrapper>
                <DateChoiceTitle>종료기간설정</DateChoiceTitle>
                <DateChoiceFuture onDateChange={EndDateChange} /> 까지
            </DateChoiceWrapper>
            <SecretWrapper>
                <SecretTitle>비밀방 여부</SecretTitle>
                <SecretCheckWrapper>
                    <SecretCheck>비밀방 :
                        <SecretCheckBox style={{ backgroundColor: secretCheckToggle ? "green" : "lightgray" }} onClick={SecretCheckClick}>
                            <SecretCheckMove style={{ left: secretCheckToggle ? "45px" : "0px" }}></SecretCheckMove>
                        </SecretCheckBox>
                    </SecretCheck>
                    <PassWordWrapper>
                        비밀번호 입력 :
                        <PassWordSetting style={{ backgroundColor: secretCheckToggle ? "white" : "lightgray" }}>
                            <PassWordInput style={{ display: secretCheckToggle ? "block" : "none" }} onChange={passwordChange} value={password} type="password" name="password" />
                        </PassWordSetting>
                    </PassWordWrapper>
                    <PasswordReWrapper>
                        비밀번호 확인 :
                        <PassWordSetting style={{ backgroundColor: secretCheckToggle ? "white" : "lightgray" }}>
                            <PassWordInput style={{ display: secretCheckToggle ? "block" : "none" }} onChange={rePasswordChange} value={rePassword} type="password" name="re_password" />
                        </PassWordSetting>
                    </PasswordReWrapper>
                </SecretCheckWrapper>
            </SecretWrapper>
            <PeopleCompleteWrapper>
                <People>인원수 선택</People>
                <CompleteButton onClick={createRoom}>방 생성</CompleteButton>
            </PeopleCompleteWrapper>
        </Wrapper>
    )
}
export default GroupCreate