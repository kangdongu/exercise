import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 90%;
    margin: 20px auto;
`;
const ContentWrapper = styled.div`
    background-color: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    h3{
        margin-top:10px;
    }
`;

const NowData = styled.div`
    margin-bottom: 10px;
    font-size: 18px;
`;

const GoalInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
`;

const Result = styled.div<{ increase: boolean }>`
    font-size: 16px;
    color: ${props => (props.increase ? 'green' : 'red')};
    margin-top: 5px;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #36A2EB;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    display: block;
    margin: 0 auto;

    &:hover {
        background-color: #0056b3;
    }
`;
const ButtonWrapper = styled.div`
    width:100%;
    display: flex;
    justify-content: space-around;
    gap:15px;
`;
const Button = styled.div`
    width: 30%;
    padding: 7px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    text-align:center;
`;

const InbodyGoals = () => {
    const currentUser = auth.currentUser;
    const [weightData, setWeightData] = useState<any[]>([]);
    const [muscleData, setMuscleData] = useState<any[]>([]);
    const [fatData, setFatData] = useState<any[]>([]);
    const [weightGoal, setWeightGoal] = useState<string>("");
    const [muscleGoal, setMuscleGoal] = useState<string>("");
    const [fatGoal, setFatGoal] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchInbody = async () => {
            try {
                const inbodyRefs = collection(db, "inbody");
                const querySnapshot = await getDocs(
                    query(inbodyRefs, where("유저아이디", "==", currentUser?.uid), orderBy("날짜", "asc")),
                )
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        ...docData,
                        날짜: new Date(docData.날짜),
                        종류: docData.종류,
                    };
                });
                setWeightData(data.filter(item => item.종류 === "weight"));
                setMuscleData(data.filter(item => item.종류 === "muscle"))
                setFatData(data.filter(item => item.종류 === "fat"))
            } catch (error) {
                console.log(error)
            }
        }
        fetchInbody();
    }, [])

    const goalGrowth = (typeData:any[], type:string, goalData:number) => {
        return goalData - Number(typeData[typeData.length - 1][type]);
    }

    const handleCancel = () => {
        if (location.state?.from === 'inbody-details') {
            navigate('/inbody-details');
        } else {
            navigate('/records', { state: { menu: 'inbody' } });
        }
    }

    return (
        <Wrapper>
            <ContentWrapper>
                <h3>몸무게</h3>
                <NowData>현재 몸무게: <span>{weightData[weightData.length - 1]?.weight}</span>kg</NowData>
                <GoalInput
                    type="number"
                    placeholder="몸무게 목표 (kg)"
                    value={weightGoal}
                    onChange={(e) => setWeightGoal(e.target.value)}
                />
               {weightGoal !== "" && (
                    <Result increase={goalGrowth(weightData, "weight", Number(weightGoal)) > 0}>
                        {goalGrowth(weightData, "weight", Number(weightGoal)) > 0 ? "증량" : "감량"} {goalGrowth(weightData, "weight", Number(weightGoal))} kg
                    </Result>
                )}
                <SubmitButton>몸무게 목표 저장</SubmitButton>
            </ContentWrapper>

            <ContentWrapper>
                <h3>골격근량</h3>
                <NowData>현재 골격근량: <span>{muscleData[muscleData.length - 1]?.muscle}</span>%</NowData>
                <GoalInput
                    type="number"
                    placeholder="골격근량 목표 (%)"
                    value={muscleGoal}
                    onChange={(e) => setMuscleGoal(e.target.value)}
                />
                {muscleGoal !== "" && (
                    <Result increase={goalGrowth(muscleData, "muscle", Number(muscleGoal)) > 0}>
                        {goalGrowth(muscleData, "muscle", Number(muscleGoal)) > 0 ? "증가" : "감소"} {goalGrowth(muscleData, "muscle", Number(muscleGoal))} %
                    </Result>
                )}
                <SubmitButton>골격근량 목표 저장</SubmitButton>
            </ContentWrapper>

            <ContentWrapper>
                <h3>체지방</h3>
                <NowData>현재 체지방: <span>{fatData[fatData.length - 1]?.fat}</span>%</NowData>
                <GoalInput
                    type="number"
                    placeholder="체지방 목표 (%)"
                    value={fatGoal}
                    onChange={(e) => setFatGoal(e.target.value)}
                />
                {fatGoal !== "" && (
                    <Result increase={goalGrowth(fatData, "fat", Number(fatGoal)) < 0}>
                        {goalGrowth(fatData, "fat", Number(fatGoal)) < 0 ? "감소" : "증가"} {goalGrowth(fatData, "fat", Number(fatGoal))} %
                    </Result>
                )}
                <SubmitButton>체지방 목표 저장</SubmitButton>
            </ContentWrapper>
            <ContentWrapper>
                <ButtonWrapper>
                    <Button onClick={handleCancel}>취소</Button>
                    <Button style={{ backgroundColor: '#4caf50' }}>저장</Button>
                </ButtonWrapper>
            </ContentWrapper>
        </Wrapper>
    )
}
export default InbodyGoals;

