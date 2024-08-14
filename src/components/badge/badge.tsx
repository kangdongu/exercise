import styled from "styled-components"
import { RiPoliceBadgeLine } from "react-icons/ri";

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
     background: linear-gradient(to bottom, #a7b0e7, #0079ff);
`;
const TimerWrapper = styled.div`
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
interface badgeProps {
    badgeClick: () => void
}
const Badge: React.FC<badgeProps> = ({ badgeClick }) => {
    return (
        <Wrapper onClick={badgeClick}>
            <RiPoliceBadgeLine style={{ position:"absolute" ,left:"-30px",top:"20px", width: "100px",opacity:"0.7" , height: "100px",color:"#FFEB3B" }} />
            
            <TimerWrapper>
                <div style={{fontSize:"20px", fontWeight:"600", textAlign:"center",marginTop:"20px"}}>뱃지 현황</div>
                <span>운동 습관을 완료하고 뱃지를 획득해보세요</span>
            </TimerWrapper>
        </Wrapper>
    )
}
export default Badge