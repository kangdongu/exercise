import styled from "styled-components"
import { RiPoliceBadgeFill } from "react-icons/ri";

const Wrapper = styled.div`
    border-radius:10px;
    padding: 5px 5px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    color:black;
    background-color:#f8a9a9;
    position:relative;
    overflow:hidden;
`;
const TimerWrapper = styled.div`
    width:70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left:auto;
    z-index:10;
    gap:20px;
    color:#990033;
    span{
        font-size:14px;
        text-align:center;
        color:#333333;
    }
`;
interface badgeProps {
    badgeClick: () => void
}
const Badge: React.FC<badgeProps> = ({ badgeClick }) => {
    return (
        <Wrapper onClick={badgeClick}>
            <RiPoliceBadgeFill style={{ position:"absolute" ,left:"-30px",top:"20px", width: "100px",opacity:"0.8" , height: "100px",color:"#e6e322" }} />
            
            <TimerWrapper>
                <div style={{fontSize:"18px", fontWeight:"600", textAlign:"center",marginTop:"25px"}}>뱃지 현황</div>
                <span>운동 습관을 완료하고 뱃지를 획득해보세요</span>
            </TimerWrapper>
        </Wrapper>
    )
}
export default Badge