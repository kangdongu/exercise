import { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from '../firebase';
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { format } from 'date-fns';
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import AchievementModal from "./achievement-alert";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
    flex-direction: column;
    gap:1%;
  }
    width:100%;
    overflow-y:scroll;
    height:calc(100vh - 105px);
    display:flex;
    gap:0.5%;
`;

const InbodyRecordWrapper = styled.div`
    width:90vw;
    margin-bottom:20px;
    box-sizing:border-box;
    padding:10px 0px;
`;
const LineWrapper = styled.div`
    width:100%;
`;

const Form = styled.form`
    margin-top:20px;
    padding-left:20px;
    display:flex;
    width:100%;
    align-items: center;
`;
const Input = styled.input`
    border-radius:5px;
`;
const Button = styled.button`
    margin-left:10px;
`;
const Details = styled.div`
    margin-left:auto;
    font-size:14px;
    border:1px solid black;
    padding: 3px 5px;
`;

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
    const navigate = useNavigate();
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

            const q = query(collection(db, 'inbody'), where("유저아이디", "==", currentUser?.uid), orderBy("날짜", "asc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const date = format(new Date(data.날짜), "MM/dd");
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
                weight,
                종류:'weight'
            });
            const achievementsRef = collection(db, 'achievements');
            const q = query(achievementsRef);
            const querySnapshot = await getDocs(q);

            const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 인바디 입력");

            if (mainAchievementDoc) {
                const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                const subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "몸무게 입력");

                if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                    const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                    await updateDoc(subAchievementRef, {
                        유저아이디: [...subAchievementDoc.data().유저아이디, auth.currentUser?.uid]
                    });
                    setAchievementName(subAchievementDoc.data().도전과제이름);
                    setShowAchievements(true);
                }
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
                muscle,
                종류:'muscle'
            });
            const achievementsRef = collection(db, 'achievements');
            const q = query(achievementsRef);
            const querySnapshot = await getDocs(q);

            const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 인바디 입력");

            if (mainAchievementDoc) {
                const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                const subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "골격근량 입력");

                if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                    const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                    await updateDoc(subAchievementRef, {
                        유저아이디: [...subAchievementDoc.data().유저아이디, auth.currentUser?.uid]
                    });
                    setAchievementName(subAchievementDoc.data().도전과제이름);
                    setShowAchievements(true);
                }
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
                fat,
                종류:'fat'
            });
            const achievementsRef = collection(db, 'achievements');
            const q = query(achievementsRef);
            const querySnapshot = await getDocs(q);

            const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 인바디 입력");

            if (mainAchievementDoc) {
                const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                const subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "체지방 입력");

                if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(auth.currentUser?.uid)) {
                    const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                    await updateDoc(subAchievementRef, {
                        유저아이디: [...subAchievementDoc.data().유저아이디, auth.currentUser?.uid]
                    });
                    setAchievementName(subAchievementDoc.data().도전과제이름);
                    setShowAchievements(true);
                }
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

    const detailsMemory = (type: string) => {
        navigate('/inbody-details', { state: { type } });
    }

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
                                    tension: 0.3
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                colors: {
                                    forceOverride: true
                                }
                            }
                        }}
                    />
                </LineWrapper>
                <Form onSubmit={onSubmit}>
                    <Input onChange={(e) => handleInputChange(e, setWeight)} value={weight} placeholder="몸무게를 입력해주세요"></Input>
                    <Button onClick={handleSaveWeight}>완료</Button>
                    <Details onClick={() => {detailsMemory("weight")}}>자세히보기</Details>
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
                                    tension: 0.3,
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                colors: {
                                    forceOverride: true
                                }
                            },
                        }}

                    />
                </LineWrapper>
                <Form onSubmit={onSubmit}>
                    <Input onChange={(e) => handleInputChange(e, setMuscle)} value={muscle} placeholder="골격근량을 입력해주세요"></Input>
                    <Button onClick={handleSaveMuscle}>완료</Button>
                    <Details onClick={() => {detailsMemory("muscle") }}>자세히보기</Details>
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
                                    tension: 0.3
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                colors: {
                                    forceOverride: true
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 10,
                                        maxRotation: 0,
                                        minRotation: 0
                                    }
                                },
                            }
                        }}
                    />
                </LineWrapper>
                <Form onSubmit={onSubmit}>
                    <Input onChange={(e) => handleInputChange(e, setFat)} value={fat} placeholder="체지방을 입력해주세요"></Input>
                    <Button onClick={handleSaveFat}>완료</Button>
                    <Details onClick={() => {detailsMemory("fat") }}>자세히보기</Details>
                </Form>
            </InbodyRecordWrapper>
            {showAchievements ? (
                <AchievementModal handleModalConfirm={handleModalConfirm} achievementName={achievementName} />
            ) : null}
        </Wrapper>
    )
}