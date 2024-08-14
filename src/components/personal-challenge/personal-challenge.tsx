import styled from "styled-components"
import { FaRegUser } from "react-icons/fa";

const Wrapper = styled.div`
    border-radius: 10px;
    padding: 5px 5px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    color: black;
    background-color: #FF6F61;
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom, #a7b0e7, #0079ff);
`;

const PersonalWrapper = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: auto;
    z-index: 10;
    gap: 15px;
    color: white;
    span {
        font-size: 14px;
        text-align: center;
        color: #F8F8FF;
    }
`;

interface PersonalProps {
    personalClick: () => void;
}

const PersonalChallenge: React.FC<PersonalProps> = ({ personalClick }) => {
    return (
        <Wrapper onClick={personalClick}>
            <FaRegUser style={{ position: "absolute", left: "-10px", top: "20px", width: "80px", height: "80px", color: "#FFFFFF", opacity: "0.3" }} />
            <PersonalWrapper>
                <div style={{ fontSize: "20px", fontWeight: "600", textAlign: "center", marginTop: "20px" }}>개인 챌린지</div>
                <span>혼자만의 습관을 세우고 완료해보세요</span>
            </PersonalWrapper>
        </Wrapper>
    )
}

export default PersonalChallenge;