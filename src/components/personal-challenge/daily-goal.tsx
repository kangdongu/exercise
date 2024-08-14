import styled from "styled-components";
import { useState } from "react";
import { addDoc, arrayUnion, collection, doc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { format } from "date-fns";
import { auth, db } from "../../firebase";
import DateChoiceToday from "../date-picker-today";
import AchievementModal from "../achievement-alert";
import BadgeModal from "../badge-modal";

const Wrapper = styled.div``;
const GoalPlus = styled.button`
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    padding: 0 15px;
    height:35px;
    background-color: #FF6384;
    margin:10px 0px;
    color: white;
    gap: 7px;
    border: none;
    border-radius: 6px;
    span
        {
            font-size: 20px;
            color: #fff;
            font-weight: 700;
        }
`;
const GoalsTitle = styled.h5`
    font-weight:600;
    font-size:16px;
    margin-top:40px;
    margin-bottom:0px;
`;
const QuickWrapper = styled.div`
   margin-bottom:15px;
    display: flex;
    gap: 2%;
    flex-wrap: wrap;
`;
const QuickList = styled.div`
   cursor: pointer;
    height: 27px;
    padding: 0 5px;
    border: 1px solid black;
    font-size: 13px;
    text-align: center;
    line-height: 27px;
    border-radius: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const GoalList = styled.div`
    width: 320px;
    height: 55px;
    margin: 10px 0px;
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

interface DailyProps {
    complet: () => void;
}

const DailyGoal: React.FC<DailyProps> = ({ complet }) => {
    const [showAchievements, setShowAchievements] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [goals, setGoals] = useState<{ memo: string }[]>([{ memo: "" }]);
    const [achievementName, setAchievementName] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [badgeImg, setBadgeImg] = useState("");
    const [badgeName, setBadgeName] = useState("");
    const [showBadge, setShowBadge] = useState(false);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
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

    const handleModalConfirm = () => {
        setShowAchievements(false)
        complet()
    }

    const completClick = async () => {
        if (isCreating) return;

        setIsCreating(true);
        if (goals.every(goal => goal.memo.trim() !== "")) {
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new Error("User not authenticated");
                }
                const recordsRef = collection(db, 'personalgoals');
                const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
                const promises = goals.map((goal) =>
                    addDoc(recordsRef, {
                        챌린지내용: goal.memo,
                        유저아이디: user?.uid,
                        날짜: date,
                        완료여부: '미완',
                        기한선택: '일일챌린지',
                    })
                );
                await Promise.all(promises);

                const userQuery = query(collection(db, 'user'), where("유저아이디", "==", user.uid));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userDoc = userSnapshot.docs[0];
                    await updateDoc(userDoc.ref, {
                        개인챌린지생성: increment(1)
                    });

                    const challengeCount = userDoc.data().개인챌린지생성;

                    if (challengeCount >= 20) {
                        const badgesRef = collection(db, "badges")
                        const q = query(badgesRef)
                        const querySnapshot = await getDocs(q);

                        const badgeDoc = querySnapshot.docs.find(doc => doc.data().뱃지이름 === "개인챌린지 20개 생성 뱃지");

                        if (badgeDoc && !badgeDoc.data().유저아이디.includes(user?.uid)) {
                            const badgeRef = doc(db, "badges", badgeDoc.id);
                            await updateDoc(badgeRef, {
                                유저아이디: arrayUnion(user?.uid),
                            });
                            setBadgeImg(badgeDoc.data().뱃지이미지)
                            setBadgeName(badgeDoc.data().뱃지이름)
                            setShowBadge(true)
                        }
                    }

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
                        } else {
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
        } else if (goals.some(goal => goal.memo.trim() === "")) (
            alert("목표의 내용을 작성해주세요")
        )
    };
    const handleQuickAdd = (memo: string) => {
        addGoal(memo);
    };
    const badgeModalConfirm = () => {
        setShowBadge(false)
    }

    return (
        <Wrapper>
            <GoalsTitle style={{margin:'0px'}}>챌린지 날짜를 선택해주세요 *</GoalsTitle>
            <div style={{ borderRadius: '5px',border:'1px solid black',width:'202px', marginTop:'10px' }}>
                <DateChoiceToday onDateChange={handleDateChange} />
            </div>
            <GoalsTitle>챌린지 목표를 설정해주세요 *</GoalsTitle>
            <GoalPlus onClick={() => addGoal()}><span>+ </span>목표 추가</GoalPlus>
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
            {showBadge && (
                <BadgeModal badgeImg={badgeImg} badgeName={badgeName} badgeModalConfirm={badgeModalConfirm} />
            )}
        </Wrapper>
    );
};

export default DailyGoal;