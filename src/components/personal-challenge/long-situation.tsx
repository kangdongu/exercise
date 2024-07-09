import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { differenceInDays, eachDayOfInterval, endOfWeek, format, parseISO, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { FaAngleDown } from "react-icons/fa";

const slide = keyframes`
  from {
    transform:translate(0px, -50px);
  }
  to {
    transform:translate(0px, 0px);
  }
`;

const Wrapper = styled.div`
    width: 100%;
    height: 79vh;
    overflow-y:scroll;
`;
const TitleWrapper = styled.div`
    display:flex;
    width:89vw;
    margin-bottom:20px;
`;
const Title = styled.div<{ selected: Boolean }>`
    width:50%;
    font-weight: 500;
    border-bottom: ${props => props.selected ? '2px solid red' : 'none'};;
    text-align:center;
    color:${props => props.selected ? 'black' : "#939393"}
`;

const SituationWrapper = styled.div`
    width: 89vw;
`;

const SituationList = styled.div`
    width: 100%;
    height: 50px;
    border: 1px solid black;
    background-color: white;
    position: relative;
    z-index: 90;
    border-radius: 15px;
    line-height: 50px;
    margin-top:10px;
    padding-left:10px;
    box-sizing:border-box;
    display: flex;
    align-items: center;
`;

const Situation = styled.div`
    width: 100%;
    background-color: #efebeb;
    animation: ${slide} 0.3s ease-out;
    padding:10px 10px;
    box-sizing:border-box;
`;
const WeekDdayWrapper = styled.div`
    width:100%;
    height:30px;
    margin-bottom:10px;
`;
const WeekTitle = styled.span`
    float:left;
`;
const DdayTitle = styled.span`
    float:right;
`;
const GoalsContentCountWrapper = styled.div`

`;
const GoalsContentCountTitle = styled.h4`
    margin-bottom:10px;
`;
const GoalsContentWrapper = styled.div`
    width:100%;
`;
const GoalsContent = styled.div`

`;
const WeekCompletAchievedWrapper = styled.div`

`;
const WeekCompletTitle = styled.h5`
    font-weight:600;
    font-size:16px;
`;
const WeekComplet = styled.div`
    display:flex;
    gap:0.3%;
`;
const WeekCount = styled.div`
    width:14.0285714%;
`;
const WeekAchievedWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top:18px;
`;
const EndAlarmWrapper = styled.div`
    width:100vw;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    z-index:99;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
`;
const AlarmContent = styled.div`
    width:65vw;
    height:65vw;
    background-color:white;
    padding:10px;
`;

interface SubGoal {
    날짜: string;
    챌린지내용: string;
    완료여부: string;
}

interface Challenge {
    id: string;
    챌린지제목: string;
    주에몇일: string;
    종료날짜: string;
    시작날짜: string;
    목표갯수: number;
    챌린지내용: string[];
    기간종료: boolean;
    종료알림:boolean;
    subGoals: SubGoal[];
}

const LongGoalSituation = () => {
    const [selectedTitle, setSelectedTitle] = useState("ing");
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
    const [ongoingChallenges, setOngoingChallenges] = useState<Challenge[]>([]);
    const [showEndAlarm, setShowEndAlarm] = useState<Challenge[]>([]);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const currentUserUID = user.uid;
                const q = query(collection(db, "personallonggoals"), where("유저아이디", "==", currentUserUID));
                const querySnapshot = await getDocs(q);

                const challengesArray: Challenge[] = [];

                for (const docSnapshot of querySnapshot.docs) {
                    const challengeData = docSnapshot.data();
                    const challengeId = docSnapshot.id;

                    const subCollectionQuery = query(collection(db, `personallonggoals/${challengeId}/longgoals`));
                    const subCollectionSnapshot = await getDocs(subCollectionQuery);

                    const subGoals: SubGoal[] = subCollectionSnapshot.docs.map(subDoc => ({
                        날짜: subDoc.data().날짜,
                        챌린지내용: subDoc.data().챌린지내용,
                        챌린지제목: subDoc.data().챌린지제목,
                        완료여부: subDoc.data().완료여부,
                    }));

                    const challenge: Challenge = {
                        id: challengeId,
                        챌린지제목: challengeData.챌린지제목,
                        주에몇일: challengeData.주에몇일,
                        종료날짜: challengeData.종료날짜,
                        시작날짜: challengeData.시작날짜,
                        목표갯수: challengeData.목표갯수,
                        챌린지내용: challengeData.챌린지내용,
                        기간종료: challengeData.기간종료,
                        종료알림:challengeData.종료알림,
                        subGoals: subGoals,
                    };

                    challengesArray.push(challenge);
                }

                const uniqueChallenges = challengesArray.reduce((acc: Challenge[], challenge) => {
                    if (!acc.some((item) => item.id === challenge.id)) {
                        acc.push(challenge);
                    }
                    return acc;
                }, []);

                setChallenges(uniqueChallenges);

                const now = new Date();
                const ongoing = uniqueChallenges.filter((challenge) =>
                    differenceInDays(parseISO(challenge.종료날짜), now) >= 0
                );
                const completed = uniqueChallenges.filter((challenge) =>
                    differenceInDays(parseISO(challenge.종료날짜), now) < 0
                );

                for (const challenge of completed) {
                    if (!challenge.기간종료) {
                        const challengeDoc = doc(db, "personallonggoals", challenge.id);
                        await updateDoc(challengeDoc, { 기간종료: true });
                    }
                }

                const showEndAlarmChallenges = completed.filter((challenge) => challenge.기간종료 && !challenge.종료알림);
                setShowEndAlarm(showEndAlarmChallenges);

                for (const challenge of completed) {
                    if (!challenge.기간종료) {
                        const challengeDoc = doc(db, "personallonggoals", challenge.id);
                        await updateDoc(challengeDoc, { 기간종료: true });
                    }
                }

                setOngoingChallenges(ongoing);
                setCompletedChallenges(completed);

            } catch (error) {
                console.error(error);
            }
        };

        fetchChallenges();
    }, []);

    const handleEndAlarmConfirm = async (challenge: Challenge) => {
        const challengeDoc = doc(db, "personallonggoals", challenge.id);
        await updateDoc(challengeDoc, { 종료알림: true });
        setShowEndAlarm((prev) => prev.filter((item) => item.id !== challenge.id));
    };

    const toggleSituation = (challengeId: string) => {
        setSelectedChallenge(selectedChallenge === challengeId ? null : challengeId);
    };

    const uniqueChallengeContents = (challengeId: string) => {
        const challenge = challenges.find(challenge => challenge.id === challengeId);
        const seenContents = new Set();
        return challenge?.subGoals
            .filter(c => {
                if (seenContents.has(c.챌린지내용)) {
                    return false;
                } else {
                    seenContents.add(c.챌린지내용);
                    return true;
                }
            }) || [];
    };

    const getWeekDates = (): string[] => {
        const today = new Date();
        const monday = startOfWeek(today, { weekStartsOn: 1 });
        const sunday = endOfWeek(today, { weekStartsOn: 1 });
        const dates = eachDayOfInterval({ start: monday, end: sunday });
        return dates.map(date => format(date, 'yyyy-MM-dd'));
    };

    const countCompletedChallengesForWeek = (challengeId: string): { [key: string]: number } => {
        const weekDates = getWeekDates();
        const result: { [key: string]: number } = {};

        const challenge = challenges.find(challenge => challenge.id === challengeId);

        weekDates.forEach(date => {
            const completedCount = challenge?.subGoals.filter(subGoal => {
                const subGoalDate = format(parseISO(subGoal.날짜), 'yyyy-MM-dd');
                return subGoalDate === date && subGoal.완료여부 === '완료';
            }).length || 0;
            result[date] = completedCount;
        });
        return result;
    };

    const countFailedOrSucceededChallenges = (challengeId: string): string => {
        const challenge = challenges.find(challenge => challenge.id === challengeId);
        const targetDay = parseInt(challenge?.주에몇일 || "0");
        const completedChallenges = countCompletedChallengesForWeek(challengeId);
        const completedDays = Object.values(completedChallenges).filter(count => count === challenge?.목표갯수).length;

        if (completedDays < targetDay) {
            return "미달성";
        } else {
            return "성공";
        }
    };

    return (
        <Wrapper>
            <TitleWrapper>
                <Title selected={selectedTitle === 'ing'} onClick={() => setSelectedTitle('ing')}>진행중인 장기챌린지</Title>
                <Title selected={selectedTitle === 'completed'} onClick={() => setSelectedTitle('completed')}>완료된 장기챌린지</Title>
            </TitleWrapper>
            {(selectedTitle === 'ing' ? ongoingChallenges : completedChallenges).map((challenge) => (
                <SituationWrapper key={challenge.id}>
                    <SituationList onClick={() => toggleSituation(challenge.id)}>
                        {challenge.챌린지제목}
                        <FaAngleDown style={{ width: "20px", height: "20px" }} />
                    </SituationList>
                    {selectedChallenge === challenge.id && (
                        <Situation>
                            <WeekDdayWrapper>
                                <WeekTitle>주 {challenge.주에몇일} 챌린지</WeekTitle>
                                {selectedTitle === "ing" ? (
                                    <DdayTitle>D-{differenceInDays(parseISO(challenge.종료날짜), new Date())}</DdayTitle>
                                ) : null}
                            </WeekDdayWrapper>
                            <GoalsContentCountWrapper>
                                <GoalsContentCountTitle>챌린지 목표</GoalsContentCountTitle>
                                <GoalsContentWrapper>
                                    {uniqueChallengeContents(challenge.id).map(filteredChallenge => (
                                        <GoalsContent key={filteredChallenge.챌린지내용}>{filteredChallenge.챌린지내용}</GoalsContent>
                                    ))}
                                </GoalsContentWrapper>
                            </GoalsContentCountWrapper>
                            <WeekCompletAchievedWrapper>
                                <div>
                                    <h4 style={{marginBottom:'10px'}}>시작날짜</h4>
                                    <div>{challenge.시작날짜}</div>
                                </div>
                                <div>
                                    <h4 style={{marginBottom:'10px'}}>종료날짜</h4>
                                    <div>{challenge.종료날짜}</div>
                                </div>
                                <WeekCompletTitle style={{marginBottom:'10px'}}>이번주 현황</WeekCompletTitle>
                                <WeekComplet>
                                    {getWeekDates().map(date => (
                                        <WeekCount key={date}>
                                            {format(new Date(date), 'EEE', { locale: ko })}
                                            <span style={{ color: countCompletedChallengesForWeek(challenge.id)[date] === challenge.목표갯수 ? 'green' : 'black', marginLeft: 5 + "px" }}>{countCompletedChallengesForWeek(challenge.id)[date]}</span>
                                        </WeekCount>
                                    ))}
                                </WeekComplet>
                                {selectedTitle === "ing" ? (
                                    <WeekAchievedWrapper>
                                        주 {challenge.주에몇일} 챌린지 : {countFailedOrSucceededChallenges(challenge.id)}
                                    </WeekAchievedWrapper>
                                ) : null}
                            </WeekCompletAchievedWrapper>
                        </Situation>
                    )}
                </SituationWrapper>
            ))}
             {showEndAlarm.length > 0 && (
                <EndAlarmWrapper>
                    {showEndAlarm.map((challenge) => (
                        <AlarmContent key={challenge.id}>
                            <h4 style={{fontSize:'18px' ,textAlign: 'center' }}>장기챌린지 완료안내</h4>
                            <p>챌린지 제목: {challenge.챌린지제목}</p>
                            <p>종료날짜: {challenge.종료날짜}</p>
                            <button style={{width:"100px", height:'40px', color:'white',backgroundColor:'#990033', marginTop:'2vh', fontSize:'18px'}} onClick={() => handleEndAlarmConfirm(challenge)}>확인</button>
                        </AlarmContent>
                    ))}
                </EndAlarmWrapper>
            )}
        </Wrapper>
    );
};

export default LongGoalSituation;
