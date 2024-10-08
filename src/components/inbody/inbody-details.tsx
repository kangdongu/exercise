import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { format } from "date-fns";
import { Line } from "react-chartjs-2";
import { FaEllipsis } from "react-icons/fa6";
import MoSlideModal from "../slideModal/mo-slide-modal";

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
    color: ${props => props.selected ? "#FC286E" : "#939393"}
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
const MoreDataButton = styled.button`
    width:100%;
    border:none;
    background-color:white;
    height:40px;
    font-size:16px;
`;
const RecordDate = styled.div`
    display:flex;
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
const Bar = styled.div`
    position:absolute;
    top:0;
    left:0;
    height:100%;
    background-color:#FC286E;
    border-radius: 12px;
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
    const [weightPercent, setWeightPercent] = useState<number>(0)
    const [musclePercent, setMusclePercent] = useState<number>(0)
    const [fatPercent, setFatPercent] = useState<number>(0)
    const [beforeWeight, setBeforeWeight] = useState("")
    const [beforeMuscle, setBeforeMuscle] = useState("")
    const [beforeFat, setBeforeFat] = useState("")
    const [afterWeight, setAfterWeight] = useState("")
    const [afterMuscle, setAfterMuscle] = useState("")
    const [afterFat, setAfterFat] = useState("")
    const [moreData, setMoreData] = useState(false);
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
                let weightData = []
                let muscleData = []
                let fatData = []
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        ...docData,
                        날짜: new Date(docData.날짜),
                        종류: docData.종류,
                    };
                });

                weightData.push(...(data.filter(item => item.종류 === "weight")));
                muscleData.push(...(data.filter(item => item.종류 === "muscle")))
                fatData.push(...(data.filter(item => item.종류 === "fat")))

                setInbodyData(data);
                setWeightData(data.filter(item => item.종류 === "weight"));
                setMuscleData(data.filter(item => item.종류 === "muscle"))
                setFatData(data.filter(item => item.종류 === "fat"))

                const goalsRefs = collection(db, "inbody-goals");
                const goalsQuerySnapshot = await getDocs(
                    query(goalsRefs, where("유저아이디", "==", currentUser?.uid))
                )

                let beforeWeight: string = "";
                let beforeMuscle: string = "";
                let beforeFat: string = "";
                let afterWeight: string = "";
                let afterMuscle: string = "";
                let afterFat: string = "";

                if (!goalsQuerySnapshot.empty) {
                    const goalsRef = goalsQuerySnapshot.docs[0]
                    beforeWeight = (goalsRef.data().현재몸무게)
                    beforeMuscle = (goalsRef.data().현재골격근량)
                    beforeFat = (goalsRef.data().현재체지방)
                    afterWeight = (goalsRef.data().목표몸무게)
                    afterMuscle = (goalsRef.data().목표골격근량)
                    afterFat = (goalsRef.data().목표체지방)

                    setBeforeWeight((goalsRef.data().현재몸무게))
                    setBeforeMuscle((goalsRef.data().현재골격근량))
                    setBeforeFat(goalsRef.data().현재체지방)
                    setAfterWeight((goalsRef.data().목표몸무게))
                    setAfterMuscle(goalsRef.data().목표골격근량)
                    setAfterFat((goalsRef.data().목표체지방))

                }

                fetchBar(beforeWeight,
                    beforeMuscle,
                    beforeFat,
                    afterWeight,
                    afterMuscle,
                    afterFat,
                    weightData,
                    muscleData,
                    fatData
                );

            } catch (error) {
                console.error("Error fetching inbody data: ", error);
            }
        };

        fetchInbody();
    }, [])

    const fetchBar = (beforeWeight: string, beforeMuscle: string, beforeFat: string, afterWeight: string, afterMuscle: string, afterFat: string, weightData: any[], muscleData: any[], fatData: any[]) => {
        if (beforeWeight !== "" && afterWeight !== "" && weightData.length > 0) {
            const currentWeight = weightData[weightData.length - 1].weight;
            const weightDiff = Number(afterWeight) - Number(beforeWeight);
            const weightProgress = currentWeight - Number(beforeWeight);
            const weightPercentCalc = (weightProgress / weightDiff) * 100;
            const weightPercent = weightPercentCalc > 100 ? 100 : weightPercentCalc.toFixed(2);
            setWeightPercent(Number(weightPercent));
        }

        if (beforeMuscle !== "" && afterMuscle !== "" && muscleData.length > 0) {
            const currentMuscle = muscleData[muscleData.length - 1].muscle;
            const muscleDiff = Number(afterMuscle) - Number(beforeMuscle);
            const muscleProgress = currentMuscle - Number(beforeMuscle);
            const musclePercentCalc = (muscleProgress / muscleDiff) * 100;
            const musclePercent = musclePercentCalc > 100 ? 100 : musclePercentCalc.toFixed(2);
            setMusclePercent(Number(musclePercent));
        }

        if (beforeFat !== "" && afterFat !== "" && fatData.length > 0) {
            const currentFat = fatData[fatData.length - 1].fat;
            const fatDiff = Number(beforeFat) - Number(afterFat);
            const fatProgress = Number(beforeFat) - currentFat;
            const fatPercentCalc = (fatProgress / fatDiff) * 100;
            const fatPercent = fatPercentCalc > 100 ? 100 : fatPercentCalc.toFixed(2);
            setFatPercent(Number(fatPercent));
        }
    }


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
                                    },
                                }}
                            />
                        </LineWrapper>
                    </Content>
                )}
                {selectedMenu !== "total" && (
                    <Content>

                        <h4 style={{ margin: '10px 0px' }}>인바디 성장</h4>
                        {filteredData.slice(-10).map((item, index) => {
                            const previousItem = filteredData[index - 1];
                            const weightGrowth = previousItem ? calculateGrowth(item.weight, previousItem.weight) : 0;
                            const muscleGrowth = previousItem ? calculateGrowth(item.muscle, previousItem.muscle) : 0;
                            const fatGrowth = previousItem ? calculateGrowth(item.fat, previousItem.fat) : 0;

                            return (

                                <RecordItem key={index}>
                                    <RecordDate>
                                        <span>{format(item.날짜, "yyyy-MM-dd HH:mm")}</span>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <FaEllipsis />
                                        </div>
                                    </RecordDate>
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
                        <MoreDataButton onClick={() => setMoreData(true)}>더 많은 기록 보러가기</MoreDataButton>
                    </Content>
                )}
                {weightData.length > 0 && selectedMenu === 'total' && (
                    <>
                        <Content>
                            <h4 style={{ margin: '10px 0px' }}>현재까지의 성장치</h4>
                            <TotalNowDataWrapper>
                                <TotalNowData>
                                    <h5>현재 몸무게</h5> <span>{weightData[weightData.length - 1].weight}</span>kg
                                    <NowGrowth style={{ backgroundColor: Growth(weightData, "weight") >= 0 ? "#53A85B" : "#53A85B" }}>
                                        {Growth(weightData, "weight") >= 0 ? `+${Growth(weightData, "weight")}` : `${Growth(weightData, "weight")}`} kg
                                    </NowGrowth>
                                </TotalNowData>
                                <TotalNowData>
                                    <h5>현재 골격근량</h5> <span>{muscleData[muscleData.length - 1].muscle}</span>%
                                    <NowGrowth style={{ backgroundColor: Growth(muscleData, "muscle") >= 0 ? "#53A85B" : "#FC286E" }}>
                                        {Growth(muscleData, "muscle") >= 0 ? `+${Growth(muscleData, "muscle")}` : `${Growth(muscleData, "muscle")}`} %
                                    </NowGrowth>
                                </TotalNowData>
                                <TotalNowData>
                                    <h5>현재 체지방</h5> <span>{fatData[fatData.length - 1].fat}</span>%
                                    <NowGrowth style={{ backgroundColor: Growth(fatData, "fat") <= 0 ? "#53A85B" : "#FC286E" }}>
                                        {Growth(fatData, "fat") >= 0 ? `+${Growth(fatData, "fat")}` : `${Growth(fatData, "fat")}`} %
                                    </NowGrowth>
                                </TotalNowData>
                            </TotalNowDataWrapper>
                        </Content>

                        <Content>
                            <h4 style={{ marginBottom: '10px' }}>목표 달성 그래프</h4>
                            <GoalWrapper>
                                <ValueWrapper>
                                    <span>목표당시: {beforeWeight} kg</span>
                                    <span>현재: {weightData[weightData.length - 1]?.weight} kg</span>
                                    {afterWeight === "" ? (
                                        <span>목표: 미설정</span>
                                    ) : (
                                        <span>목표: {afterWeight} kg</span>
                                    )}
                                </ValueWrapper>
                                <BarWrapper>
                                    <span style={{ textAlign: 'left' }}>체중</span>
                                    <BarGoal>
                                        <Bar style={{ width: `${weightPercent}%` }} /><div style={{ height: '25px', lineHeight: '25px', color: 'white', position: 'absolute', left: '50%', transform: "translate(-50%, 0)" }}>{weightPercent} %</div>
                                    </BarGoal>
                                </BarWrapper>
                            </GoalWrapper>
                            <GoalWrapper>
                                <ValueWrapper>
                                    <span>목표당시: {beforeMuscle} %</span>
                                    <span>현재: {muscleData[muscleData.length - 1]?.muscle} %</span>
                                    {afterMuscle === "" ? (
                                        <span>목표: 미설정</span>
                                    ) : (
                                        <span>목표: {afterMuscle} %</span>
                                    )}
                                </ValueWrapper>

                                <BarWrapper>
                                    <span style={{ textAlign: 'left' }}>골격근량</span>
                                    <BarGoal>
                                        <Bar style={{ width: `${musclePercent}%` }} /><div style={{ height: '25px', lineHeight: '25px', color: 'white', position: 'absolute', left: '50%', transform: "translate(-50%, 0)" }}>{musclePercent} %</div>
                                    </BarGoal>
                                </BarWrapper>
                            </GoalWrapper>
                            <GoalWrapper>
                                <ValueWrapper>
                                    <span>목표당시: {beforeFat} %</span>
                                    <span>현재: {fatData[fatData.length - 1]?.fat} %</span>
                                    {afterFat === "" ? (
                                        <span>목표: 미설정</span>
                                    ) : (
                                        <span>목표: {afterFat} %</span>
                                    )}
                                </ValueWrapper>
                                <BarWrapper>
                                    <span style={{ textAlign: 'left' }}>체지방</span>
                                    <BarGoal>
                                        <Bar style={{ width: `${fatPercent}%` }} /><div style={{ height: '25px', lineHeight: '25px', color: 'white', position: 'absolute', left: '50%', transform: "translate(-50%, 0)" }}>{fatPercent} %</div>
                                    </BarGoal>
                                </BarWrapper>
                            </GoalWrapper>
                        </Content>
                    </>
                )}
            </ContentWrapper>
            {moreData && (
                <MoSlideModal onClose={() => setMoreData(false)}>
                    <ContentWrapper style={{ height: 'calc(100vh - 40px)', overflowY: 'scroll' }}>

                        <Content>
                            {filteredData.map((item, index) => {
                                const previousItem = filteredData[index - 1];
                                const weightGrowth = previousItem ? calculateGrowth(item.weight, previousItem.weight) : 0;
                                const muscleGrowth = previousItem ? calculateGrowth(item.muscle, previousItem.muscle) : 0;
                                const fatGrowth = previousItem ? calculateGrowth(item.fat, previousItem.fat) : 0;

                                return (

                                    <RecordItem key={index}>
                                        <RecordDate>
                                            <span>{format(item.날짜, "yyyy-MM-dd HH:mm")}</span>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <FaEllipsis />
                                            </div>
                                        </RecordDate>
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
                    </ContentWrapper>
                </MoSlideModal>
            )}
        </Wrapper>
    )
}
export default InbodyDetails