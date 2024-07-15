import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { arrayUnion, collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import ExerciseRegistration from './records-registration';
import './calendar.css'
import CalendarClickModal from './calendar-click-component';
import { format } from 'date-fns';
import MoCalendarWrapper from '../slideModal/mo-calendar-click';
import { ko } from 'date-fns/locale';
import AchievementModal from '../achievement-alert';


const Wrapper = styled.div`
    width: 80%;
    height:80vh;
    margin: 0 auto;
    overflow:hidden;
    @media screen and (max-width: 700px) {
        width: 100%;
        margin: 0 auto;
    }
`;
const Button = styled.div`
    width:30px;
    height:30px;
    border-radius:50%;
    font-size:40px;
    text-align:center;
    line-height:20px;
    color:red;
    @media screen and (max-width: 700px) {
        font-size:30px;
    }
`;
const Btn = styled.div`
    display:flex;
    font-size:18px;
    cursor:pointer;
    float:right;
    &:hover{
        color:red;
    }
`;
const BtnWrapper = styled.div`
    width:100%;
    height:40px;
    font-size:24px;
    border-bottom: 1px solid gray;
    margin-bottom:10px;
`;

interface ExerciseData {
    종류: string;
    횟수?: string;
    무게?: string;
    날짜: string;
}

export default function Calendar() {
    const [calendarClick, setCalendarClick] = useState(false);
    const [clickDate, setClickDate] = useState<string>("");
    const [modal, setModal] = useState(false)
    const [achievementName, setAchievementName] = useState("")
    const [showAchievements, setShowAchievements] = useState(false)
    const [createRecords, setCreateRecords] = useState<{ title: string; date: any }[]>([]);
    const user = auth.currentUser;

    const onClick = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false);
    }

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                if (user) {
                    const currentUserUID = user.uid;
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
                        console.log("Fetched exercise dates: ", exerciseDates);

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

                            await checkAchievements(exerciseDates);

                        }
                    }
                }
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        }
        fetchRecords();
    }, [modal]);

    const checkAchievements = async (dates: string[]) => {
        console.log("Checking achievements for dates: ", dates);
        const consecutiveDays = getConsecutiveDays(dates);
        console.log("Consecutive days: ", consecutiveDays);

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

            if (subAchievementDoc) {
                console.log("Found sub-achievement doc: ", subAchievementDoc.data());
            }

            if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(user?.uid)) {
                const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                await updateDoc(subAchievementRef, {
                    유저아이디: arrayUnion(user?.uid),
                });
                setAchievementName(subAchievementDoc.data().도전과제이름);
                setShowAchievements(true);
                console.log(consecutiveDays)
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


    return (
        <Wrapper>
            <BtnWrapper>
                <Btn onClick={onClick}>운동기록하기<Button>+</Button></Btn>
            </BtnWrapper>
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
                height={`70vh`}
                locale={ko}
                dayCellContent={renderDayCellContent}
                eventClick={handleEventClick}
            />
            {modal ? <ExerciseRegistration closeModal={closeModal} /> : null}
            {calendarClick && window.innerWidth <= 700 ? (
                <MoCalendarWrapper onClose={() => setCalendarClick(false)}>
                    <CalendarClickModal setCalendarClick={setCalendarClick} clickDate={clickDate} />;
                </MoCalendarWrapper>
            ) : null}
            {calendarClick && window.innerWidth >= 700 ? <CalendarClickModal setCalendarClick={setCalendarClick} clickDate={clickDate} /> : null}
            {showAchievements && (
                <AchievementModal achievementName={achievementName} handleModalConfirm={handleModalConfirm} />
            )}
        </Wrapper>
    )
}