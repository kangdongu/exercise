import styled from "styled-components";
import { useState } from "react";
import { addDoc, collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { format } from "date-fns";
import { auth, db } from "../../firebase";
import DateChoiceToday from "../date-picker-today";
import AchievementModal from "../achievement-alert";

const Wrapper = styled.div``;
const GoalPlus = styled.div`
    margin-top:10px;
    width:130px;
    height:30px;
    // transform:translate(65vw,0px);
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
`;

interface DailyProps {
    complet: () => void;
}

const DailyGoal: React.FC<DailyProps> = ({ complet }) => {
    const [showAchievements, setShowAchievements] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [goals, setGoals] = useState<{ memo: string }[]>([{ memo: "" }]);

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
        if (goals.every(goal => goal.memo.trim() !== "")) {
            try {
                const user = auth.currentUser;
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

                const achievementsRef = collection(db, 'achievements');
                const q = query(achievementsRef);
                const querySnapshot = await getDocs(q);

                const achievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "개인챌린지 생성하기");

                if (achievementDoc && !achievementDoc.data().유저아이디.includes(user?.uid)) {
                    const achievementRef = doc(db, 'achievements', achievementDoc.id);
                    await updateDoc(achievementRef, {
                        유저아이디: [...achievementDoc.data().유저아이디, user?.uid]
                    });
                    setShowAchievements(true);
                } else {
                    alert("개인챌린지를 성공적으로 생성하였습니다.")
                    complet();
                }
            } catch (error) {
                console.error(error);
            }
        }else if(goals.some(goal => goal.memo.trim() === ""))(
            alert("목표의 내용을 작성해주세요")
        )
    };


    const handleQuickAdd = (memo: string) => {
        addGoal(memo);
    };

    return (
        <Wrapper>
            <span style={{ border: "0.3px solid lightgray" }}><DateChoiceToday onDateChange={handleDateChange} /></span>
            <GoalsTitle>챌린지 목표를 설정해주세요 *</GoalsTitle>
            <GoalPlus onClick={() => addGoal()}>목표 추가<span>+</span></GoalPlus>
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
                <AchievementModal handleModalConfirm={handleModalConfirm} achievementName="개인챌린지 생성하기" />
            )}
        </Wrapper>
    );
};

export default DailyGoal;