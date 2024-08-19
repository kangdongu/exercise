import styled from "styled-components"
import { RiPoliceBadgeLine } from "react-icons/ri";
import { IoArrowForwardCircle } from "react-icons/io5";

const Wrapper = styled.div`
    border-radius: 10px;
    padding: 15px;
    align-items: center;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
     background: linear-gradient(to bottom, #FF6A85, #FF286F);
`;
const TimerWrapper = styled.div`
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
interface badgeProps {
    badgeClick: () => void
}
const Badge: React.FC<badgeProps> = ({ badgeClick }) => {
    return (
        <Wrapper onClick={badgeClick}>
            <RiPoliceBadgeLine style={{ width: "40px", height: "40px", color: "#ffffff", marginBottom: '15px' }} />

            <TimerWrapper>
                <TextWrapper>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: '5px' }}>뱃지 현황</div>
                    <span>뱃지를 획득해보세요</span>
                </TextWrapper>
                <IoArrowForwardCircle />
            </TimerWrapper>
        </Wrapper>
    )
}
export default Badge