import styled from "styled-components"
// import { FaRegUser } from "react-icons/fa";
import { IoArrowForwardCircle } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";

const Wrapper = styled.div`
    border-radius: 10px;
    padding: 15px;
    align-items: center;
    color: #333333;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    // background: linear-gradient(to bottom, #7EC8E3, #4CA7D8);
    background-color:white;
`;

const PersonalWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap:5px;
    span {
        font-size: 14px;
        color: #333333;
    }
    svg{
        width:40px;
        height:40px;
        margin-top:20px;
        color:#4CA7D8;
        // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;
const TextWrapper = styled.div`
    width:80%;
`;

interface exDataProps {
    exDataClick: () => void;
}

const ExerciseData: React.FC<exDataProps> = ({ exDataClick }) => {
    return (
        <Wrapper onClick={exDataClick}>
            <MdOutlineDateRange style={{ width: "50px", height: "50px", color: "#4CA7D8", marginBottom: '15px' }} />
            <PersonalWrapper>
                <TextWrapper>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: '5px' }}>운동데이터</div>
                    <span>이때 까지의 운동데이터를 확인해보세요</span>
                </TextWrapper>
                <IoArrowForwardCircle />
            </PersonalWrapper>
        </Wrapper>
    )
}

export default ExerciseData;