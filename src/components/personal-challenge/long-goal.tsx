import styled from "styled-components"
import { useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, doc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { format } from "date-fns";
import DateChoiceFuture from "../date-pick";
import AchievementModal from "../achievement-alert";

const Wrapper = styled.div`
    width: 100%;
    height: 72.5vh;
    overflow-y:scroll;
`;
const Title = styled.input`
    width:250px;
    height:35px;
    box-sizing:border-box;
    margin-top:9px;
    border-radius:5px;
`;
const DateWrapper = styled.div`
    margin-bottom:25px;
`;
const DateTitle = styled.h4`
    margin-bottom:10px;
`;
const WeekWrapper = styled.div`
margin-bottom:20px;
`;
const WeekListWrapper = styled.div`
margin-bottom:20px;
display: flex;
gap:0.3%;
margin-top:5px;
width:98%;
`;
const WeekTitle = styled.h4`
    margin-bottom:10px;
`;
const WeekList = styled.div<{ selected: boolean }>`
    padding:3px 0px;
     width:14.0285714%;
    border-radius:10px;
    border: ${props => props.selected ? 'none' : '1px solid black'};
    text-align:center;
    line-height:25px;
    background-color: ${props => props.selected ? '#FF3232' : 'white'};
    color:${props => props.selected ? 'white' : 'black'}
`;
const GoalsTitle = styled.h5`
    font-weight:600;
    font-size:16px;
    margin-top:40px;
    margin-bottom:0px;
`;
const GoalPlus = styled.div`
     margin-top:10px;
    width:130px;
    height:30px;
`;
const QuickWrapper = styled.div`
    margin-bottom:15px;
        display: flex;
        width:98%;
    gap: 2%;
`;
const QuickList = styled.div`
    cursor: pointer;
    padding:3px 0px;
    width: 23.5%;
    border: 1px solid black;
    font-size: 13px;
    text-align: center;
    line-height: 27px;
    border-radius: 15px;
`;
const GoalList = styled.div`
    width: 320px;
    height: 55px;
    margin: 5px 0px;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const GoalDelete = styled.div`
    cursor: pointer;
    width: 20%;
    height: 55px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    font-size:70px;
    color:red;
`;
const GoalMemo = styled.input`
    flex: 1;
    width:80%;
    height:50px;
    font-size:16px;
`;
const Completion = styled.div`
     width: 100px;
    height: 35px;
    border: 1px solid black;
    cursor: pointer;
    text-align: center;
    line-height: 35px;
    transform: translate(62vw, 40px);
    color:white;
    background-color:#D32F2F;
`;

interface LongProps {
    complet: () => void;
}
const LongGoal: React.FC<LongProps> = ({ complet }) => {
    const [selectedWeek, setSelectedWeek] = useState("1일")
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());
    const [goals, setGoals] = useState<{ memo: string }[]>([{ memo: "" }]);
    const [title, setTitle] = useState("")
    const [showAchievements, setShowAchievements] = useState(false);
    const [achievementName, setAchievementName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const EndDateChange = (date: Date | null) => {
        setSelectedEndDate(date);
    };

    const addGoal = (memo: string = "") => {
        setGoals([...goals, { memo }]);
    };

    const memoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newGoals = [...goals];
        newGoals[index] = { ...newGoals[index], [name]: value };
        setGoals(newGoals);
    };

    const goalDelete = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        const newGoals = goals.filter((_, i) => i !== index);
        setGoals(newGoals);
    };

    const convertToKST = (date: Date) => {
        const offset = 9 * 60;
        const utc = date.getTime() + date.getTimezoneOffset() * 60000;
        return new Date(utc + offset * 60000);
    };
    const handleModalConfirm = () => {
        setShowAchievements(false)
        complet()
    }

    const completClick = async () => {
        if (isCreating) return;
    
        setIsCreating(true);
        if (title !== "" && goals.length !== 0 && goals.every(goal => goal.memo.trim() !== "")) {
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new Error("User not authenticated");
                }
    
                const startDate = new Date();
                const endDate = selectedEndDate ? new Date(selectedEndDate) : new Date();
                const endDateFormat = selectedEndDate ? format(selectedEndDate, 'yyyy-MM-dd') : '';
    
                const startDateKST = convertToKST(startDate);
                const endDateKST = convertToKST(endDate);
    
                const longGoalRef = await addDoc(collection(db, 'personallonggoals'), {
                    챌린지제목: title,
                    유저아이디: user.uid,
                    종료날짜: endDateFormat,
                    시작날짜: format(startDate, 'yyyy-MM-dd'),
                    주에몇일: selectedWeek,
                    목표갯수: goals.length,
                    기한선택: '장기챌린지',
                    챌린지내용: goals.map(goal => goal.memo),
                    기간종료: false,
                    종료알림: false,
                });
    
                const dateArray = [];
                for (let dt = startDateKST; dt <= endDateKST; dt.setDate(dt.getDate() + 1)) {
                    dateArray.push(new Date(dt));
                }
    
                const promises = dateArray.map((date) =>
                    goals.map((goal) =>
                        addDoc(collection(db, 'personallonggoals', longGoalRef.id, 'longgoals'), {
                            챌린지내용: goal.memo,
                            날짜: format(date, 'yyyy-MM-dd'),
                            완료여부: '미완',
                            기한선택: '장기챌린지',
                        })
                    )
                );
                await Promise.all(promises.flat());
    
                const userQuery = query(collection(db, 'user'), where("유저아이디", "==", user.uid));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userDoc = userSnapshot.docs[0];
                    await updateDoc(userDoc.ref, {
                        개인챌린지생성: increment(1)
                    });
    
                    const challengeCount = userDoc.data().개인챌린지생성;
    
                    const achievementsRef = collection(db, 'achievements');
                    const q = query(achievementsRef);
                    const querySnapshot = await getDocs(q);
    
                    const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "개인챌린지 생성");
    
                    if (mainAchievementDoc) {
                        const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                        const subAchievementsSnapshot = await getDocs(subAchievementsRef);
    
                        const subAchievementDoc =
                            challengeCount >= 20
                                ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "개인챌린지 20개 생성")
                                : challengeCount >= 15
                                    ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "개인챌린지 15개 생성")
                                    : challengeCount >= 10
                                        ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "개인챌린지 10개 생성")
                                        : challengeCount >= 5
                                            ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "개인챌린지 5개 생성")
                                            : subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 개인챌린지 생성");
    
                        if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(user.uid)) {
                            const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                            await updateDoc(subAchievementRef, {
                                유저아이디: [...subAchievementDoc.data().유저아이디, user.uid]
                            });
                            setAchievementName(subAchievementDoc.data().도전과제이름);
                            setShowAchievements(true);
                        }else{
                            alert("개인챌린지를 성공적으로 생성하였습니다.");
                            complet();
                        }
                    }
                   
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsCreating(false);
            }
        } else {
            if (title === "" && goals.length === 0 && selectedWeek === "") {
                alert("제목과 주에 몇일을 입력하고 목표를 추가해주세요")
            } else if (title === "") {
                alert("제목을 입력해주세요")
            } else if (goals.length === 0) {
                alert("목표를 추가해주세요")
            } else if (goals.some(goal => goal.memo.trim() === "")) {
                alert("목표의 내용을 입력해주세요")
            }
        }
    };

    const handleQuickAdd = (memo: string) => {
        addGoal(memo);
    };

    const TitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "title") {
            setTitle(value)
        }
    }

    return (
        <Wrapper>
            <h4 style={{ marginTop: "5px", marginBottom: "5px" }}>장기 챌린지 제목 *</h4>
            <Title onChange={TitleChange} type="text" value={title} name="title" placeholder="챌린지 제목을 적어주세요"></Title>
            <DateWrapper>
                <DateTitle>종료날짜를 입력해주세요 <span style={{ fontSize: '12px' }}>(7주 후 까지 선택가능)</span></DateTitle>
                <span style={{ border: "0.3px solid lightgray" }}><DateChoiceFuture onDateChange={EndDateChange} /></span> 까지
            </DateWrapper>
            <WeekWrapper>
                <WeekTitle>주에 몇일 *</WeekTitle>
                <WeekListWrapper>
                    <WeekList selected={selectedWeek === '1일'} onClick={() => setSelectedWeek('1일')}>1일</WeekList>
                    <WeekList selected={selectedWeek === '2일'} onClick={() => setSelectedWeek('2일')}>2일</WeekList>
                    <WeekList selected={selectedWeek === '3일'} onClick={() => setSelectedWeek('3일')}>3일</WeekList>
                    <WeekList selected={selectedWeek === '4일'} onClick={() => setSelectedWeek('4일')}>4일</WeekList>
                    <WeekList selected={selectedWeek === '5일'} onClick={() => setSelectedWeek('5일')}>5일</WeekList>
                    <WeekList selected={selectedWeek === '6일'} onClick={() => setSelectedWeek('6일')}>6일</WeekList>
                    <WeekList selected={selectedWeek === '7일'} onClick={() => setSelectedWeek('7일')}>7일</WeekList>
                </WeekListWrapper>
            </WeekWrapper>
            <GoalsTitle>챌린지 목표를 설정해주세요 *</GoalsTitle>
            <GoalPlus onClick={() => addGoal()}>목표추가+</GoalPlus>
            <QuickWrapper>
                <QuickList onClick={() => handleQuickAdd("헬스장가기")}>헬스장가기</QuickList>
                <QuickList onClick={() => handleQuickAdd("필라테스하기")}>필라테스하기</QuickList>
                <QuickList onClick={() => handleQuickAdd("크로스핏하기")}>크로스핏하기</QuickList>
                <QuickList onClick={() => handleQuickAdd("러닝하기")}>러닝하기</QuickList>
            </QuickWrapper>
            {goals.map((goal, index) => (
                <GoalList key={index}>
                    <GoalMemo
                        onChange={(e) => memoChange(index, e)} value={goal.memo} name="memo" type="text" />
                    <GoalDelete onClick={(event) => goalDelete(index, event)}>-</GoalDelete>
                </GoalList>
            ))}
            <Completion onClick={completClick}>완료</Completion>
            {showAchievements && (
                <AchievementModal handleModalConfirm={handleModalConfirm} achievementName={achievementName} />
            )}
        </Wrapper>
    )
}
export default LongGoal