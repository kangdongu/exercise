import styled from "styled-components"
import MoSlideModal from "../slideModal/mo-slide-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, doc, getDocs, query } from "firebase/firestore";
import { format } from "date-fns";
import CalendarClickModal from "../calendar/calendar-click-component";

const Wrapper = styled.div`
    width:100%;
    margin:0px auto;
    height:calc(100vh - 80px);
    background-color: #f8f8f8;
    overflow-y:scroll;
    padding:20px 0px;
`;
const ContentWrapper = styled.div`
    width: 90%;
    margin: 0 auto;
`;
const Date = styled.span`

`;
const DataWrapper = styled.div`

`;
const DataContentWrapper = styled.span`

`;

interface ExerciseData {
    date: string;
    exercises: { type: string }[];
}

const ExerciseDataContent = () => {
    const navigate = useNavigate();
    const [exerciseData, setExerciseData] = useState<ExerciseData[]>([])
    const [dataDetailsModal, setDataDetailsModal] = useState<boolean>(false)
    const [detailDate, setDetailDate] = useState<string>("")
    const currentUser = auth.currentUser;
    const location = useLocation();
    const [getDate, setGetDate] = useState(false)

    useEffect(() => {
        if (location.state?.getDate) {
            setGetDate(true);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchExerciseRecords = async () => {
            try {
                const currentUserUID = currentUser?.uid;
                if (!currentUserUID) {
                    alert("로그인을 확인해주세요")
                    return;
                }
                const recordsDocRef = doc(db, "records", currentUserUID);

                const recordsCollectionRef = collection(recordsDocRef, "운동기록");

                const recordsQuerySnapshot = await getDocs(query(recordsCollectionRef));

                let exerciseDate: string[] = []

                if (!recordsQuerySnapshot.empty) {
                    const recordUniqueDates = new Set<string>();

                    recordsQuerySnapshot.forEach((doc) => {
                        const date = doc.id
                        recordUniqueDates.add(date)
                    })
                    const recordUniqueDatesArray = Array.from(recordUniqueDates);
                    exerciseDate.push(...recordUniqueDatesArray)
                }

                const allExercises: ExerciseData[] = [];

                for (const date of exerciseDate) {
                    const recordsCollectionRef = doc(collection(recordsDocRef, "운동기록"), date);
                    const exerciseCollectionRef = collection(recordsCollectionRef, "exercises");
                    const exercisesQuerySnapshot = await getDocs(exerciseCollectionRef)

                    if (!exercisesQuerySnapshot.empty) {
                        const exercises = exercisesQuerySnapshot.docs.map((doc) => ({ type: doc.data().운동부위 }));
                        const filterExercises = Array.from(new Set(exercises.map(ex => ex.type))).map(type => exercises.find(ex => ex.type === type) || { type: '' });
                        allExercises.push({ date, exercises: filterExercises });
                    }
                }
                setExerciseData(allExercises);
            } catch (error) {
                console.log(`데이터를 가져올 수 없습니다.: ${error}`)
            }
        }
        fetchExerciseRecords()
    }, [])

    const dataDetails = (date: string) => {
        setDetailDate(date);
        setDataDetailsModal(true);
    }
    const backNavigate = () => {
        if (getDate) {
            navigate("/exercise-choice")
        } else {
            navigate("/")
        }
    }
    const formattedDate = (date: string) => {
        const formatdate = format(date, "yyyy년 MM월 dd일")
        return formatdate;
    }

    return (
        <MoSlideModal onClose={backNavigate}>
            <Wrapper>
                <ContentWrapper>
                    {exerciseData.map((item, index) => (
                        <DataWrapper key={index}>
                            <div style={{ textAlign: 'center' }}>
                                <Date>{formattedDate(item.date)}</Date>
                            </div>
                            <div onClick={() => dataDetails(item.date)} style={{ borderRadius:'7px', backgroundColor: 'white', height: '90px', padding: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                                <h3 style={{margin:'0',marginBottom:'10px'}}>{formattedDate(item.date)}</h3>
                                {item.exercises.map((exercise, exIndex) => (
                                    <DataContentWrapper key={exIndex}>
                                        <span>{exercise.type} </span>
                                    </DataContentWrapper>
                                ))}
                            </div>
                        </DataWrapper>
                    ))}
                </ContentWrapper>
                {dataDetailsModal && (
                    <CalendarClickModal setCalendarClick={() => setDataDetailsModal(false)} clickDate={detailDate} getData={true} />
                )}
            </Wrapper>
        </MoSlideModal>
    )
}
export default ExerciseDataContent