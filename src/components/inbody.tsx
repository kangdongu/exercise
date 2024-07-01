import { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from '../firebase'; // Firebase Firestore 관련 기능 불러오기
import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { format } from 'date-fns'; // date-fns에서 format 함수 불러오기
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

const Wrapper = styled.div`
@media screen and (max-width: 700px) {
    flex-direction: column;
    gap:1%;
    height:165vh;
  }
    width:100%;
    height:80vh;
    display:flex;
    gap:0.5%;
`;

const InbodyRecordWrapper = styled.div`
@media screen and (max-width: 700px) {
    width:100vw;
    height:50vh;
  }
    width:33%;
    height:80vh;
    box-sizing:border-box;
`;
const LineWrapper = styled.div`
@media screen and (max-width:700px) {
    margin-top:1vh;
}
    width:100%;
    margin-top:10vh;
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
    const [chartWidth, setChartWidth] = useState(window.innerWidth >= 700 ? 600 : 350);

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

    useEffect(() => {
        fetchData();
    
        const handleResize = () => {
          setChartWidth(window.innerWidth >= 700 ? 600 : 360);
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, [fetchData]);

    const handleSaveWeight = async () => {
        try {
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, 
                날짜: getCurrentDate(), 
                weight
            });
            console.log("ID로 작성된 체중 문서: ", docRef.id);
        } catch (e) {
            console.error("체중 문서 추가 중 오류 발생: ", e);
        }
        setWeight("");
        fetchData();
    }

    const handleSaveMuscle = async () => {
        try {
            // Firestore 컬렉션에 근육량 데이터 추가
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, // 현재 사용자의 아이디
                날짜: getCurrentDate(), // 현재 날짜
                muscle
            });
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
                유저아이디: auth.currentUser?.uid, // 현재 사용자의 아이디
                날짜: getCurrentDate(), // 현재 날짜
                fat
            });
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


    Chart.register(...registerables);

    return (
        <Wrapper>
            <InbodyRecordWrapper>
                <LineWrapper>
                    <Line height={400}
                        width={chartWidth}
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
                            responsive: false
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
                        width={chartWidth}
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
                            responsive: false
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
                        width={chartWidth}
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
        </Wrapper>
    )
}