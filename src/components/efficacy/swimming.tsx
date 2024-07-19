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

const Swimming = () => {
    return (
        <Wrapper>
            <Title>수영의 장점</Title>

            <Section>
                <SectionTitle>전신 운동</SectionTitle>
                <Paragraph>
                    수영은 전신 운동으로, 모든 주요 근육 그룹을 사용하여 신체를 균형있게 발달시킵니다. 팔, 다리, 몸통 모두를 사용하여 근력을 향상시킬 수 있습니다.
                </Paragraph>
                <Paragraph>
                    또한, 수영은 유산소 운동으로 심폐 기능을 향상시키고, 체지방을 줄이는 데 효과적입니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>저충격 운동</SectionTitle>
                <Paragraph>
                    물 속에서 운동하기 때문에 관절에 가해지는 부담이 적어 저충격 운동으로 분류됩니다. 이는 관절염이나 부상 회복 중인 사람들에게 이상적인 운동입니다.
                </Paragraph>
                <Paragraph>
                    저충격 운동이지만 강도를 조절하여 높은 효과를 얻을 수 있습니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>유연성 향상</SectionTitle>
                <Paragraph>
                    수영은 유연성을 향상시키는 데 도움이 됩니다. 다양한 수영 동작을 통해 근육과 관절의 움직임 범위를 넓힐 수 있습니다.
                </Paragraph>
                <Paragraph>
                    규칙적인 수영은 신체의 유연성을 유지하고 개선하는 데 중요합니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>정신 건강 개선</SectionTitle>
                <Paragraph>
                    수영은 정신 건강에도 긍정적인 영향을 미칩니다. 물속에서의 움직임은 마음을 진정시키고 스트레스를 줄이는 데 도움을 줍니다.
                </Paragraph>
                <Paragraph>
                    규칙적인 수영은 우울증과 불안을 완화하고, 전반적인 정신 건강을 향상시킵니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>주의점</SectionTitle>
                <Paragraph>
                    물속에서 운동하는 동안 탈수 상태가 될 수 있으므로, 충분한 수분 섭취가 필요합니다.
                </Paragraph>
            </Section>
        </Wrapper>
    );
};

export default Swimming;