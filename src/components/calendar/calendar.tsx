import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ExerciseRegistration from './records-registration';
import './calendar.css'
import CalendarClickModal from './calendar-click-component';
import { format } from 'date-fns';
import MoCalendarWrapper from '../slideModal/mo-calendar-click';
import { ko } from 'date-fns/locale';


const Wrapper = styled.div`
    width: 80%;
    height:80vh;
    margin: 0 auto;
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

    const onClick = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false);
    }
    const user = auth.currentUser;
    const [createRecords, setCreateRecords] = useState<{ title: string; date: any }[]>([]);
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                if (user) {
                    const currentUserUID = user.uid;
                    const recordsCollectionRef = collection(db, "records");
                    const querySnapshot = await getDocs(query(recordsCollectionRef, where("유저아이디", "==", currentUserUID)));

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
                    }
                }
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        }
        fetchRecords();
    }, [modal]);

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
        </Wrapper>
    )
}