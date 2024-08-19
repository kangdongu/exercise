import styled from "styled-components"
import { GoTrophy } from "react-icons/go";
import { IoArrowForwardCircle } from "react-icons/io5";

const Wrapper = styled.div`
    border-radius: 10px;
    padding: 15px;
    align-items: center;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
     background: linear-gradient(to bottom, #98CDA3, #6F9F75);
`;
const AchievementsWrapper = styled.div`
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
        // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;
const TextWrapper = styled.div`
    width:80%;
`;

interface achievmeentsProps {
    achievmeentsClick: () => void
}
const Achievements: React.FC<achievmeentsProps> = ({ achievmeentsClick }) => {
    return (
        <Wrapper onClick={achievmeentsClick}>
            <GoTrophy style={{ width: "40px", height: "40px", color: "#ffffff", marginBottom: '15px' }} />
            <AchievementsWrapper>
                <TextWrapper>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: '5px' }} >도전과제</div>
                    <span>습관과 도전과제를 쌓아보세요</span>
                </TextWrapper>
                <IoArrowForwardCircle />
            </AchievementsWrapper>
        </Wrapper>
    )
}
export default Achievements