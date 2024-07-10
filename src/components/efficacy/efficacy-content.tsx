import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"
import MoSlideModal from "../slideModal/mo-slide-modal";
import MoSlideLeft from "../slideModal/mo-slide-left";
import ExerciseEfficacy from "./exercise-efficacy";

const Wrapper = styled.div`
    width:100vw;
    height:calc(100vh - 70px);
    overflow-y:scroll;
     background: linear-gradient(to bottom, #FAC1BA, #FF6F61);
    padding-top:20px;
`;
const ContentWrapper = styled.div`
    width:95vw;
    margin:0 auto;
    display:grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows : 150px 150px 150px 150px;
    gap:20px;
`;
const Content = styled.div`
    background: linear-gradient(to bottom, #FAFAF8, #f3f1f1);
    border-radius:20px;
    line-height:150px;
    font-size:20px;
    text-align:center;
`;
const ModalWrapper = styled.div`
    background-color:white;
    width:100vw;
    height:calc(100vh - 80px);
    overflow-y:scroll;
`;

const EfficacyContent = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false)

    const modalOpen = () => {
        setModal(true)
    }

    const UpdateSoon = () => {
        alert("업데이트 예정입니다.")
    }

    return (
        <MoSlideModal onClose={() => navigate("/")}>
            <Wrapper>
                <h4 style={{ fontSize: "24px", marginTop: "10px", marginLeft: "2.5vw", marginBottom: "10px", color: "#333333" }}>운동 정보</h4>
                <ContentWrapper>
                    <Content onClick={modalOpen}>운동의 효과</Content>
                    <Content onClick={UpdateSoon}>헬스</Content>
                    <Content onClick={UpdateSoon}>수영</Content>
                    <Content onClick={UpdateSoon}>필라테스</Content>
                    <Content onClick={UpdateSoon}>크로스핏</Content>
                    <Content onClick={UpdateSoon}>러닝</Content>
                </ContentWrapper>
                {modal && (
                    <MoSlideLeft onClose={() => setModal(false)}>
                        <ModalWrapper>
                            <ExerciseEfficacy />
                        </ModalWrapper>
                    </MoSlideLeft>
                )}
            </Wrapper>
        </MoSlideModal>
    )
}
export default EfficacyContent