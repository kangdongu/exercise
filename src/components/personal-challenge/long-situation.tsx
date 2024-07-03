import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { differenceInDays, eachDayOfInterval, endOfWeek, format, isSameDay, parseISO, startOfDay, startOfWeek, subDays } from "date-fns";
import { ko } from "date-fns/locale";
import DonutChart from "./donut-chart";
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
    height: 100vh;
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
    height: 450px;
    background-color: #efebeb;
    animation: ${slide} 0.3s ease-out;
    padding-top:10px;
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
const ChartWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    height:150px;
`;
const PresentChartWrapper = styled.div`
    width:40%;
    height:100px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const TotalChartWrapper = styled.div`
    width:40%;
    height:100px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const PresentText = styled.span`
    
`;
const TotalText = styled.span`

`;
const PresentChartPercent = styled.div`

`;
const TotalChartPercent = styled.div`

`;
const GoalsContentCountWrapper = styled.div`

`;
const GoalsContentCountTitle = styled.h5`
    font-weight:500;
    margin-bottom:0;
    margin-top: 30px;
    font-size:16px;
    font-weight:600;
`;
const GoalsContentWrapper = styled.div`
    width:100%;
    padding-top:10px;
    box-sizing:border-box;
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
    gap:23px;
`;
const WeekCount = styled.div`
`;
const WeekAchievedWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top:18px;
`;

interface Challenge {
    id: string;
    챌린지제목: string;
    주에몇일: string;
    종료날짜: string;
    날짜: string;
    완료여부: string;
    시작날짜: string;
    목표갯수: number;
    챌린지내용: string;
}

