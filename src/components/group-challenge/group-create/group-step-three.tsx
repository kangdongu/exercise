import styled from "styled-components"

const Wrapper = styled.div`
    width:100%;
    
`;
const ButtonWrapper = styled.div`
    display:flex;
    margin-top:20px;
    gap:20px;
    margin-bottom:30px;
    position:fixed;
    bottom:40px;
    width:100%;
    justify-content: space-around;
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
`;
const CategoryWrapper = styled.div`
    display:flex;
    flex-wrap: wrap;
    gap:10px;
    margin: 20px 0px;
`;
const Category = styled.div<{selected:boolean}>`
    padding:14px 18px;
    border-radius:10px;
    background-color:${(props) => props.selected ?  '#FF6384' : '#f1f1f1'};
    color:${(props) => props.selected ? "white" : "#333333"}
`;

interface StepThreeProps {
    nextStep: () => void;
    prevStep: () => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const GroupCreateStepThree: React.FC<StepThreeProps> = ({
    nextStep,
    prevStep,
    selectedCategory,
    onCategoryChange
}) => {
    const categoryTitle : string[]  = ['해당없음', "운동습관", "다이어트", "기록습관", "하루기록", "생활습관"]

    return (
        <Wrapper>
            <CategoryWrapper>
                {categoryTitle.map((category) => (
                    <Category key={category} selected={selectedCategory === category} onClick={() => onCategoryChange(category)}>{category}</Category>
                ))}
            </CategoryWrapper>
            <ButtonWrapper>
                <Button style={{ backgroundColor: 'lightgray' }} onClick={prevStep}>이전</Button>
                <Button style={{ backgroundColor: '#FF6384' }} onClick={nextStep}>다음단계</Button>
            </ButtonWrapper>
        </Wrapper>
    )
}
export default GroupCreateStepThree