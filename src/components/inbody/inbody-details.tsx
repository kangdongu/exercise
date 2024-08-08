import { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { format } from "date-fns";
import { Line } from "react-chartjs-2";

const Wrapper = styled.div`
    width:100vw;
    padding:20px;
    padding-top:0px;
`;
const Back = styled.div`
    width: 20px;
    height: 20px;
    margin:10px 0px;
    position:flxed;
    top:0;
`;
const Menu = styled.div`
    display:flex;
    margin-bottom:20px;
`;
const MenuItem = styled.div<{ selected: boolean }>`
    width:25%;
    text-align:center;
    font-weight:bold;
    border-bottom:1px solid #939393;
    height:30px;
    color: ${props => props.selected ? "red" : "#939393"}
`;
const ContentWrapper = styled.div`
    width:100%;
    background-color:#f8f8f8;
    padding:10px 0px;
`;
const Content = styled.div`
    width:95%;
    margin:0 auto;
`;
const InbodyGrowthWrapper = styled.div`
    display:flex;
`;
const RecordItem = styled.div`
    padding: 10px 20px;
    width:100%;
    margin: 0 auto;
    border-bottom: 1px solid #e0e0e0;
    background-color:white;
    &:last-child {
        border-bottom: none;
    }
`;
const RecordDate = styled.div`
    font-size: 14px;
    color: #888;
`;
const RecordValue = styled.div`
    font-size: 16px;
    margin-top: 5px;
    span{
        font-size:18px;
    }
`;
const GrowthValue = styled.div`
    font-size: 20px;
    margin-left:auto;
    margin-top: 5px;
`;
const NowData = styled.div`
    width:100%;
    height:60px;
    margin: 0 auto;
    background-color:white;
    padding:0px 20px;
    display:flex;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius:7px;
    margin-bottom:10px;
    span{
        font-size:28px;
        margin-left:auto;
    }
`;
const TotalNowDataWrapper = styled.div`
    width:100%;
    height:100px;
    display:flex;
    justify-content: space-between;
`;
const TotalNowData = styled.div`
    width:100px;
    height:100px;
    background-color:white;
    border-radius:10px;
    text-align:center;
    padding:10px 0px;
    h5{
        font-size:14px;
        margin:0;
        margin-bottom:5px;
    }
        span{
            font-size:28px;
        }
`;
const LineWrapper = styled.div`
    width:100%;
    height:150px;
    border-radius:10px;
    background-color:white;
`;
const NowGrowth = styled.div`
    color:white;
    width: 85%;
    margin: 0 auto;
    padding: 2px 0px;
`;
const GoalWrapper = styled.div`
    background-color:white;
    display:flex;
    align-items: center;
    text-align:center;
    height:100px;
    padding: 10px;
    gap:5px;
    margin-bottom:10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex-direction: column;
`;
const BarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width:100%;
    height:100%;
`;
const BarGoal = styled.div`
    width:100%;
    background-color:lightgray;
    height:25px;
    position:relative;
    border-radius: 12px;
    overflow:hidden;
`;
const Bar = styled.div<{ width: number }>`
    position:absolute;
    top:0;
    left:0;
    height:100%;
    background-color:red;
    border-radius: 12px;
    width: ${props => props.width}px;
`;
const ValueWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    margin-bottom: 5px;
`;


const InbodyDetails = () => {
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [inbodyData, setInbodyData] = useState<any[]>([]);
    const [weightData, setWeightData] = useState<any[]>([]);
    const [muscleData, setMuscleData] = useState<any[]>([]);
    const [fatData, setFatData] = useState<any[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [weightWidth, setWeightWidth] = useState<number>(0)
    const [weightPercent, setWeightPercent] = useState<number>(0)
    const [muscleWidth, setMuscleWidth] = useState<number>(0)
    const [musclePercent, setMusclePercent] = useState<number>(0)
    const [fatWidth, setFatWidth] = useState<number>(0)
    const [fatPercent, setFatPercent] = useState<number>(0)
    const [beforeWeight, setBeforeWeight] = useState("")
    const [beforeMuscle, setBeforeMuscle] = useState("")
    const [beforeFat, setBeforeFat] = useState("")
    const [afterWeight, setAfterWeight] = useState("")
    const [afterMuscle, setAfterMuscle] = useState("")
    const [afterFat, setAfterFat] = useState("")
    const BarGoalRef = useRef<HTMLDivElement>(null);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (location.state && location.state.type) {
            setSelectedMenu(location.state.type)
        }
    }, [])

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
                setInbodyData(data);
                setWeightData(data.filter(item => item.종류 === "weight"));
                setMuscleData(data.filter(item => item.종류 === "muscle"))
                setFatData(data.filter(item => item.종류 === "fat"))
            } catch (error) {
                console.error("Error fetching inbody data: ", error);
            }
        };

        fetchInbody();
    }, [])
    useEffect(() => {
        const fetchInbodyGoals = async () => {
            try {
                const goalsRefs = collection(db, "inbody-goals");
                const querySnapshot = await getDocs(
                    query(goalsRefs, where("유저아이디", "==", currentUser?.uid))
                )
                if (!querySnapshot.empty) {
                    const goalsRef = querySnapshot.docs[0]
                    setBeforeWeight(goalsRef.data().현재몸무게)
                    setBeforeMuscle(goalsRef.data().현재골격근량)
                    setBeforeFat(goalsRef.data().현재체지방)
                    setAfterWeight(goalsRef.data().목표몸무게)
                    setAfterMuscle(goalsRef.data().목표골격근량)
                    setAfterFat(goalsRef.data().목표체지방)
                }

            } catch (error) {
                console.log(error)
            }
        }
        fetchInbodyGoals()
    }, [])

    useEffect(() => {
        if (BarGoalRef.current) {
            const barGoalWidth = BarGoalRef.current.offsetWidth;

            if (beforeWeight && afterWeight && weightData.length > 0) {
                const currentWeight = weightData[weightData.length - 1].weight;
                const weightDiff = Number(afterWeight) - Number(beforeWeight);
                const weightProgress = currentWeight - Number(beforeWeight);
                const weightWidthCalc = barGoalWidth * (weightProgress / weightDiff);
                const weightPercentCalc = (weightProgress / weightDiff) * 100;
                setWeightWidth(weightWidthCalc > barGoalWidth ? barGoalWidth : weightWidthCalc);
                setWeightPercent(weightPercentCalc > 100 ? 100 : weightPercentCalc);
            }

            if (beforeMuscle && afterMuscle && muscleData.length > 0) {
                const currentMuscle = muscleData[muscleData.length - 1].muscle;
                const muscleDiff = Number(afterMuscle) - Number(beforeMuscle);
                const muscleProgress = currentMuscle - Number(beforeMuscle);
                const muscleWidthCalc = barGoalWidth * (muscleProgress / muscleDiff);
                const musclePercentCalc = (muscleProgress / muscleDiff) * 100;
                setMuscleWidth(muscleWidthCalc > barGoalWidth ? barGoalWidth : muscleWidthCalc);
                setMusclePercent(musclePercentCalc > 100 ? 100 : musclePercentCalc);
            }

            if (beforeFat && afterFat && fatData.length > 0) {
                const currentFat = fatData[fatData.length - 1].fat;
                const fatDiff = Number(beforeFat) - Number(afterFat);
                const fatProgress = Number(beforeFat) - currentFat;
                const fatWidthCalc = barGoalWidth * (fatProgress / fatDiff);
                const fatPercentCalc = (fatProgress / fatDiff) * 100;
                setFatWidth(fatWidthCalc > barGoalWidth ? barGoalWidth : fatWidthCalc);
                setFatPercent(fatPercentCalc > 100 ? 100 : fatPercentCalc);
            }
            console.log(barGoalWidth, fatWidth)
        }
    }, [beforeWeight, afterWeight, weightData, beforeMuscle, afterMuscle, muscleData, beforeFat, afterFat, fatData]);

    const calculateGrowth = (currentValue: number, previousValue: number) => {
        return currentValue - previousValue;
    };

    const filteredData = inbodyData.filter(item => {
        if (selectedMenu === "weight") {
            return item.종류 === "weight";
        } else if (selectedMenu === "muscle") {
            return item.종류 === "muscle";
        } else if (selectedMenu === "fat") {
            return item.종류 === "fat";
        } else {
            return true;
        }
    });

    const chartData = {
        labels: filteredData.map(item => format(item.날짜, "MM/dd")),
        datasets: [{
            label: selectedMenu === "weight" ? '몸무게 변화' : selectedMenu === "muscle" ? "골격근량 변화" : "체지방 변화",
            data: filteredData.map(item => selectedMenu === "weight" ? item.weight : selectedMenu === "muscle" ? item.muscle : item.fat),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
        }]
    }

    const Growth = (typeData: any[], type: string) => {
        return Number(typeData[typeData.length - 1][type]) - Number(typeData[0][type])
    }


    return (
        <Wrapper>
            <Back onClick={() => navigate('/records', { state: { menu: 'inbody' } })}>
                <FaArrowLeft style={{ width: "20px", height: "20px" }} />
            </Back>
            <h2>Inbody</h2>
            <Menu>
                <MenuItem selected={selectedMenu === "total"} onClick={() => setSelectedMenu("total")}>전체</MenuItem>
                <MenuItem selected={selectedMenu === "weight"} onClick={() => setSelectedMenu("weight")}>몸무게</MenuItem>
                <MenuItem selected={selectedMenu === "muscle"} onClick={() => setSelectedMenu("muscle")}>골격근량</MenuItem>
                <MenuItem selected={selectedMenu === "fat"} onClick={() => setSelectedMenu("fat")}>체지방</MenuItem>
            </Menu>
            <ContentWrapper>

                {filteredData.length > 0 && selectedMenu === "weight" && (
                    <Content>
                        <h4 style={{ margin: '10px 0px' }}>최근 기록 및 차트</h4>
                        <NowData>현재 몸무게 <span>{(filteredData[filteredData.length - 1]).weight}</span> kg</NowData>
                    </Content>
                )}
                {filteredData.length > 0 && selectedMenu === "muscle" && (
                    <Content>
                        <h4 style={{ margin: '10px 0px' }}>최근 기록 및 차트</h4>
                        <NowData>현재 골격근량 <span>{(filteredData[filteredData.length - 1]).muscle}</span> %</NowData>
                    </Content>
                )}
                {filteredData.length > 0 && selectedMenu === "fat" && (
                    <Content>
                        <h4 style={{ margin: '10px 0px' }}>최근 기록 및 차트</h4>
                        <NowData>현재 체지방 <span>{(filteredData[filteredData.length - 1]).fat}</span> %</NowData>
                    </Content>
                )}

                {selectedMenu !== "total" && (
                    <Content style={{ marginBottom: '20px' }}>
                        <LineWrapper>
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    return `${context.raw} ${selectedMenu === "weight" ? "kg" : "%"}`;
                                                }
                                            }
                                        }
                                    },
                                }}
                            />
                        </LineWrapper>
                    </Content>
                )}
                {selectedMenu !== "total" && (
                    <Content>

                        <h4 style={{ margin: '10px 0px' }}>인바디 성장</h4>
                        {filteredData.map((item, index) => {
                            const previousItem = filteredData[index - 1];
                            const weightGrowth = previousItem ? calculateGrowth(item.weight, previousItem.weight) : 0;
                            const muscleGrowth = previousItem ? calculateGrowth(item.muscle, previousItem.muscle) : 0;
                            const fatGrowth = previousItem ? calculateGrowth(item.fat, previousItem.fat) : 0;

                            return (

                                <RecordItem key={index}>
                                    <RecordDate>{format(item.날짜, "yyyy-MM-dd HH:mm")}</RecordDate>
                                    {selectedMenu === "weight" && (
                                        <InbodyGrowthWrapper>
                                            <RecordValue>몸무게: <span>{item.weight}</span> kg</RecordValue>
                                            <GrowthValue>
                                                {weightGrowth >= 0 ? `+${weightGrowth}` : `${weightGrowth}`} kg
                                            </GrowthValue>
                                        </InbodyGrowthWrapper>
                                    )}
                                    {selectedMenu === "muscle" && (
                                        <InbodyGrowthWrapper>
                                            <RecordValue>골격근량: <span>{item.muscle}</span> %</RecordValue>
                                            <GrowthValue>
                                                {muscleGrowth >= 0 ? `+${muscleGrowth}` : `${muscleGrowth}`} %
                                            </GrowthValue>
                                        </InbodyGrowthWrapper>
                                    )}
                                    {selectedMenu === "fat" && (
                                        <InbodyGrowthWrapper>
                                            <RecordValue>체지방: <span>{item.fat}</span> %</RecordValue>
                                            <GrowthValue>
                                                {fatGrowth >= 0 ? `+${fatGrowth}` : `${fatGrowth}`} %
                                            </GrowthValue>
                                        </InbodyGrowthWrapper>
                                    )}
                                </RecordItem>
                            )
                        })}
                    </Content>
                )}
                {weightData.length > 0 && selectedMenu === 'total' && (
                    <>
                        <Content>
                            <h4 style={{ margin: '10px 0px' }}>현재까지의 성장치</h4>
                            <TotalNowDataWrapper>
                                <TotalNowData>
                                    <h5>현재 몸무게</h5> <span>{weightData[weightData.length - 1].weight}</span>kg
                                    <NowGrowth style={{ backgroundColor: Growth(weightData, "weight") >= 0 ? "green" : "green" }}>
                                        {Growth(weightData, "weight") >= 0 ? `+${Growth(weightData, "weight")}` : `-${Growth(weightData, "weight")}`} kg
                                    </NowGrowth>
                                </TotalNowData>
                                <TotalNowData>
                                    <h5>현재 골격근량</h5> <span>{muscleData[muscleData.length - 1].muscle}</span>%
                                    <NowGrowth style={{ backgroundColor: Growth(muscleData, "muscle") >= 0 ? "green" : "red" }}>
                                        {Growth(muscleData, "muscle") >= 0 ? `+${Growth(muscleData, "muscle")}` : `-${Growth(muscleData, "muscle")}`} %
                                    </NowGrowth>
                                </TotalNowData>
                                <TotalNowData>
                                    <h5>현재 체지방</h5> <span>{fatData[fatData.length - 1].fat}</span>%
                                    <NowGrowth style={{ backgroundColor: Growth(fatData, "fat") <= 0 ? "green" : "red" }}>
                                        {Growth(fatData, "fat") >= 0 ? `+${Growth(fatData, "fat")}` : `-${Growth(fatData, "fat")}`} %
                                    </NowGrowth>
                                </TotalNowData>
                            </TotalNowDataWrapper>
                        </Content>

                        <Content>
                            <h4 style={{ marginBottom: '10px' }}>목표 달성 그래프</h4>
                            <GoalWrapper>
                                <ValueWrapper>
                                    <span>이전: {beforeWeight} kg</span>
                                    <span>현재: {weightData[weightData.length - 1]?.weight} %</span>
                                    <span>목표: {afterWeight} %</span>
                                </ValueWrapper>
                                <BarWrapper>
                                    <span style={{ textAlign: 'left' }}>체중</span>
                                    <BarGoal ref={BarGoalRef}>
                                        <Bar width={weightWidth} /><div style={{ height:'25px', lineHeight:'25px',color: 'white', position: 'absolute', left: '50%', transform: "translate(-50%, 0)" }}>{weightPercent} %</div>
                                    </BarGoal>
                                </BarWrapper>
                            </GoalWrapper>
                            <GoalWrapper>
                                <ValueWrapper>
                                    <span>이전: {beforeMuscle} %</span>
                                    <span>현재: {muscleData[muscleData.length - 1]?.muscle} %</span>
                                    <span>목표: {afterMuscle} %</span>
                                </ValueWrapper>

                                <BarWrapper>
                                    <span style={{ textAlign: 'left' }}>골격근량</span>
                                    <BarGoal ref={BarGoalRef}>
                                        <Bar width={muscleWidth} /><div style={{ height:'25px', lineHeight:'25px',color: 'white', position: 'absolute', left: '50%', transform: "translate(-50%, 0)" }}>{musclePercent} %</div>
                                    </BarGoal>
                                </BarWrapper>
                            </GoalWrapper>
                            <GoalWrapper>
                                <ValueWrapper>
                                    <span>이전: {beforeFat} %</span>
                                    <span>현재: {fatData[fatData.length - 1]?.fat} %</span>
                                    <span>목표: {afterFat} %</span>
                                </ValueWrapper>
                                <BarWrapper>
                                    <span style={{ textAlign: 'left' }}>체지방</span>
                                    <BarGoal ref={BarGoalRef}>
                                        <Bar width={fatWidth} /><div style={{ height:'25px', lineHeight:'25px',color: 'white', position: 'absolute', left: '50%', transform: "translate(-50%, 0)" }}>{fatPercent} %</div>
                                    </BarGoal>
                                </BarWrapper>
                            </GoalWrapper>
                        </Content>
                    </>
                )}
            </ContentWrapper>
        </Wrapper>
    )
}
export default InbodyDetails