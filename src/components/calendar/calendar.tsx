import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { arrayUnion, collection, doc, DocumentData, getDocs, orderBy, query, QuerySnapshot, updateDoc, where } from 'firebase/firestore';
import ExerciseRegistration from './records-registration';
import './calendar.css'
import CalendarClickModal from './calendar-click-component';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import AchievementModal from '../achievement-alert';
import BadgeModal from '../badge-modal';
import CharacterModal from '../character-modal';
import Congratulations from '../congratulations';


const Wrapper = styled.div`
    width: 80%;
    height:calc(100vh - 117px);
    margin: 0 auto;
    background-color: #f8f8f8;
    overflow:hidden;
    @media screen and (max-width: 700px) {
        width: 100%;
        margin: 0 auto;
    }
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
    margin-bottom:12px;
    background-color:white;
    display:flex;
    align-items: center;
`;

interface ExerciseData {
    종류: string;
    횟수?: string;
    무게?: string;
    날짜: string;
}


const Calendar = () => {
    const [calendarClick, setCalendarClick] = useState(false);
    const [clickDate, setClickDate] = useState<string>("");
    const [modal, setModal] = useState(false)
    const [achievementName, setAchievementName] = useState("")
    const [showAchievements, setShowAchievements] = useState(false)
    const [createRecords, setCreateRecords] = useState<{ title: string; date: any }[]>([]);
    const [showBadge, setShowBadge] = useState(false);
    const [badgeImg, setBadgeImg] = useState("")
    const [badgeName, setBadgeName] = useState("")
    const [showCharacter, setShowCharacter] = useState(false)
    const [newCharacterImage, setNewCharacterImage] = useState("");
    const [congratulationMessage, setCongratulationMessage] = useState("");
    const [showCongratulations, setShowCongratulations] = useState(false)
    const user = auth.currentUser;

    const onClick = () => {
        setModal(true);
    };
    const closeModal = () => setModal(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser
                const currentUserUID = currentUser?.uid;
                const today = new Date();
                const formattedDate = format(today, 'yyyy-MM-dd');

                const usersRef = collection(db, "user");
                const userQuerySnapshot = await getDocs(query(usersRef, where("유저아이디", "==", currentUserUID)));

                if (!userQuerySnapshot.empty) {
                    const userDoc = userQuerySnapshot.docs[0];
                    const todayExercise = userDoc.data().오늘운동;
                    const userStep = userDoc.data().단계;

                    if (todayExercise === false) {
                        const recordsCollectionRef = collection(db, "records");
                        const querySnapshot = await getDocs(
                            query(recordsCollectionRef, where("날짜", "==", formattedDate), where("유저아이디", "==", currentUserUID))
                        );

                        if (!querySnapshot.empty) {
                            const gender = userDoc.data().성별;
                            const charactersRef = collection(db, "characters");
                            const characterSnapshot = await getDocs(query(charactersRef, where("성별", "==", gender === "남자" ? "남성" : "여성")));

                            if (!characterSnapshot.empty) {
                                const characterDoc = characterSnapshot.docs[0];
                                const stepsRef = collection(characterDoc.ref, "steps");

                                let stepSnapshot: QuerySnapshot<DocumentData> | null = null;
                                if (userStep === "4단계") {
                                    stepSnapshot = await getDocs(query(stepsRef, where("단계", "==", "4단계")));
                                } else if (userStep === "3단계") {
                                    stepSnapshot = await getDocs(query(stepsRef, where("단계", "==", "3단계")));
                                } else if (userStep === "2단계") {
                                    stepSnapshot = await getDocs(query(stepsRef, where("단계", "==", "2단계")));
                                } else if (userStep === "1단계") {
                                    stepSnapshot = await getDocs(query(stepsRef, where("단계", "==", "1단계")));
                                }

                                if (stepSnapshot && !stepSnapshot.empty) {
                                    const stepDoc = stepSnapshot.docs[0];
                                    const exerciseAfterImage = stepDoc.data().운동후;

                                    await updateDoc(userDoc.ref, {
                                        캐릭터이미지: exerciseAfterImage,
                                        오늘운동: true,
                                    });
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("유저 데이터 에러:", error);
            }
        };

        fetchUserData();
    }, [modal]);


    useEffect(() => {
        const fetchRecords = async () => {
            try {
                if (user) {
                    const currentUserUID = user.uid;
                    const userCollectionRef = collection(db, "user");
                    const userQuerySnapshot = await getDocs(query(userCollectionRef, where("유저아이디", "==", currentUserUID)));

                    if (!userQuerySnapshot.empty) {
                        const userDoc = userQuerySnapshot.docs[0];
                        const gender = userDoc.data().성별;
                        const recordsCollectionRef = collection(db, "records");
                        const querySnapshot = await getDocs(query(recordsCollectionRef, where("유저아이디", "==", currentUserUID), orderBy("날짜", "asc")));


                        if (!querySnapshot.empty) {
                            const groupedEvents: { [key: string]: ExerciseData[] } = {};
                            querySnapshot.docs.forEach(doc => {
                                const data = doc.data() as ExerciseData;
                                const key = `${data.종류}_${data.날짜}`;
                                if (!groupedEvents[key]) {
                                    groupedEvents[key] = [];
                                }
                                groupedEvents[key].push(data);
                            });


                            const userEvents = Object.values(groupedEvents).map(group => {
                                if (group.length > 1) {
                                    return {
                                        title: group.map(item => `${item.종류} ${item.횟수 || ''}개 ${item.무게 || ''}kg`).join('<br>'),
                                        date: group[0].날짜
                                    };
                                } else {
                                    return {
                                        title: `${group[0].종류} ${group[0].횟수 || ''}개 ${group[0].무게 || ''}kg`,
                                        date: group[0].날짜
                                    };
                                }
                            });

                            setCreateRecords(userEvents);

                            const exerciseDates = [...new Set(querySnapshot.docs.map(doc => doc.data().날짜))];

                            if (exerciseDates.length >= 200) {
                                const badgesRef = collection(db, "badges");
                                const bq = query(badgesRef);
                                const badgeQuerySnapshot = await getDocs(bq);

                                const badgeDoc = badgeQuerySnapshot.docs.find(doc => doc.data().뱃지이름 === "누적 운동 200일 뱃지");

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
                            const achievementQuerySnapshot = await getDocs(q);

                            const mainAchievementDoc = achievementQuerySnapshot.docs.find(doc => doc.data().도전과제이름 === "누적 운동기록");

                            if (mainAchievementDoc) {
                                const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                                const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                                let subAchievementDoc;
                                if (exerciseDates.length >= 200) {
                                    subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "운동기록 200일");
                                } else if (exerciseDates.length >= 100) {
                                    subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "운동기록 100일");
                                } else if (exerciseDates.length >= 50) {
                                    subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "운동기록 50일");
                                } else if (exerciseDates.length >= 30) {
                                    subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "운동기록 30일");
                                } else if (exerciseDates.length >= 20) {
                                    subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "운동기록 20일");
                                } else if (exerciseDates.length >= 10) {
                                    subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "운동기록 10일");
                                }

                                if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(user?.uid)) {
                                    const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                                    await updateDoc(subAchievementRef, {
                                        유저아이디: arrayUnion(user?.uid),
                                    });
                                    setAchievementName(subAchievementDoc.data().도전과제이름);
                                    setShowAchievements(true);
                                }
                            }

                            const genderStr = gender === "남자" ? "남성" : "여성";
                            const charactersRef = collection(db, 'characters');
                            const characterSnapshot = await getDocs(query(charactersRef, where("성별", "==", genderStr)));

                            if (!characterSnapshot.empty) {
                                const characterDoc = characterSnapshot.docs[0];
                                const stepsRef = collection(characterDoc.ref, "steps");

                                const today = new Date();
                                const formattedDate = format(today, 'yyyy-MM-dd');
                                const recordsQuerySnapshot = await getDocs(
                                    query(recordsCollectionRef, where("날짜", "==", formattedDate), where("유저아이디", "==", currentUserUID))
                                );

                                const hasExerciseToday = !recordsQuerySnapshot.empty;

                                if (exerciseDates.length >= 50) {
                                    const step4Snapshot = await getDocs(query(stepsRef, where("단계", "==", "4단계")));
                                    if (!step4Snapshot.empty && !step4Snapshot.docs[0].data().유저아이디.includes(user?.uid)) {
                                        const step4Doc = step4Snapshot.docs[0];
                                        const newCharacterImage = hasExerciseToday ? step4Doc.data().운동후 : step4Doc.data().운동전;

                                        await updateDoc(step4Doc.ref, {
                                            유저아이디: arrayUnion(user?.uid),
                                        });
                                        await updateDoc(userDoc.ref, {
                                            캐릭터이미지: newCharacterImage,
                                            오늘운동: hasExerciseToday,
                                            단계: "4단계"
                                        });

                                        setNewCharacterImage(newCharacterImage);
                                        setCongratulationMessage("축하합니다! 캐릭터가 4단계로 성장했습니다.");
                                        setShowCharacter(true);
                                    }
                                } else if (exerciseDates.length >= 30) {
                                    const step3Snapshot = await getDocs(query(stepsRef, where("단계", "==", "3단계")));
                                    if (!step3Snapshot.empty && !step3Snapshot.docs[0].data().유저아이디.includes(user?.uid)) {
                                        const step3Doc = step3Snapshot.docs[0];
                                        const newCharacterImage = hasExerciseToday ? step3Doc.data().운동후 : step3Doc.data().운동전;

                                        await updateDoc(step3Doc.ref, {
                                            유저아이디: arrayUnion(user?.uid),
                                        });
                                        await updateDoc(userDoc.ref, {
                                            캐릭터이미지: newCharacterImage,
                                            오늘운동: hasExerciseToday,
                                            단계: "3단계"
                                        });

                                        setNewCharacterImage(newCharacterImage);
                                        setCongratulationMessage("축하합니다! 캐릭터가 3단계로 성장했습니다.");
                                        setShowCharacter(true);
                                    }
                                } else if (exerciseDates.length >= 10) {
                                    const step2Snapshot = await getDocs(query(stepsRef, where("단계", "==", "2단계")));
                                    if (!step2Snapshot.empty && !step2Snapshot.docs[0].data().유저아이디.includes(user?.uid)) {
                                        const step2Doc = step2Snapshot.docs[0];
                                        const newCharacterImage = hasExerciseToday ? step2Doc.data().운동후 : step2Doc.data().운동전;

                                        await updateDoc(step2Doc.ref, {
                                            유저아이디: arrayUnion(user?.uid),
                                        });
                                        await updateDoc(userDoc.ref, {
                                            캐릭터이미지: newCharacterImage,
                                            오늘운동: hasExerciseToday,
                                            단계: "2단계"
                                        });

                                        setNewCharacterImage(newCharacterImage);
                                        setCongratulationMessage("축하합니다! 캐릭터가 2단계로 성장했습니다.");
                                        setShowCharacter(true);
                                    }
                                }
                            }
                            await checkAchievements(exerciseDates);
                            await checkBadge(exerciseDates);
                        }
                    }
                }
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        };
        fetchRecords();
    }, [modal])

    const checkBadge = async (dates: string[]) => {
        const consecutiveDays = getConsecutiveDays(dates);

        if (consecutiveDays >= 30) {
            const badgesRef = collection(db, "badges");
            const q = query(badgesRef);
            const querySnapshot = await getDocs(q);

            const badgeDoc = querySnapshot.docs.find(doc => doc.data().뱃지이름 === "연속 30일 운동기록 뱃지");

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
    };

    const checkAchievements = async (dates: string[]) => {
        const consecutiveDays = getConsecutiveDays(dates);

        const achievementsRef = collection(db, 'achievements');
        const q = query(achievementsRef);
        const achievementQuerySnapshot = await getDocs(q);

        const mainAchievementDoc = achievementQuerySnapshot.docs.find(doc => doc.data().도전과제이름 === "연속 운동기록");

        if (mainAchievementDoc) {
            const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
            const subAchievementsSnapshot = await getDocs(subAchievementsRef);

            let subAchievementDoc;
            if (consecutiveDays >= 30) {
                subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "연속 30일 운동기록");
            } else if (consecutiveDays >= 14) {
                subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "연속 14일 운동기록");
            } else if (consecutiveDays >= 7) {
                subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "연속 7일 운동기록");
            }

            if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(user?.uid)) {
                const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                await updateDoc(subAchievementRef, {
                    유저아이디: arrayUnion(user?.uid),
                });
                setAchievementName(subAchievementDoc.data().도전과제이름);
                setShowAchievements(true);
            }
        }
    };
    const getConsecutiveDays = (dates: string[]) => {
        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < dates.length; i++) {
            const currentDate = new Date(dates[i]);
            const previousDate = new Date(dates[i - 1]);

            const diffDays = (currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24);

            if (diffDays === 1) {
                currentStreak += 1;
            } else {
                currentStreak = 1;
            }

            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
        }

        return maxStreak;
    };

    const handleEventClick = (clickInfo: any) => {
        const dateClicked = clickInfo.event.start;
        const clickDate = format(dateClicked, "yyyy-MM-dd");
        setClickDate(clickDate);
        setCalendarClick(true);
    }

    const renderDayCellContent = (dayCellContent: any) => {
        return (
            <div>
                {dayCellContent.dayNumberText.replace('일', '')}
            </div>
        );
    };
    const handleModalConfirm = () => {
        setShowAchievements(false)
    }

    const badgeModalConfirm = () => {
        setShowBadge(false)
    }
    const characterModalConfirm = () => {
        setShowCharacter(false);
    }

    const congratulations = () => {
        setShowCongratulations(true);
        setTimeout(() => {
            setShowCongratulations(false);
        }, 3000);
    }




    return (
        <Wrapper>
            <BtnWrapper>
                <Title>Calendar</Title>
                <Btn onClick={onClick}><span>+</span>운동기록</Btn>
            </BtnWrapper>
            <div style={{ width: '95%', margin: '0 auto', padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={createRecords}
                    headerToolbar={
                        {
                            start: "dayGridMonth",
                            center: 'title',
                            end: 'prev,today,next'
                        }
                    }
                    height={`60vh`}
                    locale={ko}
                    dayCellContent={renderDayCellContent}
                    eventClick={handleEventClick}
                />
            </div>
            {modal ?
                <ExerciseRegistration closeModal={closeModal} congratulations={congratulations} />
                : null}
            {calendarClick && window.innerWidth <= 700 ? (
                <div>
                    <CalendarClickModal setCalendarClick={setCalendarClick} clickDate={clickDate} />
                </div>
            ) : null}
            {calendarClick && window.innerWidth >= 700 ? (
                <div>
                    <CalendarClickModal setCalendarClick={setCalendarClick} clickDate={clickDate} />
                </div>
            ) : null}

            {showAchievements && (
                <AchievementModal achievementName={achievementName} handleModalConfirm={handleModalConfirm} />
            )}
            {showBadge && (
                <BadgeModal badgeImg={badgeImg} badgeName={badgeName} badgeModalConfirm={badgeModalConfirm} />
            )}
            {showCharacter && (
                <CharacterModal
                    characterModalConfirm={characterModalConfirm}
                    characterImage={newCharacterImage}
                    message={congratulationMessage}
                />
            )}
            {showCongratulations && (
                <Congratulations title='운동기록 완료' content='운동기록을 완료하였습니다' />
            )}
        </Wrapper>
    )
}
export default Calendar;