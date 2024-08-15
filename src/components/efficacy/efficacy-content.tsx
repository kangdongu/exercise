import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MoSlideModal from "../slideModal/mo-slide-modal";
import MoSlideLeft from "../slideModal/mo-slide-left";
import ExerciseEfficacy from "./exercise-efficacy";
import HealthGym from "./health-gym";
import Swimming from "./swimming";
import Pilates from "./pilates";
import Crossfit from "./crossfit";
import Running from "./running";

const Wrapper = styled.div`
    width: 100vw;
    height: calc(100vh - 80px);
    overflow-y: scroll;
    background: linear-gradient(to bottom, #FF6A89, #FC286E);
    padding: 20px;
    color: #333;
`;

const Title = styled.h4`
    font-size: 24px;
    margin: 10px 0;
    color: white;
`;

const ContentWrapper = styled.div`
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
`;

const Content = styled.div`
    background: linear-gradient(to bottom, #FAFAF8, #f3f1f1);
    border-radius: 20px;
    line-height: 150px;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    opacity:0.85;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const ModalWrapper = styled.div`
    background-color: white;
    width: 100vw;
    height: calc(100vh - 80px);
    overflow-y: scroll;
`;

const EfficacyContent = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [exercise, setExercise] = useState("");

    const modalOpen = (exerciseType: string) => {
        setExercise(exerciseType);
        setModal(true);
    };

    return (
        <MoSlideModal onClose={() => navigate("/")}>
            <Wrapper>
                <Title>운동별 정보</Title>
                <ContentWrapper>
                    <Content onClick={() => modalOpen("efficacy")}>운동의 효과</Content>
                    <Content onClick={() => modalOpen("health-gym")}>헬스</Content>
                    <Content onClick={() => modalOpen("swimming")}>수영</Content>
                    <Content onClick={() => modalOpen("pilates")}>필라테스</Content>
                    <Content onClick={() => modalOpen("crossfit")}>크로스핏</Content>
                    <Content onClick={() => modalOpen("running")}>러닝</Content>
                </ContentWrapper>
                {modal && (
                    <MoSlideLeft onClose={() => setModal(false)}>
                        <ModalWrapper>
                            {exercise === "efficacy" && <ExerciseEfficacy />}
                            {exercise === "health-gym" && <HealthGym />}
                            {exercise === "swimming" && <Swimming />}
                            {exercise === "pilates" && <Pilates />}
                            {exercise === "crossfit" && <Crossfit />}
                            {exercise === "running" && <Running />}
                        </ModalWrapper>
                    </MoSlideLeft>
                )}
            </Wrapper>
        </MoSlideModal>
    );
};

export default EfficacyContent;
