import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Wrapper = styled.div`
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 90%;
    margin: 20px auto;
`;
const Back = styled.div`
    width: 20px;
    height: 20px;
    margin:20px 0px 0px 20px;
    position:flxed;
    top:0;
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
    margin-bottom: 5px;
    font-size: 18px;
`;
const GoalData = styled.div`
    font-size: 18px;
    color: #555;
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

const InbodyGoals = () => {
    const currentUser = auth.currentUser;
    const [weightData, setWeightData] = useState<any[]>([]);
    const [muscleData, setMuscleData] = useState<any[]>([]);
    const [fatData, setFatData] = useState<any[]>([]);
    const [weightGoal, setWeightGoal] = useState<string>("");
    const [muscleGoal, setMuscleGoal] = useState<string>("");
    const [fatGoal, setFatGoal] = useState<string>("");
    const [goalDocId, setGoalDocId] = useState<string | null>(null);
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
                setFatData(data.filter(item => item.종류 === "fat"));

                const goalsSnapshot = await getDocs(
                    query(collection(db, "inbody-goals"), where("유저아이디", "==", currentUser?.uid))
                );

                if (!goalsSnapshot.empty) {
                    const goalData = goalsSnapshot.docs[0].data();
                    setWeightGoal(goalData.목표몸무게 || "");
                    setMuscleGoal(goalData.목표골격근량 || "");
                    setFatGoal(goalData.목표체지방 || "");
                    setGoalDocId(goalsSnapshot.docs[0].id);
                }

            } catch (error) {
                console.log(error)
            }
        }
        fetchInbody();
    }, [])

    const goalGrowth = (typeData: any[], type: string, goalData: number) => {
        return goalData - Number(typeData[typeData.length - 1][type]);
    }

    const handleCancel = () => {
        if (location.state?.from === 'inbody-details') {
            navigate('/inbody-details');
        } else {
            navigate('/records', { state: { menu: 'inbody' } });
        }
    }

    const saveGoal = async (type: string, goalValue: string, growthData: any[], growthType: string) => {
        try {
            let goalDocRef;
            const growthDirection = goalGrowth(growthData, growthType, Number(goalValue)) > 0 ? "증가" : "감소";
            if (goalDocId) {
                goalDocRef = doc(db, "inbody-goals", goalDocId);
                await updateDoc(goalDocRef, {
                    [`목표${type}`]: goalValue,
                    [`${type}목표`]: growthDirection,
                });
            } else {
                const newGoalDoc = await addDoc(collection(db, "inbody-goals"), {
                    유저아이디: currentUser?.uid,
                    현재몸무게: weightData[weightData.length - 1]?.weight || "",
                    현재골격근량: muscleData[muscleData.length - 1]?.muscle || "",
                    현재체지방: fatData[fatData.length - 1]?.fat || "",
                    목표몸무게: type === "몸무게" ? goalValue : "",
                    몸무게목표: type === "몸무게" ? growthDirection : "",
                    목표골격근량: type === "골격근량" ? goalValue : "",
                    골격근량목표: type === "골격근량" ? growthDirection : "",
                    목표체지방: type === "체지방" ? goalValue : "",
                    체지방목표: type === "체지방" ? growthDirection : "",
                });
                setGoalDocId(newGoalDoc.id);
            }
            setFatGoal("")
            setMuscleGoal("")
            setWeightGoal("")
        } catch (error) {
            console.error("저장된 목표 에러", error);
        }
    }


    return (
        <>
            <Back onClick={handleCancel}>
                <FaArrowLeft style={{ width: "20px", height: "20px" }} />
            </Back>
            <Wrapper>
                <ContentWrapper>
                    <h3>몸무게</h3>
                    <div style={{marginBottom:'10px'}}>
                        <NowData>현재 몸무게: <span>{weightData[weightData.length - 1]?.weight}</span>kg</NowData>
                        {weightGoal !== "" ? (
                            <GoalData>목표 몸무게: <span>{weightGoal}</span>kg</GoalData>
                        ) : null}
                    </div>
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
                    <SubmitButton onClick={() => saveGoal("몸무게", weightGoal, weightData, "weight")}>몸무게 목표 저장</SubmitButton>
                </ContentWrapper>

                <ContentWrapper>
                    <h3>골격근량</h3>
                    <div style={{marginBottom:'10px'}}>
                        <NowData>현재 골격근량: <span>{muscleData[muscleData.length - 1]?.muscle}</span>%</NowData>
                        {muscleGoal !== "" ? (
                            <GoalData>목표 골격근량: <span>{muscleGoal}</span>%</GoalData>
                        ) : null}
                    </div>
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
                    <SubmitButton onClick={() => saveGoal("골격근량", muscleGoal, muscleData, "muscle")}>골격근량 목표 저장</SubmitButton>
                </ContentWrapper>

                <ContentWrapper>
                    <h3>체지방</h3>
                    <div style={{marginBottom:'10px'}}>
                        <NowData>현재 체지방: <span>{fatData[fatData.length - 1]?.fat}</span>%</NowData>
                        {fatGoal !== "" ? (
                            <GoalData>목표 체지방: <span>{fatGoal}</span>%</GoalData>
                        ) : null}
                    </div>
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
                    <SubmitButton onClick={() => saveGoal("체지방", fatGoal, fatData, "fat")}>체지방 목표 저장</SubmitButton>
                </ContentWrapper>
            </Wrapper>
        </>
    )
}
export default InbodyGoals;

