import styled from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f1f3f3;
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
`;

const Section = styled.div`
    margin-bottom: 20px;
    background-color:white;
    padding:5px;
    border-radius:5px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    color: #555;
    margin-bottom: 10px;
`;

const Paragraph = styled.p`
    font-size: 16px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 10px;
`;

const ExerciseEfficacy = () => {
    return (
        <Wrapper>
            <Title>운동의 효능</Title>

            <Section>
                <SectionTitle>신체적 효능</SectionTitle>
                <Paragraph>
                    운동은 체력을 향상시키고 근력을 증가시켜요. 체지방도 감소시켜서 더 건강한 몸을 만들어 줍니다. 규칙적인 운동을 하면 심혈관 건강이 좋아지고, 면역력도 강해져요. 만성 질환 예방에도 큰 도움이 됩니다.
                </Paragraph>
                <Paragraph>
                    전반적으로, 운동은 우리 몸을 건강하게 유지하고 개선하는 데 중요한 역할을 해요.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>성공 습관 형성</SectionTitle>
                <Paragraph>
                    운동을 할 때 목표를 세우고 달성하면 성공 습관이 생겨요. 이런 습관은 자신에 대한 신뢰를 높이고, 자신감을 줍니다.
                </Paragraph>
                <Paragraph>
                    자신을 믿게 되면 무엇이든 할 수 있다는 마음가짐이 생겨서 무기력함을 빨리 극복할 수 있어요. 나를 잘 알고 믿는 것은 큰 힘이 됩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>정신적 효능</SectionTitle>
                <Paragraph>
                    뛰거나 걸을 때 뇌가 활성화되어 창의적인 생각과 더 좋은 사고를 할 수 있어요. 운동은 문제 해결 능력을 키우고, 스트레스를 줄이며, 전반적인 정신 건강을 개선해 줍니다.
                </Paragraph>
                <Paragraph>
                    운동은 마음의 평화를 찾고 긍정적인 마음을 유지하는 데 중요한 역할을 해요.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>나를 믿는 힘</SectionTitle>
                <Paragraph>
                    운동을 통해 얻는 가장 큰 이점 중 하나는 자신에 대한 신뢰가 높아진다는 거예요. 목표를 세우고 이를 달성하면서 나는 무엇이든 할 수 있다는 믿음이 생깁니다.
                </Paragraph>
                <Paragraph>
                    이 믿음은 나를 잘 알게 하고, 무기력증을 극복하며, 삶의 여러 도전에 맞설 수 있는 힘을 줍니다.
                </Paragraph>
            </Section>
        </Wrapper>
    );
}

export default ExerciseEfficacy;
