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

const Running = () => {
    return (
        <Wrapper>
            <Title>러닝의 장점</Title>

            <Section>
                <SectionTitle>심혈관 건강 개선</SectionTitle>
                <Paragraph>
                    러닝은 심장과 폐의 기능을 강화하여 심혈관 건강을 크게 개선시킵니다. 규칙적인 러닝은 혈압을 낮추고, 콜레스테롤 수치를 관리하며, 심장 질환의 위험을 줄이는 데 도움이 됩니다.
                </Paragraph>
                <Paragraph>
                    또한, 심폐 지구력을 향상시켜 일상 생활에서 더 많은 에너지를 느낄 수 있습니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>체중 관리</SectionTitle>
                <Paragraph>
                    러닝은 칼로리를 소모하는 효과적인 방법으로, 체중 감량 및 관리를 돕습니다. 고강도 러닝은 많은 칼로리를 소모하며, 대사를 촉진시켜 체지방을 줄이는 데 도움이 됩니다.
                </Paragraph>
                <Paragraph>
                    규칙적인 러닝은 신체 조성을 개선하고, 건강한 체중을 유지하는 데 중요합니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>정신 건강 개선</SectionTitle>
                <Paragraph>
                    러닝은 엔도르핀을 분비하여 기분을 좋게 하고, 스트레스를 줄이는 데 효과적입니다. 이는 '러너스 하이'로 알려져 있으며, 운동 후 기분이 좋아지는 현상입니다.
                </Paragraph>
                <Paragraph>
                    러닝은 우울증과 불안을 완화하고, 전반적인 정신 건강을 개선하는 데 도움이 됩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>뇌 활성화</SectionTitle>
                <Paragraph>
                    러닝 중에는 뇌가 활성화되어 더 창의적이고 명확한 사고를 할 수 있게 됩니다. 규칙적인 러닝은 뇌의 기능을 향상시키고, 인지 능력을 강화하는 데 도움을 줍니다.
                </Paragraph>
                <Paragraph>
                    이는 문제 해결 능력을 향상시키고, 학습 능력을 높이는 데도 긍정적인 영향을 미칩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>사회적 유대감 형성</SectionTitle>
                <Paragraph>
                    러닝은 다른 사람들과 함께 할 때 더 즐겁습니다. 러닝 클럽이나 그룹 러닝에 참여하면 새로운 사람들을 만나고, 사회적 유대감을 형성할 수 있습니다.
                </Paragraph>
                <Paragraph>
                    함께 달리면서 서로를 격려하고, 동기부여를 받을 수 있습니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>주의점</SectionTitle>
                <Paragraph>
                    러닝 중 부상을 방지하기 위해 올바른 신발을 착용하고, 충분한 워밍업과 쿨다운을 해야 합니다.
                </Paragraph>
            </Section>
        </Wrapper>
    );
};

export default Running;
