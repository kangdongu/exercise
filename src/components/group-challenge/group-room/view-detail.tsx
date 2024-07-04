import styled from "styled-components"


const Wrapper = styled.div`
    height: 90vh;
    overflow-y: scroll;
    width: 100%;
`;
const ImgWrapper = styled.div`

`;
const Img = styled.img`
    height:400px;
    width:100%;
`;
const DateWrapper = styled.div`

`;
const MemoWrapper = styled.div`

`;

interface Photo {
    id: string;
    날짜: string;
    인증사진: string;
    유저아이디: string;
    그룹챌린지제목: string;
    인증요일: string;
    인증내용: string;
}
interface detailProps{
    photo:Photo;
}

const ViewDetails:React.FC<detailProps> = ({photo}) => {

    return (
            <Wrapper>
                <ImgWrapper>
                    <Img src={photo.인증사진} />
                </ImgWrapper>
                <DateWrapper>
                    {photo.날짜} {photo.인증요일}요일
                </DateWrapper>
                <MemoWrapper>{photo.인증내용}</MemoWrapper>
            </Wrapper>
    )
}
export default ViewDetails