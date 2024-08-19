import styled from "styled-components"
import { FaRegUser } from "react-icons/fa";
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

const PersonalWrapper = styled.div`
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

interface PersonalProps {
    personalClick: () => void;
}

const PersonalChallenge: React.FC<PersonalProps> = ({ personalClick }) => {
    return (
        <Wrapper onClick={personalClick}>
            <FaRegUser style={{ width: "40px", height: "40px", color: "#ffffff", marginBottom: '15px' }} />
            <PersonalWrapper>
                <TextWrapper>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: '5px' }}>개인 챌린지</div>
                    <span>혼자만의 습관을 세워보세요</span>
                </TextWrapper>
                <IoArrowForwardCircle />
            </PersonalWrapper>
        </Wrapper>
    )
}

export default PersonalChallenge;