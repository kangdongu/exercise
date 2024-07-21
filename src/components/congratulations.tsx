import styled, { keyframes } from 'styled-components';
import { FaHandsClapping } from "react-icons/fa6";

interface CongratulationsProps {
    title: string;
    content: string;
}

const WrapperAnimation = keyframes`
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
`;

const Wrapper = styled.div`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    display:flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    animation: ${WrapperAnimation} 3s forwards;
`;

const Modal = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
    position: relative;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 24px;
    color: #333;
`;

const Content = styled.p`
    font-size: 18px;
    color: #666;
    margin-top: 10px;
`;

const Applause = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;


const Congratulations: React.FC<CongratulationsProps> = ({ title, content }) => {


    return (
        <Wrapper>
            <Modal>
                <Applause>
                    <FaHandsClapping style={{ color: "#FFA726", width: "50px", height: "50px" }} />
                </Applause>
                <Title>{title}</Title>
                <Content>{content}</Content>
            </Modal>
        </Wrapper>
    );
};

export default Congratulations;

