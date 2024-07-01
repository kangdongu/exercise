import styled from "styled-components"
import { FaDumbbell } from "react-icons/fa6";

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
const EfficacyWrapper = styled.div`
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
interface efficacyProps {
    efficacyClick:() => void
}
const Efficacy:React.FC<efficacyProps> = ({efficacyClick}) => {
    return(
        <Wrapper onClick={efficacyClick}>
            <FaDumbbell style={{ position:"absolute" ,top:"20px", width: "100px",opacity:"0.8" , height: "100px",color:"#CF4FE0" }} />
            <EfficacyWrapper>
                <div style={{ fontSize: "18px",fontWeight:"600" ,textAlign:"center",marginTop:"25px" }} >운동별 정보</div>
                <span>운동의 장, 단점<br /> 효능에 대해 알아보세요</span>
           </EfficacyWrapper>
        </Wrapper>
    )
}
export default Efficacy