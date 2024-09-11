import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../firebase";
import { collection, doc, getDocs, query } from "firebase/firestore";
import { AiFillFire } from "react-icons/ai";
import { ko } from "date-fns/locale";


const Wrapper = styled.div`
    width:100%;
    height:120px;
    background-color:rgba(25, 35, 67, 0.4);
    margin-bottom:20px;
    padding:20px;
    border-radius:10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const ContentWrapper = styled.div`
    display:flex;
    align-items: center;
    gap:20px;
    width:100%;
    height:80px;
`;
const IconWrapper = styled.div`
    width:60px;
    height:60px;
    background-color:white;
    border-radius:50%;
    svg{
        fill:#FF286F;
        width:50px;
        height:50px;
        margin-top:5px;
        margin-left:5px;
    }
`;
const WeekWrapper = styled.div`
    width:calc(100% - 60px);
`;
const WeekTitle = styled.h3`
    color:#F2F2F2;
    margin:7px 0px 7px 0px;
    font-size:18px;
    font-weight:bold;
`;
const WeekData = styled.div`
    display:flex;
    justify-content: space-between;
`;
const Week = styled.div`
    color:white;
    display:flex;
    flex-direction: column;
    align-items: center;
`;
const WeekIcon = styled.div`
    width:27px;
    height:27px;
    background-color:white;
    border-radius:50%;
    svg{
        width:22px;
        height:22px;
        margin-top:2.5px;
        margin-left:2.5px;
        fill:#FF286F;
    }
`;
const WeekText = styled.div`
    margin-top:5px;
    font-size:16px;
`;


const ThisWeekRecords = () => {
    const currentUser = auth.currentUser;
    const [recordsData, setRecordsData] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                if(!currentUser?.uid){
                    alert("로그인을 확인해주세요")
                    return;
                }

                const recordsDocRefs = doc(db, "records", currentUser?.uid)
                const recordsCollectionRef = collection(recordsDocRefs, "운동기록");

                const querySnapshot = await getDocs(query(recordsCollectionRef))
                const records = querySnapshot.docs.map(doc => doc.id);

                setRecordsData(records)
            } catch (error) {
                console.log(error)
            }
        }
        fetchRecords()
    }, [])

    const weekDates = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 })
    }).map(date => ({
        date: format(date, 'yyyy-MM-dd'),
        day: format(date, 'EEE', { locale: ko })
    }));

    return (
        <Wrapper>
            <ContentWrapper>
                <IconWrapper>
                    <AiFillFire />
                </IconWrapper>
                <WeekWrapper>
                    <WeekTitle>이번주 운동현황</WeekTitle>
                    <WeekData>
                        {weekDates.map(({ date, day }) => (
                            <Week key={date}>
                                <WeekIcon>
                                    {recordsData.includes(date) && <AiFillFire />}
                                </WeekIcon>
                                <WeekText>
                                    {day}
                                </WeekText>
                            </Week>
                        ))}
                    </WeekData>
                </WeekWrapper>
            </ContentWrapper>
        </Wrapper>
    )
}
export default ThisWeekRecords