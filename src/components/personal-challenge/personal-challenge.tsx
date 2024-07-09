import styled from "styled-components"
import { FaUser } from "react-icons/fa";

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
     background: linear-gradient(to bottom, #FF6F61, #D32F2F);
`;
const PersonalWrapper = styled.div`
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
        color:#FFF8E1;
    }
`;

interface PersonalProps {
    personalClick: () => void;
}

const PersonalChallenge: React.FC<PersonalProps> = ({ personalClick }) => {

    return (
        <Wrapper onClick={personalClick}>
             <FaUser style={{ position:"absolute" ,left:"-30px",top:"20px", width: "100px",opacity:"0.8" , height: "100px",color:"E91E63" }} />
            
            <PersonalWrapper>
               
                <div style={{ fontSize: "20px",fontWeight:"600" ,textAlign:"center",marginTop:"20px" }}>개인 챌린지</div>
                <span>혼자만의 습관을 새우고 완료해보세요</span>
            </PersonalWrapper>
        </Wrapper>
    )
}

export default PersonalChallenge