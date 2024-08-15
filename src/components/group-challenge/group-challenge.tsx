import styled from "styled-components"
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoArrowForwardCircle } from "react-icons/io5";

const Wrapper = styled.div`
    border-radius: 10px;
    padding: 15px;
    align-items: center;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
     background: linear-gradient(to bottom, #FF6A89, #FC286E);
`;
const GroupWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap:5px;
    span {
        font-size: 14px;
        color: #f0f0f0;
    }
    svg{
        width:40px;
        height:40px;
        margin-top:20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;
const TextWrapper = styled.div`
    width:80%;
`;

interface GroupProps {
    GroupModal: () => void;
}
const GroupChallenge: React.FC<GroupProps> = ({ GroupModal }) => {
    return (
        <Wrapper onClick={GroupModal}>
            <HiOutlineUserGroup style={{ width: "60px", height: "60px", color: "#ffffff", marginBottom: '15px' }} />
            <GroupWrapper>
                <TextWrapper>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: '5px' }}>그룹챌린지</div>
                    <span>사람들과 함께 실천해보세요</span>
                </TextWrapper>
                <IoArrowForwardCircle />
            </GroupWrapper>
        </Wrapper>
    )
}
export default GroupChallenge