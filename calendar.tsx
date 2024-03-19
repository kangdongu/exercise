import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ExerciseRegistration from './records-registration';


const Wrapper = styled.div`
    width: 80%;
    height:800px;
    margin: 0 auto;
`;
const Button = styled.div`
    width:30px;
    height:30px;
    border-radius:50%;
    font-size:40px;
    text-align:center;
    line-height:20px;
    color:red;
`;
const Btn = styled.div`
    display:flex;
    font-size:24px;
    cursor:pointer;
    float:right;
`;
const BtnWrapper = styled.div`
    width:100%;
    height:30px;
    font-size:24px;
    border-bottom: 1px solid gray;
    margin-bottom:10px;
`;

export default function Calendar() {
    
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
                        const userEvents = querySnapshot.docs.map((doc) => ({
                            title: `${doc.data().종류} ${doc.data().횟수 || ''}개 ${doc.data().무게 || ''}kg`,
                            date: doc.data().날짜
                        }));
                        setCreateRecords(userEvents);
                    }
                }
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        }
        fetchRecords();
    }, [modal])
    return (
        <Wrapper>
            <BtnWrapper>기록
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
                height={`100vh`}
            />
        {modal ? <ExerciseRegistration closeModal={closeModal} /> : null}
        </Wrapper>
    )
}