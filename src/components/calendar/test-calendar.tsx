import Calendar, { CalendarProps } from "react-calendar";
import styled from "styled-components"
import 'react-calendar/dist/Calendar.css';
import "./test-calendar.css"
import { useEffect, useState } from "react";
import { format, isSaturday, isSunday } from "date-fns";
import { auth, db } from "../../firebase";
import { arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import Congratulations from "../congratulations";
import ChoiceData from "./choice-data";
import BadgeModal from "../badge-modal";
import AchievementModal from "../achievement-alert";
import CharacterModal from "../character-modal";
import { useLocation, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    margin: 0 auto;
    width:100%;
    height:calc(100vh - 111px);
    background-color: #f8f8f8;
    overflow-y:scroll;
`;
const CalenderWrapper = styled.div`
    position: relative;
    margin: 0 auto;
    width: 90%;
    margin-bottom: 20px;
    padding-bottom: 40px;
`;
const Title = styled.h3`
    margin:0;
    font-size:24px;
`;
const Btn = styled.button`
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    padding: 0 15px;
    height:35px;
    margin-left: auto;
    background-color: #FF286F;
    color: white;
    gap: 7px;
    border: none;
    border-radius: 6px;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    span {
        font-size: 20px;
        color: #fff;
        font-weight: 700;
    }

    &:hover {
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`;
const BtnWrapper = styled.div`
    width:100vw;
    line-height:45px;
    font-size:24px;
    padding:0px 15px;
    padding-bottom:10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom:20px;
    background-color:white;
    display:flex;
    align-items: center;
`;
const Dot = styled.div`
    height: 7px;
    width: 7px;
    background-color: #f87171;
    border-radius: 50%;
    display: flex;
    margin-left: 1px;
`;
const Inbody = styled.div`
    height: 7px;
    width: 7px;
    background-color: #4CA7D8;
    border-radius: 50%;
    display: flex;
    margin-left: 1px;
`;
const Legend = styled.div`
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    gap: 20px;
    font-size: 12px;
    color: #555;
`;


const TestCalendar = () => {
    const currentUser = auth.currentUser;
    const [value, setValue] = useState<Date | [Date, Date] | null>(new Date());
    const [showCongratulations, setShowCongratulations] = useState(false)
    const [exerciseDate, setExerciseDate] = useState<string[]>([])
    const [inbodyDate, setInbodyDate] = useState<string[]>([])
    const [clickDate, setClickDate] = useState<string>("")
    const [showBadge, setShowBadge] = useState(false);
    const [badgeImg, setBadgeImg] = useState("");
    const [badgeName, setBadgeName] = useState("");
    const [achievementName, setAchievementName] = useState("");
    const [showAchievements, setShowAchievements] = useState(false);
    const [showCharacter, setShowCharacter] = useState(false)
    const [newCharacterImage, setNewCharacterImage] = useState("");
    const [congratulationMessage, setCongratulationMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (location.state?.congratulations) {
        setShowCongratulations(true);
        setTimeout(() => setShowCongratulations(false), 3000);
      }
  
      if (location.state?.recordsComplete) {
        recordsComplete();
      }
    }, [location.state]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const userId = currentUser?.uid;
                if (!userId) {
                    alert("로그인을 확인해주세요");
                    return;
                }

                const recordsDocRef = doc(db, "records", userId);

                const exerciseCollectionRef = collection(recordsDocRef, "운동기록");

                const recordsQuerySnapshot = await getDocs(query(exerciseCollectionRef));

                if (!recordsQuerySnapshot.empty) {
                    const recordUniqueDates = new Set<string>();

                    recordsQuerySnapshot.forEach((doc) => {
                        const date = doc.id
                        recordUniqueDates.add(date)
                    })
                    const recordUniqueDatesArray = Array.from(recordUniqueDates);
                    setExerciseDate(recordUniqueDatesArray)
                }

                const inbodysRef = collection(db, "inbody");
                const inbodysQuerySnapshot = await getDocs(query(inbodysRef, where("유저아이디", "==", userId), orderBy("날짜", "asc")));

                if (!inbodysQuerySnapshot.empty) {
                    const inbodyUniqueDates = new Set<string>();

                    inbodysQuerySnapshot.forEach((doc) => {
                        const date = doc.data().날짜;
                        const dateFormat = format(date, "yyyy-MM-dd");
                        inbodyUniqueDates.add(dateFormat);
                    });

                    const inbodyUniqueDatesArray = Array.from(inbodyUniqueDates);
                    setInbodyDate(inbodyUniqueDatesArray);
                }

            } catch (error) {
                console.log("데이터를 가져오는 중 오류가 발생했습니다: ", error);
            }
        };
        fetchRecords();
    }, []);



    const recordsComplete = async () => {
        const today = new Date();
        const formattedDate = format(today, 'yyyy-MM-dd');

        const userCollectionRef = collection(db, "user");
        const userQuerySnapshot = await getDocs(query(userCollectionRef, where("유저아이디", "==", currentUser?.uid)));

        if (userQuerySnapshot.empty) return;

        const userDoc = userQuerySnapshot.docs[0];
        const todayExercise = userDoc.data().오늘운동;
        const userStep = userDoc.data().단계;
        const gender = userDoc.data().성별;

        // 오늘 운동 여부 확인 및 캐릭터 이미지 변경
        if (!todayExercise) {
            if (!currentUser?.uid) {
                return;
            }
            const recordsDocRef = doc(db, "records", currentUser?.uid);
            const recordsCollectionRef = collection(recordsDocRef, "운동기록");

            const dateDocRef = doc(recordsCollectionRef, formattedDate);
            const dateDocSnapshot = await getDoc(dateDocRef);

            if (dateDocSnapshot.exists()) {
                await updateCharacterImage(userDoc, gender, userStep);
            }
        }

        // 운동일수 업데이트
        await updateDoc(userDoc.ref, {
            운동일수: exerciseDate.length
        });

        // 뱃지 획득 로직
        await checkAndAwardBadge(exerciseDate.length);

        // 도전과제 달성 로직
        await checkAndCompleteAchievement(exerciseDate.length);

        // 캐릭터 성장 확인
        await checkAndGrowCharacter(gender, exerciseDate.length, userDoc);
    };

    // 오늘 운동달성시 캐릭터이미지 변경
    const updateCharacterImage = async (
        userDoc: any,
        gender: string,
        userStep: string
    ): Promise<void> => {
        const charactersRef = collection(db, "characters");
        const characterSnapshot = await getDocs(query(charactersRef, where("성별", "==", gender === "남자" ? "남성" : "여성")));

        if (!characterSnapshot.empty) {
            const characterDoc = characterSnapshot.docs[0];
            const stepsRef = collection(characterDoc.ref, "steps");

            const stepSnapshot = await getDocs(query(stepsRef, where("단계", "==", userStep)));

            if (!stepSnapshot.empty) {
                const stepDoc = stepSnapshot.docs[0];
                const exerciseAfterImage = stepDoc.data().운동후;

                await updateDoc(userDoc.ref, {
                    캐릭터이미지: exerciseAfterImage,
                    오늘운동: true,
                });
            }
        }
    };

    // 뱃지획득
    const checkAndAwardBadge = async (days: number): Promise<void> => {
        if (days === 200) {
            const badgesRef = collection(db, "badges");
            const badgesQuerySnapshot = await getDocs(query(badgesRef, where("필요일수", "==", days)));

            const badgeDoc = badgesQuerySnapshot.docs[0];

            if (badgeDoc && !badgeDoc.data().유저아이디.includes(currentUser?.uid)) {
                const badgeRef = doc(db, "badges", badgeDoc.id);
                await updateDoc(badgeRef, {
                    유저아이디: arrayUnion(currentUser?.uid),
                });
                setBadgeImg(badgeDoc.data().뱃지이미지);
                setBadgeName(badgeDoc.data().뱃지이름);
                setShowBadge(true);
            }
        }
    };

    // 도전과제 달성
    const checkAndCompleteAchievement = async (days: number): Promise<void> => {
        const achievementsRef = collection(db, "achievements");
        const achievementQuerySnapshot = await getDocs(query(achievementsRef));

        const mainAchievementDoc = achievementQuerySnapshot.docs.find(doc => doc.data().도전과제이름 === "누적 운동기록");

        if (mainAchievementDoc) {
            const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
            const subAchievementsSnapshot = await getDocs(subAchievementsRef);

            const subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().필요일수 === days);

            if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                await updateDoc(subAchievementRef, {
                    유저아이디: arrayUnion(currentUser?.uid),
                });
                setAchievementName(subAchievementDoc.data().도전과제이름);
                setShowAchievements(true);
            }
        }
    };

    // 캐릭터 잠금해제
    const checkAndGrowCharacter = async (
        gender: string,
        days: number,
        userDoc: any
    ): Promise<void> => {
        const genderStr = gender === "남자" ? "남성" : "여성";
        const charactersRef = collection(db, 'characters');
        const characterSnapshot = await getDocs(query(charactersRef, where("성별", "==", genderStr)));

        if (!characterSnapshot.empty) {
            if (!currentUser?.uid) {
                return;
            }
            const characterDoc = characterSnapshot.docs[0];
            const stepsRef = collection(characterDoc.ref, "steps");

            const today = new Date();
            const formattedDate = format(today, 'yyyy-MM-dd');

            const recordsDocRef = doc(db, "records", currentUser?.uid);
            const todayRecordRef = doc(collection(recordsDocRef, "운동기록"), formattedDate);
            const todayExercisesSnapshot = await getDocs(collection(todayRecordRef, "exercises"));

            const hasExerciseToday = !todayExercisesSnapshot.empty;

            const stepData = [
                { minDays: 50, stepName: "4단계" },
                { minDays: 30, stepName: "3단계" },
                { minDays: 10, stepName: "2단계" }
            ];

            for (const step of stepData) {
                if (days >= step.minDays) {
                    const stepSnapshot = await getDocs(query(stepsRef, where("단계", "==", step.stepName)));
                    if (!stepSnapshot.empty && !stepSnapshot.docs[0].data().유저아이디.includes(currentUser?.uid)) {
                        const stepDoc = stepSnapshot.docs[0];
                        const newCharacterImage = hasExerciseToday ? stepDoc.data().운동후 : stepDoc.data().운동전;

                        await updateDoc(stepDoc.ref, {
                            유저아이디: arrayUnion(currentUser?.uid),
                        });
                        await updateDoc(userDoc.ref, {
                            캐릭터이미지: newCharacterImage,
                            오늘운동: hasExerciseToday,
                            단계: step.stepName,
                            선택단계: step.stepName
                        });

                        setNewCharacterImage(newCharacterImage);
                        setCongratulationMessage(`축하합니다! 캐릭터 ${step.stepName}가 잠금해제 되었습니다.`);
                        setShowCharacter(true);
                        break;
                    }
                }
            }
        }
    };



    useEffect(() => {
        if (value instanceof Date || (Array.isArray(value) && value.length === 2 && value.every(v => v instanceof Date))) {
            setValue(value as Date | [Date, Date]);
        } else {
            setValue(null);
        }

        if (value instanceof Date) {
            const formattedDate = format(value, "yyyy-MM-dd");
            setClickDate(formattedDate);
        } else if (Array.isArray(value) && value.length === 2 && value[0] instanceof Date) {
            const formattedDate = format(value[0], "yyyy-MM-dd");
            setClickDate(formattedDate);
        }
    }, [])

    const onChange: CalendarProps["onChange"] = (value) => {
        if (value instanceof Date || (Array.isArray(value) && value.length === 2 && value.every(v => v instanceof Date))) {
            setValue(value as Date | [Date, Date]);
        } else {
            setValue(null);
        }

        if (value instanceof Date) {
            const formattedDate = format(value, "yyyy-MM-dd");
            setClickDate(formattedDate);
        } else if (Array.isArray(value) && value.length === 2 && value[0] instanceof Date) {
            const formattedDate = format(value[0], "yyyy-MM-dd");
            setClickDate(formattedDate);
        }
    };

    // const congratulations = () => {
    //     setShowCongratulations(true);
    //     setTimeout(() => {
    //         setShowCongratulations(false);
    //     }, 3000);
    // }



    return (
        <Wrapper>
            <BtnWrapper>
                <Title>Calendar</Title>
                <Btn onClick={() => navigate('/exercise-choice')}><span>+</span>운동기록</Btn>
            </BtnWrapper>
            <CalenderWrapper>
                <Calendar
                    onChange={onChange}
                    value={value}
                    prev2Label={null}
                    next2Label={null}
                    minDetail="month"
                    maxDetail="month"
                    formatDay={(_locale, date) => format(date, 'dd')}
                    tileClassName={({ date, view }) => {
                        if (view === 'month') {
                            const formattedDate = format(date, 'yyyy-MM-dd');
                            if (exerciseDate.includes(formattedDate)) {
                                return 'react-calendar__tile--has-event';
                            }
                            if (inbodyDate.includes(formattedDate)) {
                                return 'react-calendar__tile--has-inbody';
                            }
                            if (isSaturday(date)) {
                                return 'react-calendar__tile--saturday';
                            } else if (isSunday(date)) {
                                return 'react-calendar__tile--sunday';
                            } else {
                                return 'react-calendar__tile--weekday';
                            }
                        }
                        return null;
                    }}
                    tileContent={({ date }) => {
                        let html = []
                        if (exerciseDate.find((x) => x === format(date, "yyyy-MM-dd"))) {
                            html.push(<Dot></Dot>)
                        } else {
                            html.push(<div style={{ height: '8px' }} />)
                        }
                        if (inbodyDate.find((x) => x === format(date, "yyyy-MM-dd"))) {
                            html.push(<Inbody></Inbody>);
                        }
                        return (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {html}
                                </div>
                            </>
                        )
                    }}
                />
                <Legend>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Dot style={{ display: 'inline-block' }} />
                        <span>운동기록</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Inbody style={{ display: 'inline-block' }} />
                        <span>인바디기록</span>
                    </div>
                </Legend>
            </CalenderWrapper>

            {showCongratulations && (
                <Congratulations title='운동기록 완료' content='운동기록을 완료하였습니다' />
            )}
            <ChoiceData clickDate={clickDate} />
            {showBadge && (
                <BadgeModal badgeImg={badgeImg} badgeName={badgeName} badgeModalConfirm={() => setShowBadge(false)} />
            )}
            {showAchievements && (
                <AchievementModal achievementName={achievementName} handleModalConfirm={() => setShowAchievements(false)} />
            )}
            {showCharacter && (
                <CharacterModal
                    characterModalConfirm={() => setShowCharacter(false)}
                    characterImage={newCharacterImage}
                    message={congratulationMessage}
                />
            )}
        </Wrapper>
    )
}
export default TestCalendar