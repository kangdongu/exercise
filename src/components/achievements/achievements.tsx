import styled from "styled-components"
import { GoTrophy } from "react-icons/go";

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
    grid-column:1/3;
     background: linear-gradient(to bottom, #FF6F61, #D32F2F);
`;
const AchievementsWrapper = styled.div`
    width:90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left:auto;
    z-index:10;
    gap:20px;
    color:white;
    span{
        font-size:14px;
        text-align:center;
        color:#F8F8FF;
    }
`;

interface achievmeentsProps {
    achievmeentsClick:() => void
}
const Achievements:React.FC<achievmeentsProps> = ({achievmeentsClick}) => {
    return(
        <Wrapper onClick={achievmeentsClick}>
              <GoTrophy style={{ position:"absolute" ,top:"20px",fontSize:"18px", width: "100px",opacity:"0.8" , height: "100px",color:"#FFD700" }} />
           <AchievementsWrapper>
                <div style={{ fontSize: "20px",fontWeight:"600" ,textAlign:"center",marginTop:"25px" }} >도전과제</div>
                <span>습관과 도전과제를 함께 쌓아보세요</span>
           </AchievementsWrapper>
        </Wrapper>
    )
}
export default Achievements