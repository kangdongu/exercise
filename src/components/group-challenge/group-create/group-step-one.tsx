import styled from "styled-components"

const Wrapper = styled.div`

`;
const TitleWrapper = styled.div`

`;
const TitleTitle = styled.h4`

`;
const Title = styled.input`
    font-size:16px;
    width:95%;
    height:70px;
    border-radius:5px;
    background-color:#f1f1f1;
    border:none;
    padding:20px;
`;
const ContentWrapper = styled.div`

`;
const ContentTitle = styled.h4`

`;
const ContentText = styled.textarea`
    height:120px;
    width:95%;
    font-size:16px;
    border-radius:10px;
    background-color:#f1f1f1;
    padding: 20px;
    border:none;
    box-sizing: border-box;
`;
const ButtonWrapper = styled.div`
    display:flex;
    padding:20px;

`;
const Button = styled.button`
   width:100px;
    height:50px;
    text-align:center;
    line-height:50px;
    color:white;
    border:none;
    border-radius:15px;
    font-size:18px;
    background-color:#FF6384;
    margin-left:auto;
`;

interface StepOneProps {
    nextStep: () => void;
    title: string;
    contentText: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const GroupCreateStepOne: React.FC<StepOneProps> = ({ nextStep, title, contentText, onTitleChange, onContentChange }) => {
    const completeNextStep = () => {
        if(title && contentText){
            nextStep()
        }else{
            alert("제목과 내용을 입력해주세요")
        }
    }

    return (
        <Wrapper>
            <TitleWrapper>
                <TitleTitle>챌린지 제목을 적어주세요 *</TitleTitle>
                <Title placeholder="챌린지 제목 입력" onChange={onTitleChange} value={title} type="text" name="title" />
            </TitleWrapper>

            <ContentWrapper>
                <ContentTitle>챌린지 내용을 입력해주세요 *</ContentTitle>
                <ContentText placeholder="챌린지 내용 입력" onChange={onContentChange} value={contentText} name="content_text" />
            </ContentWrapper>
            <ButtonWrapper>
                <Button onClick={completeNextStep}>다음단계</Button>
            </ButtonWrapper>
        </Wrapper>
    )
}
export default GroupCreateStepOne