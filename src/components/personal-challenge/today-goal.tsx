import styled from "styled-components";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { format } from "date-fns";
import { FaCheck } from "react-icons/fa";
import AchievementModal from "../achievement-alert";
import BadgeModal from "../badge-modal";


const Wrapper = styled.div`
   width:100%;
    height:calc(100vh - 190px);
    overflow-y: scroll;
    box-sizing: border-box;
`;
const DailyGoalsWrapper = styled.div`
    height:60vh;
    overflow-y:scroll;
`;
const DailyGoal = styled.div<{ completed: boolean }>`
    width: 80%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0px;
    background-color: ${props => (props.completed ? '#CEDCEC' : '#CEDCEC')};
    padding: 0 10px;
    border-radius: 15px;
    box-sizing: border-box;
    opacity:${props => (props.completed ? "0.5" : '1')};
    font-size:18px;
    font-weight:700;
    color: ${props => (props.completed ? '#333333' : "#333333")};
    border: 1px solid lightgray;
`;
const CompletCountWrapper = styled.div`
    width: 153px;
    height: 37px;
    border: 3px solid #FC286E;
    border-radius: 13px;
    margin: 0 auto;
    display: flex;
    position: fixed;
    left: 50%;
    top: calc(90vh - 60px);
    transform: translate(-50%, -50%);

`;
const Complet = styled.div`
     width: 50%;
    border-right: 1px solid #FC286E;
    text-align: center;
    line-height: 37px;
`;
const TotalComplet = styled.div`
    width: 50%;
    text-align: center;
    line-height: 37px;
`;
const GoalText = styled.div`
    width:80%;
    padding-left:10px;
`;
const GoalComplet = styled.div`
    width:20%;
    height:50px;
    border-left: 1px solid gray;
    line-height:70px;
    text-align:center;
`;

const GuideWrapper = styled.div`
     position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
`;
const Box = styled.div`
     width: 81px;
    height: 45px;
    margin-top: -28px;
    margin-left: -8px;
    border: 5px solid red;
`;
const GuideTextWrapper = styled.div`
     width: 50vw;
    margin: 10px auto;
    font-size: 18px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    border-radius: 10px;
    padding: 10px 10px;
    transform: translate(0px, 90px);
    span {
        font-weight: 600;
    }
`;
const GuideButton = styled.div`
    width: 100px;
    height: 40px;
    background-color: #990033;
    color: white;
    line-height: 40px;
    text-align: center;
`;
const GuideMenu = styled.div`
    width:90vw;
    height:30px;
    background-color:white;
    border-radius:5px;
    margin: 0 auto;
    display:flex;
    gap:15px;
    transform: translate(0px, 65px);

`;
const GuideMenuList = styled.div`

`;

interface Goal {
    id: string;
    챌린지내용: string;
    완료여부: string;
    기한선택: string;
    longGoalId?: string;
}

