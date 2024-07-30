import styled, { keyframes } from "styled-components";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import { auth } from "../firebase";

const slideIn = keyframes`
  from {
    left: 100vw;
  }
  to {
    left: 0;
  }
`;

const slideOut = keyframes`
  from {
    left: 0;
  }
  to {
    left: 100vw;
  }
`;

const Wrapper = styled.div<{isClosing: boolean}>`
    width: 100vw;
    height: 100vh;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9900;
    animation: ${({ isClosing }) => isClosing ? slideOut : slideIn} 0.3s ease-out;
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
`;

const Header = styled.div`
    width:100%;
    display:flex;
    svg{
        margin-left:auto;
        width:30px;
        height:30px;
    }
`;
const ContentWrapper = styled.div`

`;
const LogOut = styled.div`

`;

interface menuProps {
    onClose: () => void
}
const MenuModal: React.FC<menuProps> = ({ onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };
    
    const signOut = async () => {
      try {
        await auth.signOut();
      } catch (error) {
        console.error("로그아웃 에러:", error);
      }
    };

    return (
        <Wrapper isClosing={isClosing}>
            <Header>
                <FiX onClick={handleClose} />
            </Header>
            <ContentWrapper>
              <LogOut onClick={signOut}>로그아웃</LogOut>
            </ContentWrapper>
        </Wrapper>
    );
}

export default MenuModal;