const LongGoalSituation = () => {
    const [selectedTitle, setSelectedTitle] = useState("ing")
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [filterChallenge, setFilterChallenge] = useState<Challenge[]>([])
    const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
    const [ongoingChallenges, setOngoingChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const currentUserUID = user.uid;
                    const q = query(collection(db, "personallonggoals"), where("유저아이디", "==", currentUserUID));
                    const querySnapshot = await getDocs(q);

                    const challengesArray: Challenge[] = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        챌린지제목: doc.data().챌린지제목,
                        주에몇일: doc.data().주에몇일,
                        종료날짜: doc.data().종료날짜,
                        날짜: doc.data().날짜,
                        완료여부: doc.data().완료여부,
                        시작날짜: doc.data().시작날짜,
                        목표갯수: doc.data().목표갯수,
                        챌린지내용: doc.data().챌린지내용
                    }));
                    setFilterChallenge(challengesArray)
                    const uniqueChallenges = challengesArray.reduce((acc: Challenge[], challenge) => {
                        if (!acc.some((item) => item.챌린지제목 === challenge.챌린지제목)) {
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

                    setOngoingChallenges(ongoing);
                    setCompletedChallenges(completed);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchChallenges();
    }, []);


    const countSameDaySameChallenge = (challenge: Challenge): number => {
        const targetCount = challenge.목표갯수;

        const allDates = eachDayOfInterval({
            start: startOfDay(parseISO(challenge.시작날짜)),
            end: startOfDay(new Date())
        });

        let completedCount = 0;

        allDates.forEach((date) => {
            const filteredChallenges = filterChallenge.filter((c) => {
                const challengeDate = startOfDay(parseISO(c.날짜));
                const isSame = isSameDay(challengeDate, date);
                return c.챌린지제목 === challenge.챌린지제목 &&
                    isSame &&
                    c.완료여부 === "완료";
            });

            if (filteredChallenges.length === targetCount) {
                completedCount++;
            }
        });

        return completedCount;
    };

    const toggleSituation = (챌린지제목: string) => {
        setSelectedChallenge(selectedChallenge === 챌린지제목 ? null : 챌린지제목);
    };

    const currentDate = (challenge: Challenge) => {
        const startDate = parseISO(challenge.시작날짜);
        const oneDayBefore = subDays(startDate, 1);
        return oneDayBefore;
    };

    const calculatePercent = (completed: number, total: number) => {
        if (total === 0) {
            return 0;
        } else if (total === 100) {
            return ((completed / total) * 100).toFixed(0);
        } else {
            return ((completed / total) * 100).toFixed(2);
        }
    };

    const uniqueChallengeContents = (챌린지제목: string) => {
        const seenContents = new Set();
        return filterChallenge
            .filter(c => c.챌린지제목 === 챌린지제목)
            .filter(c => {
                if (seenContents.has(c.챌린지내용)) {
                    return false;
                } else {
                    seenContents.add(c.챌린지내용);
                    return true;
                }
            });
    };

    const getWeekDates = (): string[] => {
        const today = new Date();
        const monday = startOfWeek(today, { weekStartsOn: 1 });
        const sunday = endOfWeek(today, { weekStartsOn: 1 });
        const dates = eachDayOfInterval({ start: monday, end: sunday });
        return dates.map(date => format(date, 'yyyy-MM-dd'));
    };

    const countCompletedChallengesForWeek = (챌린지제목: string): { [key: string]: number } => {
        const weekDates = getWeekDates();
        const result: { [key: string]: number } = {};

        weekDates.forEach(date => {
            const completedCount = filterChallenge.filter(challenge => {
                return challenge.챌린지제목 === 챌린지제목 &&
                    challenge.날짜 === date &&
                    challenge.완료여부 === '완료';
            }).length;
            result[date] = completedCount;
        });

        return result;
    };

    const countFailedOrSucceededChallenges = (챌린지제목: string): string => {
        const targetDay = parseInt(challenges.find(challenge => challenge.챌린지제목 === 챌린지제목)?.주에몇일 || "0");
        const completedChallenges = countCompletedChallengesForWeek(챌린지제목);
        const completedDays = Object.values(completedChallenges).filter(count => count === challenges.find(challenge => challenge.챌린지제목 === 챌린지제목)?.목표갯수).length;

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
                <SituationWrapper key={challenge.챌린지제목}>
                    <SituationList onClick={() => toggleSituation(challenge.챌린지제목)}>
                        {challenge.챌린지제목}
                        <FaAngleDown style={{ width: "20px", height: "20px" }} />
                    </SituationList>
                    {selectedChallenge === challenge.챌린지제목 && (
                        <Situation>
                            <WeekDdayWrapper>
                                <WeekTitle>주 {challenge.주에몇일} 챌린지</WeekTitle>
                                {selectedTitle === "ing" ? (
                                    <DdayTitle>D-{differenceInDays(parseISO(challenge.종료날짜), new Date())}</DdayTitle>
                                ) : null}
                            </WeekDdayWrapper>
                            <ChartWrapper>
                                {selectedTitle === "ing" ? (
                                    <PresentChartWrapper>
                                        <DonutChart completed={countSameDaySameChallenge(challenge)} total={differenceInDays(new Date(), currentDate(challenge))}></DonutChart>
                                        <PresentChartPercent>{calculatePercent(countSameDaySameChallenge(challenge), differenceInDays(new Date(), currentDate(challenge)))}%</PresentChartPercent>
                                        <PresentText>현재까지의 달성률</PresentText>
                                    </PresentChartWrapper>
                                ) : null}
                                <TotalChartWrapper>
                                    <DonutChart completed={countSameDaySameChallenge(challenge)} total={differenceInDays(parseISO(challenge.종료날짜), parseISO(challenge.시작날짜))}></DonutChart>
                                    <TotalChartPercent>{calculatePercent(countSameDaySameChallenge(challenge), differenceInDays(parseISO(challenge.종료날짜), parseISO(challenge.시작날짜)))}%</TotalChartPercent>
                                    <TotalText>총 달성률</TotalText>
                                </TotalChartWrapper>
                            </ChartWrapper>
                            <GoalsContentCountWrapper>
                                <GoalsContentCountTitle>챌린지 목표</GoalsContentCountTitle>
                                <GoalsContentWrapper>
                                    {uniqueChallengeContents(challenge.챌린지제목).map(filteredChallenge => (
                                        <GoalsContent key={filteredChallenge.id}>{filteredChallenge.챌린지내용}</GoalsContent>
                                    ))}
                                </GoalsContentWrapper>
                            </GoalsContentCountWrapper>
                            <WeekCompletAchievedWrapper>
                                <WeekCompletTitle>이번주 현황</WeekCompletTitle>
                                <WeekComplet>
                                    {getWeekDates().map(date => (
                                        <WeekCount key={date}>
                                            {format(new Date(date), 'EEE', { locale: ko })}
                                            <span style={{ color: countCompletedChallengesForWeek(challenge.챌린지제목)[date] === challenge.목표갯수 ? 'green' : 'black', marginLeft: 5 + "px" }}>{countCompletedChallengesForWeek(challenge.챌린지제목)[date]}</span>
                                        </WeekCount>
                                    ))}
                                </WeekComplet>
                                {selectedTitle === "ing" ? (
                                     <WeekAchievedWrapper>
                                     주 {challenge.주에몇일} 챌린지 : {countFailedOrSucceededChallenges(challenge.챌린지제목)}
                                 </WeekAchievedWrapper>
                                ):null}
                            </WeekCompletAchievedWrapper>
                        </Situation>
                    )}
                </SituationWrapper>
            ))}
        </Wrapper>
    );
};

export default LongGoalSituation;