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

const HealthGym = () => {
    return (
        <Wrapper>
            <Title>헬스의 장점</Title>

            <Section>
                <SectionTitle>근력 향상</SectionTitle>
                <Paragraph>
                    헬스는 근력을 향상시키는 데 매우 효과적이에요. 다양한 기구와 웨이트 트레이닝을 통해 근육을 강화하고, 신체의 밸런스를 맞출 수 있습니다.
                </Paragraph>
                <Paragraph>
                    근력 운동은 뼈를 강하게 하고, 골밀도를 높이는 데 도움이 됩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>체중 관리</SectionTitle>
                <Paragraph>
                    규칙적인 헬스 운동은 체지방을 감소시키고, 건강한 체중을 유지하는 데 큰 도움이 됩니다. 유산소 운동과 근력 운동을 병행하면 효과가 더 커요.
                </Paragraph>
                <Paragraph>
                    체중 관리는 심혈관 건강과 대사 기능을 개선하는 데도 중요합니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>정신 건강 개선</SectionTitle>
                <Paragraph>
                    헬스 운동은 스트레스를 줄이고, 정신 건강을 개선하는 데 효과적입니다. 운동 중에 분비되는 엔도르핀은 기분을 좋게 하고, 우울증과 불안을 완화시킵니다.
                </Paragraph>
                <Paragraph>
                    규칙적인 운동은 수면의 질을 높이고, 전반적인 생활 만족도를 증가시킵니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>사회적 연결</SectionTitle>
                <Paragraph>
                    헬스장은 새로운 사람들을 만날 수 있는 좋은 장소입니다. 같은 목표를 가진 사람들과 함께 운동하면 동기부여가 되고, 사회적 유대감을 형성할 수 있습니다.
                </Paragraph>
                <Paragraph>
                    그룹 운동 클래스나 파트너와 함께하는 운동은 더욱 즐겁고 지속 가능하게 만들어 줍니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>주의점</SectionTitle>
                <Paragraph>
                    잘못된 자세로 운동하면 부상의 위험이 있으므로, 항상 올바른 자세와 적절한 중량을 유지하는 것이 중요합니다.
                </Paragraph>
            </Section>
        </Wrapper>
    );
};

export default HealthGym;
