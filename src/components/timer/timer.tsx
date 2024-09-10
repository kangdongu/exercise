import styled from "styled-components";
import { GrAlarm } from "react-icons/gr";
import { IoArrowForwardCircle } from "react-icons/io5";

const Wrapper = styled.div`
    border-radius: 10px;
    padding: 15px;
    align-items: center;
    color: #333333;
    // background: linear-gradient(to bottom, #FF85A1, #E05885);
    background-color:white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    svg{
        color:#E05885;
    }
`;

const Timer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap:5px;
    span {
        font-size: 14px;
        // color: #f0f0f0;
        color:#333333;
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

interface TimerProps {
    timerClick: () => void;
}

const TimerWrapper: React.FC<TimerProps> = ({ timerClick }) => {
    return (
        <Wrapper onClick={timerClick}>
            <GrAlarm style={{ width: "50px", height: "50px", color: "#E05885", marginBottom: '15px' }} />
            <Timer>
                <TextWrapper>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: '5px' }}>운동 타이머</div>
                    <span>타이머를 이용해 보세요</span>
                </TextWrapper>
                <IoArrowForwardCircle />
            </Timer>
        </Wrapper>
    );
}

export default TimerWrapper;
