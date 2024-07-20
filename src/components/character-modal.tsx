import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CharacterImage = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 20px;
`;

const Message = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const ConfirmButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

interface CongratulationModalProps {
    characterModalConfirm: () => void;
    characterImage: string;
    message: string;
}

const CharacterModal: React.FC<CongratulationModalProps> = ({ characterModalConfirm, characterImage, message }) => {
    return (
        <ModalOverlay>
            <ModalContent>
                <CharacterImage src={characterImage} alt="Character" />
                <Message>{message}</Message>
                <ConfirmButton onClick={characterModalConfirm}>확인</ConfirmButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CharacterModal;
