import { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from '../firebase'; // Firebase Firestore 관련 기능 불러오기
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { format } from 'date-fns'; // date-fns에서 format 함수 불러오기
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import AchievementModal from "./achievement-alert";

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
    flex-direction: column;
    gap:1%;
  }
    width:100%;
    overflow-y:scroll;
    height:calc(100vh - 130px);
    display:flex;
    gap:0.5%;
`;

const InbodyRecordWrapper = styled.div`
    width:90vw;
    margin-bottom:20px;
    box-sizing:border-box;
`;
const LineWrapper = styled.div`
    width:100%;
`;

const Form = styled.form`
    margin-top:20px;
`;
const Input = styled.input`
    border-radius:5px;
`;
const Button = styled.button``;


interface WeightData {
    x: string;
    y: number;
}

interface MuscleData {
    x: string;
    y: number;
}

interface FatData {
    x: string;
    y: number;
}

export default function Inbody() {
    const [weight, setWeight] = useState("");
    const [muscle, setMuscle] = useState("");
    const [fat, setFat] = useState("");
    const [weightData, setWeightData] = useState<WeightData[]>([]);
    const [muscleData, setMuscleData] = useState<MuscleData[]>([]);
    const [fatData, setFatData] = useState<FatData[]>([]);
    const [showAchievements, setShowAchievements] = useState(false) 
    const [achievementName, setAchievementName] = useState("")
    const currentUser = auth.currentUser;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) => {
        setValue(e.target.value); 
    }

    const getCurrentDate = () => {
        return format(new Date(), "yyyy-MM-dd HH:mm");
    }

    const fetchData = async () => {
        try {
            const weightData: WeightData[] = [];
            const muscleData: MuscleData[] = [];
            const fatData: FatData[] = [];

            const q = query(collection(db, 'inbody'), where("유저아이디", "==", auth.currentUser?.uid), orderBy("날짜", "asc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const date = format(new Date(data.날짜), "MM/dd HH:mm");
                if (data.weight) {
                    weightData.push({ x: date, y: data.weight });
                }
                if (data.muscle) {
                    muscleData.push({ x: date, y: data.muscle });
                }
                if (data.fat) {
                    fatData.push({ x: date, y: data.fat });
                }
            });

            weightData.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
            muscleData.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
            fatData.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

            setWeightData(weightData);
            setMuscleData(muscleData);
            setFatData(fatData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleSaveWeight = async () => {
        try {
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, 
                날짜: getCurrentDate(), 
                weight
            });
            const achievementsRef = collection(db, 'achievements');
            const q = query(achievementsRef);
            const querySnapshot = await getDocs(q);
    
            const achievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "몸무게 입력 완료");
    
            if (achievementDoc && !achievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                const achievementRef = doc(db, 'achievements', achievementDoc.id);
                await updateDoc(achievementRef, {
                    유저아이디: [...achievementDoc.data().유저아이디, currentUser?.uid]
                });
                setAchievementName(achievementDoc.data().도전과제이름);
                setShowAchievements(true);
            }
            console.log("ID로 작성된 체중 문서: ", docRef.id);
        } catch (e) {
            console.error("체중 문서 추가 중 오류 발생: ", e);
        }
        setWeight("");
        fetchData();
    }

    const handleSaveMuscle = async () => {
        try {
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, 
                날짜: getCurrentDate(),
                muscle
            });
            const achievementsRef = collection(db, 'achievements');
            const q = query(achievementsRef);
            const querySnapshot = await getDocs(q);
    
            const achievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "골격근량 입력 완료");
    
            if (achievementDoc && !achievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                const achievementRef = doc(db, 'achievements', achievementDoc.id);
                await updateDoc(achievementRef, {
                    유저아이디: [...achievementDoc.data().유저아이디, currentUser?.uid]
                });
                setAchievementName(achievementDoc.data().도전과제이름);
                setShowAchievements(true);
            }
            console.log("ID로 작성된 무게 문서: ", docRef.id);
        } catch (e) {
            console.error("근육 문서를 추가하는 중 오류 발생: ", e);
        }
        setMuscle("");
        fetchData();
    }

    const handleSaveFat = async () => {
        try {
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, 
                날짜: getCurrentDate(),
                fat
            });
            const achievementsRef = collection(db, 'achievements');
            const q = query(achievementsRef);
            const querySnapshot = await getDocs(q);
    
            const achievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "체지방 입력 완료");
    
            if (achievementDoc && !achievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                const achievementRef = doc(db, 'achievements', achievementDoc.id);
                await updateDoc(achievementRef, {
                    유저아이디: [...achievementDoc.data().유저아이디, currentUser?.uid]
                });
                setAchievementName(achievementDoc.data().도전과제이름);
                setShowAchievements(true);
            }
            console.log("ID로 작성된 무게 문서: ", docRef.id);
        } catch (e) {
            console.error("문서 추가 중 오류 발생: ", e);
        }
        setFat("");
        fetchData();
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    const handleModalConfirm = () => {
        setShowAchievements(false)
    }


    Chart.register(...registerables);

    return (
        <Wrapper>
            <InbodyRecordWrapper>
                <LineWrapper>
                    <Line height={400}
                        data={{
                            labels: weightData.map(data => data.x),
                            datasets: [
                                {
                                    label: '몸무게 변화',
                                    data: weightData,
                                    fill: false,
                                    type: "line",
                                    borderColor: '#FF0000',
                                    tension: 0.1
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio:true
                        }}
                    />
                </LineWrapper>
                <Form onSubmit={onSubmit}>
                    <Input onChange={(e) => handleInputChange(e, setWeight)} value={weight} placeholder="몸무게를 입력해주세요"></Input>
                    <Button onClick={handleSaveWeight}>완료</Button>
                </Form>
            </InbodyRecordWrapper>
            <InbodyRecordWrapper>
                <LineWrapper>
                    <Line height={400}
                        data={{
                            labels: muscleData.map(data => data.x),
                            datasets: [
                                {
                                    label: '골격근량 변화',
                                    data: muscleData,
                                    fill: false,
                                    type: "line",
                                    borderColor: 'rgb(75, 192, 192)',
                                    tension: 0.1
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio:true
                        }}
                    />
                </LineWrapper>
                <Form onSubmit={onSubmit}>
                    <Input onChange={(e) => handleInputChange(e, setMuscle)} value={muscle} placeholder="골격근량을 입력해주세요"></Input>
                    <Button onClick={handleSaveMuscle}>완료</Button>
                </Form>
            </InbodyRecordWrapper>
            <InbodyRecordWrapper>
                <LineWrapper>
                    <Line height={400}
                        data={{
                            labels: fatData.map(data => data.x),
                            datasets: [
                                {
                                    label: '체지방 변화',
                                    data: fatData,
                                    fill: false,
                                    type: "line",
                                    borderColor: 'rgb(75, 192, 192)',
                                    tension: 0.1
                                }
                            ]
                        }}
                        options={{
                            responsive: false,
                            maintainAspectRatio:true,
                            scales: {
                                x: {
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 10, 
                                        maxRotation: 0, 
                                        minRotation: 0 
                                    }
                                }
                            }
                        }}
                    />
                </LineWrapper>
                <Form onSubmit={onSubmit}>
                    <Input onChange={(e) => handleInputChange(e, setFat)} value={fat} placeholder="체지방을 입력해주세요"></Input>
                    <Button onClick={handleSaveFat}>완료</Button>
                </Form>
            </InbodyRecordWrapper>
            {showAchievements ? (
                <AchievementModal handleModalConfirm={handleModalConfirm} achievementName={achievementName} /> 
            ):null}
        </Wrapper>
    )
}