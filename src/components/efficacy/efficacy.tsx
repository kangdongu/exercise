import styled from "styled-components"
import { CiDumbbell } from "react-icons/ci";

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
     background: linear-gradient(to bottom, #BEE3F8, #6DAEDB);
`;
const EfficacyWrapper = styled.div`
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
interface efficacyProps {
    efficacyClick: () => void
}
const Efficacy: React.FC<efficacyProps> = ({ efficacyClick }) => {
    return (
        <Wrapper onClick={efficacyClick}>
            <CiDumbbell style={{ position:"absolute" ,left:"-30px",top:"20px", width: "100px",opacity:"0.7" , height: "100px",color:"#8E24AA" }} />
            <EfficacyWrapper>
                <div style={{fontSize:"20px", fontWeight:"600", textAlign:"center",marginTop:"20px"}} >운동별 정보</div>
                <span>운동의 장, 단점<br /> 효능에 대해 알아보세요</span>
            </EfficacyWrapper>
        </Wrapper>
    )
}
export default Efficacy