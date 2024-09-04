import Calendar, { CalendarProps } from "react-calendar";
import styled from "styled-components"
import 'react-calendar/dist/Calendar.css';
import "./test-calendar.css"
import { useEffect, useState } from "react";
import { format, isSaturday, isSunday } from "date-fns";
import ExerciseRegistration from "./records-registration";
import { auth, db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Congratulations from "../congratulations";
import ChoiceData from "./choice-data";

const Wrapper = styled.div`
    margin: 0 auto;
    width:100%;
    height:calc(100vh - 117px);
    background-color: #f8f8f8;
`;
const CalenderWrapper = styled.div`
    margin: 0 auto;
    width:90%;
    margin-bottom:20px;
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
    height: 8px;
    width: 8px;
    background-color: #f87171;
    border-radius: 50%;
    display: flex;
    margin-left: 1px;
`;


const TestCalendar = () => {
    const currentUser = auth.currentUser;
    const [value, setValue] = useState<Date | [Date, Date] | null>(new Date());
    const [modal, setModal] = useState(false);
    const [showCongratulations, setShowCongratulations] = useState(false)
    const [eventDate, setEventDate] = useState<string[]>([])
    const [clickDate, setClickDate] = useState<string>("")

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const userCollectionRef = collection(db, "user");
                const userQuerySnapshot = await getDocs(query(userCollectionRef, where("유저아이디", "==", currentUser?.uid)));

                if (!userQuerySnapshot.empty) {
                    // const userDoc = userQuerySnapshot.docs[0];
                    // const gender = userDoc.data().성별;
                    const recordsCollectionRef = collection(db, "records");
                    const querySnapshot = await getDocs(query(recordsCollectionRef, where("유저아이디", "==", currentUser?.uid), orderBy("날짜", "asc")));

                    if (!querySnapshot.empty) {
                        const uniqueDates = new Set<string>(); // 날짜 타입을 명시적으로 지정

                        querySnapshot.forEach((doc) => {
                            const date = doc.data().날짜;
                            uniqueDates.add(date);
                        });

                        // Set 객체를 배열로 변환하고 상태에 저장
                        const uniqueDateArray = Array.from(uniqueDates);
                        setEventDate(uniqueDateArray);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchRecords()
    }, [])

    const onChange: CalendarProps["onChange"] = (value) => {
        if (value instanceof Date || (Array.isArray(value) && value.length === 2 && value.every(v => v instanceof Date))) {
          setValue(value as Date | [Date, Date]); // 타입이 확실하므로 as를 사용해 안전하게 변환
        } else {
          setValue(null); // value가 null인 경우도 처리
        }
    
        if (value instanceof Date) {
          const formattedDate = format(value, "yyyy-MM-dd");
          setClickDate(formattedDate);
        } else if (Array.isArray(value) && value.length === 2 && value[0] instanceof Date) {
          const formattedDate = format(value[0], "yyyy-MM-dd");
          setClickDate(formattedDate);
        }
      };
    

    const onClick = () => {
        setModal(true);
    };
    const closeModal = () => setModal(false);

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
                            if (eventDate.includes(formattedDate)) {
                                return 'react-calendar__tile--has-event';
                            }
                            if (isSaturday(date)) {
                                return 'react-calendar__tile--saturday';
                            }
                            if (isSunday(date)) {
                                return 'react-calendar__tile--sunday';
                            }
                        }
                        return null;
                    }}
                    tileContent={({ date }) => {
                        let html = []
                        if (eventDate.find((x) => x === format(date, "yyyy-MM-dd"))) {
                            html.push(<Dot></Dot>)
                        } else {
                            html.push(<div style={{ height: '8px' }} />)
                        }
                        return (
                            <>
                                <div style={{display:'flex', justifyContent:'center'}}>
                                    {html}
                                </div>
                            </>
                        )

                    }}
                />
            </CalenderWrapper>
            {modal ?
                <ExerciseRegistration closeModal={closeModal} congratulations={congratulations} />
                : null}
            {showCongratulations && (
                <Congratulations title='운동기록 완료' content='운동기록을 완료하였습니다' />
            )}
            <ChoiceData clickDate={clickDate} />
        </Wrapper>
    )
}
export default TestCalendar