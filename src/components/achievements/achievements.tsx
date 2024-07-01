import styled from "styled-components"
import { HiMiniTrophy } from "react-icons/hi2";

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
    grid-column:1/3;
`;
const AchievementsWrapper = styled.div`
    width:90%;
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

interface achievmeentsProps {
    achievmeentsClick:() => void
}
const Achievements:React.FC<achievmeentsProps> = ({achievmeentsClick}) => {
    return(
        <Wrapper onClick={achievmeentsClick}>
              <HiMiniTrophy style={{ position:"absolute" ,top:"20px", width: "100px",opacity:"0.8" , height: "100px",color:"#e6e322" }} />
           <AchievementsWrapper>
                <div style={{ fontSize: "18px",fontWeight:"600" ,textAlign:"center",marginTop:"25px" }} >도전과제</div>
                <span>습관과 도전과제를 함께 쌓아보세요</span>
           </AchievementsWrapper>
        </Wrapper>
    )
}
export default Achievements