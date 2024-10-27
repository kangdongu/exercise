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
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  width:80%;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: pop-in 0.5s ease-in-out;

  @keyframes pop-in {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 20px;
`;

const AchievementTitle = styled.h2`
  font-size: 2rem;
  color: #4caf50;
  margin-bottom: 10px;
`;

const AchievementMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background-color: #ff3232;
  color: white;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e02626;
  }
`;

interface AchievementProps {
  handleModalConfirm: () => void;
  achievementName: string;
}

const AchievementModal: React.FC<AchievementProps> = ({ handleModalConfirm, achievementName }) => {
  return (
    <ModalWrapper>
      <ModalContent>
        <IconWrapper>
          <FaHandsClapping style={{ color: "#FFA726", width: "60px", height: "60px" }} />
        </IconWrapper>
        <AchievementTitle>도전과제 달성!</AchievementTitle>
        <AchievementMessage>{achievementName} 도전과제를 완료했습니다.</AchievementMessage>
        <ModalButton onClick={handleModalConfirm}>확인</ModalButton>
      </ModalContent>
    </ModalWrapper>
  );
}

export default AchievementModal;
