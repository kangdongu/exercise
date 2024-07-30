import styled from "styled-components"
import { CiDumbbell } from "react-icons/ci";

const Wrapper = styled.div`
    border-radius:10px;
    padding: 5px 5px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    color:black;
    background-color:#FF6F61;
    position:relative;
    overflow:hidden;
    grid-column:1/3;
     background: linear-gradient(to bottom, #FF6F61, #D32F2F);
`;
const EfficacyWrapper = styled.div`
    width:90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left:auto;
    z-index:10;
    gap:20px;
    color:white;
    span{
        font-size:14px;
        text-align:center;
        color:#F8F8FF;
    }
`;
interface efficacyProps {
    efficacyClick: () => void
}
const Efficacy: React.FC<efficacyProps> = ({ efficacyClick }) => {
    return (
        <Wrapper onClick={efficacyClick}>
            <CiDumbbell style={{ position: "absolute", top: "10px", width: "120px", opacity: "0.8", height: "120px", color: "#8E24AA" }} />
            <EfficacyWrapper>
                <div style={{ fontSize: "20px", fontWeight: "600", textAlign: "center", marginTop: "25px" }} >운동별 정보</div>
                <span>운동의 장, 단점<br /> 효능에 대해 알아보세요</span>
            </EfficacyWrapper>
        </Wrapper>
    )
}
export default Efficacy