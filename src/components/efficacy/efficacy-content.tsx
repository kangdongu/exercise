import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"
import MoSlideModal from "../slideModal/mo-slide-modal";

const Wrapper = styled.div`
    width:100vw;
    height:calc(100vh - 70px);
    overflow-y:scroll;
     background: linear-gradient(to bottom, #FF6F61, #D32F2F);
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
    background-color:#f3f1f1;
    border-radius:20px;
    line-height:150px;
    font-size:20px;
    text-align:center;
`;
const ModalWrapper = styled.div`
    width:100vw;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    background-color:white;
    padding: 10px 10px;
`;

const EfficacyContent = () => {
    const navigate = useNavigate();
    const [modal,setModal] = useState(false)

    const modalOpen = () => {
        setModal(true)
    }
    const back = () => {
        setModal(false)
    }

    return (
        <MoSlideModal onClose={() => navigate("/")}>
        <Wrapper>
            <h4 style={{fontSize:"24px", marginTop:"10px", marginLeft:"2.5vw", marginBottom:"10px", color:"#f3f1f1"}}>운동 정보</h4>
            <ContentWrapper>
                <Content onClick={modalOpen}>운동의 효과</Content>
                <Content onClick={modalOpen}>헬스</Content>
                <Content onClick={modalOpen}>수영</Content>
                <Content onClick={modalOpen}>필라테스</Content>
                <Content onClick={modalOpen}>크로스핏</Content>
                <Content onClick={modalOpen}>러닝</Content>
            </ContentWrapper>
            {modal && (
                <ModalWrapper>
                    <div onClick={back} style={{fontSize:"30px"}}>x</div>
                    <p style={{fontSize:"20px"}}>운동의 효과 : 운동을 하면 왜 좋은지 체력뿐아니라 생각하기 힘든 부분의 효과까지 정보를 업데이트 할 예정입니다.</p>
                    <p style={{fontSize:"20px"}}>각 운동 : 각 운동의 장, 단점을 작성하고 어디에 좋은지 어떤식으로 진행하는 운동인지에 대한 정보를 입력할 예정입니다.</p>
                </ModalWrapper>
            )}
        </Wrapper>
        </MoSlideModal>
    )
}
export default EfficacyContent