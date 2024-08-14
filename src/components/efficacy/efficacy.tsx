import styled from "styled-components"
import { CiDumbbell } from "react-icons/ci";
import { IoArrowForwardCircle } from "react-icons/io5";

const Wrapper = styled.div`
    border-radius: 10px;
    padding: 15px;
    align-items: center;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
     background: linear-gradient(to bottom, #33CCFF, #009cfc);
`;
const EfficacyWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap:5px;
    span {
        font-size: 14px;
        color: #f0f0f0;
    }
    svg{
        width:40px;
        height:40px;
        margin-top:20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;
const TextWrapper = styled.div`
    width:80%;
`;
interface efficacyProps {
    efficacyClick: () => void
}
const Efficacy: React.FC<efficacyProps> = ({ efficacyClick }) => {
    return (
        <Wrapper onClick={efficacyClick}>
            <CiDumbbell style={{ width: "60px", height: "60px", color: "#ffffff", marginBottom: '15px' }} />
            <EfficacyWrapper>
                <TextWrapper>
                    <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: '5px' }} >운동별 정보</div>
                    <span>운동별 효능에 대해 알아보세요</span>
                </TextWrapper>
                <IoArrowForwardCircle />
            </EfficacyWrapper>
        </Wrapper>
    )
}
export default Efficacy