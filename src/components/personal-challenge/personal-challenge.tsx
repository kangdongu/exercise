import styled from "styled-components"
import { FaUser } from "react-icons/fa";

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
const PersonalWrapper = styled.div`
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

interface PersonalProps {
    personalClick: () => void;
}

const PersonalChallenge: React.FC<PersonalProps> = ({ personalClick }) => {

    return (
        <Wrapper onClick={personalClick}>
             <FaUser style={{ position:"absolute" ,left:"-30px",top:"20px", width: "100px",opacity:"0.8" , height: "100px",color:"white" }} />
            
            <PersonalWrapper>
               
                <div style={{ fontSize: "18px",fontWeight:"600" ,textAlign:"center",marginTop:"25px" }}>개인 챌린지</div>
                <span>혼자만의 습관을 새우고 완료해보세요</span>
            </PersonalWrapper>
        </Wrapper>
    )
}

export default PersonalChallenge