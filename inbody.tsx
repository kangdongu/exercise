import { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from '../firebase'; // Firebase Firestore 관련 기능 불러오기
import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { format } from 'date-fns'; // date-fns에서 format 함수 불러오기
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

const Wrapper = styled.div`
    width:100%;
    height:80vh;
    display:flex;
    gap:0.5%;
`;

const InbodyRecordWrapper = styled.div`
    width:33%;
    height:80vh;
    border:1px solid black;
    box-sizing:border-box;
`;
const LineWrapper = styled.div`
    width:100%;
    margin-top:10vh;
`;
const Form = styled.form`
    margin-top:20px;
`;
const Input = styled.input``;
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) => {
        setValue(e.target.value); // 입력된 값을 해당 상태 변수에 설정
    }

    const getCurrentDate = () => {
        return format(new Date(), "yyyy-MM-dd"); // 현재 날짜를 yyyy-MM-dd 형식으로 가져옴
    }

    const handleSaveWeight = async () => {
        try {
            // Firestore 컬렉션에 체중 데이터 추가
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, // 현재 사용자의 아이디
                날짜: getCurrentDate(), // 현재 날짜
                weight
            });
            console.log("Weight document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding weight document: ", e);
        }
        setWeight("");
    }

    const handleSaveMuscle = async () => {
        try {
            // Firestore 컬렉션에 근육량 데이터 추가
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, // 현재 사용자의 아이디
                날짜: getCurrentDate(), // 현재 날짜
                muscle
            });
            console.log("Muscle document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding muscle document: ", e);
        }
        setMuscle("");
    }

    const handleSaveFat = async () => {
        try {
            // Firestore 컬렉션에 체지방량 데이터 추가
            const docRef = await addDoc(collection(db, 'inbody'), {
                유저아이디: auth.currentUser?.uid, // 현재 사용자의 아이디
                날짜: getCurrentDate(), // 현재 날짜
                fat
            });
            console.log("Fat document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding fat document: ", e);
        }
        setFat("");
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const weightData: WeightData[] = [];
                const muscleData: MuscleData[] = [];
                const fatData: FatData[] = [];
        
                // Firestore에서 데이터 가져오기
                const q = query(collection(db, 'inbody'), where("유저아이디", "==", auth.currentUser?.uid), orderBy("날짜", "asc"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const date = format(new Date(data.날짜), "MM/dd");
                    // weight 필드가 있는 경우에만 데이터를 weightData 배열에 추가
                    if (data.weight) {
                        weightData.push({ x: date, y: data.weight });
                    }
                    // muscle 필드가 있는 경우에만 데이터를 muscleData 배열에 추가
                    if (data.muscle) {
                        muscleData.push({ x: date, y: data.muscle });
                    }
                    // fat 필드가 있는 경우에만 데이터를 fatData 배열에 추가
                    if (data.fat) {
                        fatData.push({ x: date, y: data.fat });
                    }
                    console.log(muscleData)
                });
        
                setWeightData(weightData);
                setMuscleData(muscleData);
                setFatData(fatData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [handleSaveWeight,handleSaveMuscle,handleSaveFat]);

    const onSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
    }


    Chart.register(...registerables);

    return (
        <Wrapper>
            <InbodyRecordWrapper>
                <LineWrapper>
                    <Line height={400}
                        width={600}
                        data={{
                            labels: weightData.map(data => data.x),
                            datasets: [
                                {
                                    label: '몸무게 변화',
                                    data: weightData,
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
                    <Input onChange={(e) => handleInputChange(e, setWeight)} value={weight}></Input>
                    <Button onClick={handleSaveWeight}>체중 입력</Button>
                </Form>
            </InbodyRecordWrapper>
            <InbodyRecordWrapper>
                <LineWrapper>
                    <Line height={400}
                        width={600}
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
                    <Input onChange={(e) => handleInputChange(e, setMuscle)} value={muscle}></Input>
                    <Button onClick={handleSaveMuscle}>근육량 입력</Button>
                </Form>
            </InbodyRecordWrapper>
            <InbodyRecordWrapper>
                <LineWrapper>
                    <Line height={400}
                        width={600}
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
                            responsive: false
                        }}
                    />
                </LineWrapper>
                <Form onSubmit={onSubmit}>
                    <Input onChange={(e) => handleInputChange(e, setFat)} value={fat}></Input>
                    <Button onClick={handleSaveFat}>체지방량 입력</Button>
                </Form>
            </InbodyRecordWrapper>
        </Wrapper>
    )
}