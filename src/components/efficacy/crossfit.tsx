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
    background-color: white;
    padding: 5px;
    border-radius: 5px;
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

const Crossfit = () => {
    return (
        <Wrapper>
            <Title>크로스핏의 장점</Title>

            <Section>
                <SectionTitle>전신 강화</SectionTitle>
                <Paragraph>
                    크로스핏은 전신을 강화하는 고강도 인터벌 트레이닝(HIIT)입니다. 다양한 운동을 통해 모든 주요 근육 그룹을 훈련시킵니다.
                </Paragraph>
                <Paragraph>
                    근력, 심폐 지구력, 유연성, 민첩성 등 다양한 체력 요소를 동시에 향상시킬 수 있습니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>고강도 인터벌 트레이닝</SectionTitle>
                <Paragraph>
                    크로스핏은 고강도 인터벌 트레이닝으로, 짧은 시간 내에 높은 강도의 운동을 반복하여 수행합니다. 이는 신체 능력을 극대화하고, 짧은 시간 내에 높은 칼로리 소모를 가능하게 합니다.
                </Paragraph>
                <Paragraph>
                    이러한 트레이닝 방식은 체지방 감소와 심폐 지구력 향상에 효과적입니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>다양한 운동 프로그램</SectionTitle>
                <Paragraph>
                    크로스핏은 매일 다른 운동 프로그램(WOD: Workout of the Day)을 제공하여 지루함을 방지하고, 다양한 운동을 통해 전신을 균형 있게 발달시킵니다.
                </Paragraph>
                <Paragraph>
                    운동 프로그램은 중량 들기, 체중 운동, 유산소 운동 등으로 구성되어 있어 다양한 운동 경험을 제공합니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>사회적 유대감</SectionTitle>
                <Paragraph>
                    크로스핏은 공동체 의식을 강조합니다. 그룹 트레이닝을 통해 서로를 격려하고 동기부여하며, 강한 사회적 유대감을 형성할 수 있습니다.
                </Paragraph>
                <Paragraph>
                    이러한 유대감은 운동 지속성을 높이고, 더 나은 성과를 내는 데 도움이 됩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>도전 정신 강화</SectionTitle>
                <Paragraph>
                    크로스핏은 끊임없이 새로운 도전 과제를 제공합니다. 높은 강도의 운동과 새로운 목표를 통해 자신의 한계를 극복하고, 도전 정신을 강화할 수 있습니다.
                </Paragraph>
                <Paragraph>
                    이러한 도전 정신은 운동 외의 일상 생활에서도 긍정적인 영향을 미칩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>주의점</SectionTitle>
                <Paragraph>
                    크로스핏은 강도가 높기 때문에, 처음 시작할 때는 무리하지 않고 점진적으로 강도를 높여야 합니다.
                </Paragraph>
            </Section>
        </Wrapper>
    );
};

export default Crossfit;
