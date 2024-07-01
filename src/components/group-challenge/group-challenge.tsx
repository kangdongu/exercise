import styled from "styled-components"
import { FaUserGroup } from "react-icons/fa6";


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
const GroupWrapper = styled.div`
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

interface GroupProps {
    GroupModal: () => void;
}
const GroupChallenge: React.FC<GroupProps> = ({ GroupModal }) => {
    return (
        <Wrapper onClick={GroupModal}>
            <FaUserGroup style={{ position: "absolute", left: "-30px", top: "20px", width: "100px", opacity: "0.8", height: "100px", color: "white" }} />
            <GroupWrapper>
                <div style={{ fontSize: "18px", fontWeight: "600", textAlign: "center", marginTop: "25px" }}>그룹챌린지</div>
                <span>사람들과 함께 챌린지를 실천해보세요</span>
            </GroupWrapper>
        </Wrapper>
    )
}
export default GroupChallenge