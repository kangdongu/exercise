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

const Pilates = () => {
    return (
        <Wrapper>
            <Title>필라테스의 장점</Title>

            <Section>
                <SectionTitle>코어 강화</SectionTitle>
                <Paragraph>
                    필라테스는 코어 근육을 강화하는 데 중점을 둔 운동입니다. 복부, 등, 엉덩이 등의 근육을 사용하여 신체의 안정성과 균형을 유지합니다.
                </Paragraph>
                <Paragraph>
                    강한 코어는 일상 생활에서의 자세를 개선하고, 부상을 예방하는 데 큰 도움이 됩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>유연성 및 유연성 향상</SectionTitle>
                <Paragraph>
                    필라테스는 근육의 유연성과 신체의 유연성을 동시에 향상시키는 데 도움이 됩니다. 다양한 동작을 통해 근육을 길게 늘리고, 관절의 움직임 범위를 넓힐 수 있습니다.
                </Paragraph>
                <Paragraph>
                    유연성 향상은 신체의 움직임을 더 자유롭고 쉽게 만들어 줍니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>정신 집중</SectionTitle>
                <Paragraph>
                    필라테스는 정신과 신체의 연결을 강조합니다. 운동 중에 호흡과 움직임에 집중함으로써 정신적인 명확성을 높이고 스트레스를 줄일 수 있습니다.
                </Paragraph>
                <Paragraph>
                    이 정신 집중은 일상 생활에서도 더 나은 집중력과 정신적 평온을 유지하는 데 도움이 됩니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>부드러운 움직임</SectionTitle>
                <Paragraph>
                    필라테스 운동은 부드럽고 통제된 움직임을 강조합니다. 이는 관절에 무리를 주지 않으면서도 효과적인 운동을 가능하게 합니다.
                </Paragraph>
                <Paragraph>
                    이러한 특성 덕분에 필라테스는 다양한 연령대와 체력 수준의 사람들이 쉽게 접근할 수 있는 운동입니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>신체 인식 향상</SectionTitle>
                <Paragraph>
                    필라테스는 신체 인식을 높이는 데 큰 도움이 됩니다. 운동을 통해 자신의 몸을 더 잘 이해하고, 신체의 움직임을 더 잘 조절할 수 있게 됩니다.
                </Paragraph>
                <Paragraph>
                    이는 일상 생활에서의 자세와 동작을 개선하여 전반적인 신체 건강을 증진시킵니다.
                </Paragraph>
            </Section>

            <Section>
                <SectionTitle>주의점</SectionTitle>
                <Paragraph>
                    필라테스를 할 때는 호흡과 동작의 조화를 잘 맞추는 것이 중요하며, 처음에는 전문가의 지도를 받는 것이 좋습니다.
                </Paragraph>
            </Section>
        </Wrapper>
    );
};

export default Pilates;