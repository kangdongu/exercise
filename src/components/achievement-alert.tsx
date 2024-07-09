import styled from "styled-components";
import { FaHandsClapping } from "react-icons/fa6";

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:999;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
`;

const ModalButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    background-color: #FF3232;
    color: white;
    border-radius: 5px;
    cursor: pointer;
`;

interface achievementProps {
    handleModalConfirm: () => void;
    achievementName: string;
}
const AchievementModal: React.FC<achievementProps> = ({ handleModalConfirm, achievementName }) => {
    return (
        <ModalWrapper>
            <ModalContent>
                <div><FaHandsClapping style={{ color: "FBCEB1", width: "50px", height: "50px" }} /></div>
                <h2>도전과제 달성!</h2>
                <p>{achievementName} 도전과제를 완료했습니다.</p>
                <ModalButton onClick={handleModalConfirm}>확인</ModalButton>
            </ModalContent>
        </ModalWrapper>
    )
}
export default AchievementModal