import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 80%;
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

const BadgeImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const BadgeName = styled.h2`
  margin: 0.5rem 0;
  font-size: 1.5rem;
  color: #333;
`;

const CongratsMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin: 1rem 0;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

interface BadgeProps {
  badgeName: string;
  badgeImg: string;
  badgeModalConfirm: () => void;
}

const BadgeModal: React.FC<BadgeProps> = ({ badgeName, badgeImg, badgeModalConfirm }) => {
  return (
    <Wrapper>
      <ModalContent>
        <BadgeImage src={badgeImg} alt={`${badgeName} 이미지`} />
        <BadgeName>{badgeName}</BadgeName>
        <CongratsMessage>축하합니다! 새로운 뱃지를 획득했습니다!</CongratsMessage>
        <ConfirmButton onClick={badgeModalConfirm}>확인</ConfirmButton>
      </ModalContent>
    </Wrapper>
  );
}

export default BadgeModal;