const TodayGoals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [completedCount, setCompletedCount] = useState<number>(0)
    const [showAchievements, setShowAchievements] = useState(false);
    const [guide, setGuide] = useState(false)
    const [achievementName, setAchievementName] = useState("")
    const [badgeName, setBadgeName] = useState("");
    const [badgeImg, setBadgeImg] = useState("");
    const [showBadge, setShowBadge] = useState(false);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const date = format(new Date(), 'yyyy-MM-dd');
                const personalGoalsQuery = query(collection(db, 'personalgoals'), where('유저아이디', '==', user.uid), where('날짜', '==', date));
                const longGoalsQuery = query(collection(db, 'personallonggoals'), where('유저아이디', '==', user.uid));

                const [personalGoalsSnapshot, longGoalsSnapshot] = await Promise.all([getDocs(personalGoalsQuery), getDocs(longGoalsQuery)]);

                const fetchedGoals: Goal[] = [];
                let completed = 0;

                personalGoalsSnapshot.forEach((doc) => {
                    const goal = { id: doc.id, ...doc.data() } as Goal;
                    fetchedGoals.push(goal);
                    if (goal.완료여부 === '완료') {
                        completed++;
                    }
                });

                for (const longGoalDoc of longGoalsSnapshot.docs) {
                    const longGoalId = longGoalDoc.id;
                    const longGoalsSubCollection = await getDocs(query(collection(db, `personallonggoals/${longGoalId}/longgoals`), where('날짜', '==', date)));

                    longGoalsSubCollection.forEach((doc) => {
                        const goal = { id: doc.id, ...doc.data(), longGoalId } as Goal;
                        fetchedGoals.push(goal);
                        if (goal.완료여부 === '완료') {
                            completed++;
                        }
                    });
                }

                setGoals(fetchedGoals);
                setCompletedCount(completed);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGoals();
    }, []);

    const handleModalConfirm = () => {
        setShowAchievements(false)
    }

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const usersCollectionRef = collection(db, "user");
                const querySnapshot = await getDocs(
                    query(usersCollectionRef, where("유저아이디", "==", currentUser.uid))
                );

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const guide = userDoc.data().개인챌린지가이드;

                    if (guide === false) {
                        setGuide(true);
                        await updateDoc(userDoc.ref, { 개인챌린지가이드: true });
                    }
                } else {
                    console.error("유저 데이터를 찾지 못했습니다.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    const toggleCompletion = async (id: string, currentStatus: string, longGoalId?: string) => {
        try {
            const currentUser = auth.currentUser;
            const goal = goals.find(goal => goal.id === id);
            if (!goal) return;

            const collectionName = longGoalId ? `personallonggoals/${longGoalId}/longgoals` : 'personalgoals';
            const goalDoc = doc(db, collectionName, id);
            const newStatus = currentStatus === '완료' ? '미완' : '완료';

            await updateDoc(goalDoc, { 완료여부: newStatus });

            setGoals(goals.map(goal => {
                if (goal.id === id) {
                    if (newStatus === '완료') {
                        setCompletedCount(completedCount + 1);
                    } else {
                        setCompletedCount(completedCount - 1);
                    }
                    return { ...goal, 완료여부: newStatus };
                }
                return goal;
            }));

            const userQuery = query(collection(db, 'user'), where("유저아이디", "==", currentUser?.uid));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const incrementValue = newStatus === '완료' ? 1 : -1;
                await updateDoc(userDoc.ref, {
                    개인챌린지완료: increment(incrementValue)
                });

                const challengeCount = userDoc.data().개인챌린지완료 + incrementValue;

                if (challengeCount >= 100) {
                    const badgesRef = collection(db, "badges")
                    const bq = query(badgesRef)
                    const badgeQuerySnapshot = await getDocs(bq)

                    const badgeDoc = badgeQuerySnapshot.docs.find(doc => doc.data().뱃지이름 === "개인챌린지 100개 완료 뱃지")

                    if (badgeDoc && !badgeDoc.data().유저아이디.includes(currentUser?.uid)) {
                        const badgeRef = doc(db, "badges", badgeDoc.id);
                        await updateDoc(badgeRef, {
                            유저아이디: arrayUnion(currentUser?.uid),
                        });
                        setBadgeImg(badgeDoc.data().뱃지이미지)
                        setBadgeName(badgeDoc.data().뱃지이름)
                        setShowBadge(true)
                    }
                }

                const achievementsRef = collection(db, 'achievements');
                const q = query(achievementsRef);
                const querySnapshot = await getDocs(q);

                const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "개인챌린지 완료");

                if (mainAchievementDoc) {
                    const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                    const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                    const subAchievementDoc =
                        challengeCount >= 100
                            ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "총 100개 개인챌린지 완료")
                            : challengeCount >= 50
                                ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "총 50개 개인챌린지 완료")
                                : challengeCount >= 30
                                    ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "총 30개 개인챌린지 완료")
                                    : challengeCount >= 10
                                        ? subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "총 10개 개인챌린지 완료")
                                        : subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 개인챌린지 완료");

                    if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                        const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                        await updateDoc(subAchievementRef, {
                            유저아이디: [...subAchievementDoc.data().유저아이디, currentUser?.uid]
                        });
                        setAchievementName(subAchievementDoc.data().도전과제이름);
                        setShowAchievements(true);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const GuideClick = () => {
        setGuide(false);
    }

    const badgeModalConfirm = () => {
        setShowBadge(false)
    }

    return (
        <Wrapper>
            <DailyGoalsWrapper>
                {goals.map((goal, index) => (
                    <DailyGoal key={index} completed={goal.완료여부 === '완료'}>
                        <GoalText>{goal.챌린지내용}</GoalText>
                        <GoalComplet onClick={() => toggleCompletion(goal.id, goal.완료여부, goal.longGoalId)}>
                            <div style={{border:goal.완료여부 === '완료' ? "3px solid #009cfc": "3px solid white", borderRadius:'50%', width:'45px',height:'45px',marginTop:'2.5px' ,marginLeft:'10px'}}>
                                {goal.완료여부 === '완료' ? <FaCheck style={{ fontSize: "30px", color: '009cfc' }} /> : <FaCheck style={{ fontSize: "30px", color: 'white' }} />}
                            </div>
                        </GoalComplet>
                    </DailyGoal>
                ))}
            </DailyGoalsWrapper>
            <CompletCountWrapper>
                <Complet>{completedCount}개</Complet>
                <TotalComplet>{goals.length}개중</TotalComplet>
            </CompletCountWrapper>
            {showAchievements && (
                <AchievementModal handleModalConfirm={handleModalConfirm} achievementName={achievementName} />
            )}
            {guide ? (
                <GuideWrapper>
                    <GuideMenu>
                        <GuideMenuList style={{ color: "#990033" }}>오늘의 목표</GuideMenuList>
                        <GuideMenuList style={{ color: "#939393", position: "relative" }}>목표설정<Box style={{ position: "absolute" }}></Box></GuideMenuList>
                        <GuideMenuList style={{ color: "#939393" }}>장기챌린지현황</GuideMenuList>
                    </GuideMenu>
                    <GuideTextWrapper>
                        <span>목표설정을 눌러 개인목표를 생성하여 보세요.</span>
                        <GuideButton onClick={GuideClick}>확인</GuideButton>
                    </GuideTextWrapper>
                </GuideWrapper>
            ) : null}
            {showBadge && (
                <BadgeModal badgeImg={badgeImg} badgeName={badgeName} badgeModalConfirm={badgeModalConfirm} />
            )}

        </Wrapper>
    );
}

export default TodayGoals;

