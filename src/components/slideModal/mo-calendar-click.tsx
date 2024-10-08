import { ReactNode, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from {
    top: 100vh;
  }
  to {
    top: 0;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  animation: ${slideUp} 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

const Back = styled.div`
  width: 20px;
  height: 20px;
  margin: 10px;
  cursor: pointer;
  align-self: flex-start;
`;

interface MoCalendarWrapperProps {
  children: ReactNode;
  onClose: () => void;
}

const MoCalendarWrapper: React.FC<MoCalendarWrapperProps> = ({ children, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).id === "modal-background") {
        onClose();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div id="modal-background">
      <Wrapper>
        <Back onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
          </svg>
        </Back>
        {children}
      </Wrapper>
    </div>
  );
};

export default MoCalendarWrapper;
