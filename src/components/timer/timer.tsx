import styled from "styled-components"
import { GrAlarm } from "react-icons/gr";

const Wrapper = styled.div`
    border-radius:10px;
    padding: 5px 5px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    color:black;
    background-color:#FF6F61;
    position:relative;
    overflow:hidden;
     background: linear-gradient(to bottom, #fcb1ac, #ea6362);
`;
const Timer = styled.div`
    width:70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left:auto;
    z-index:10;
    gap:15px;
    color:white;
    span{
        font-size:14px;
        text-align:center;
        color:#F8F8FF;
    }
`;

interface TimerProps {
    timerClick: () => void
}

const TimerWrapper: React.FC<TimerProps> = ({ timerClick }) => {
    return (
        <Wrapper onClick={timerClick}>
            <GrAlarm style={{ position:"absolute" ,left:"-30px",top:"20px", width: "100px",opacity:"0.7" , height: "100px",color:"#1565C0" }} />
            <Timer>
                <div style={{ fontSize: "20px",fontWeight:"600" ,textAlign:"center",marginTop:"20px" }}>운동 타이머</div>
                <span>운동할때 타이머를 이용해 보세요</span>
            </Timer>
        </Wrapper>
    )
}

export default TimerWrapper