import styled from "styled-components"
import { Challenge, Photo } from "../joined-room";
import {  eachDayOfInterval, getDay, parseISO } from "date-fns";
import DonutChart from "../../personal-challenge/donut-chart";

const Wrapper = styled.div`

`;
const ChartWrapper = styled.div`
    height:150px;
    margin-top:20px;
    display: flex;
    justify-content: space-around;
`;
const PresentChartWrapper = styled.div`
    width:40%;
    height:100px;
    display:flex;
    flex-direction: column;
    align-items: center;
`;
const PresentChartPercent = styled.div`

`;
const TotalChartWrapper = styled.div`
      width:40%;
    height:100px;
    display:flex;
    flex-direction: column;
    align-items: center;
`;

interface OurChallengeProps {
    challenge: Challenge;
    photoData: Photo[];
}

const dayMapping: { [key: string]: number } = {
    '일': 0,
    '월': 1,
    '화': 2,
    '수': 3,
    '목': 4,
    '금': 5,
    '토': 6,
};

const getSelectedDaysCount = (startDate: string, endDate: string, selectedDays: string[]): number => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const interval = eachDayOfInterval({ start, end });

    const selectedDayIndices = selectedDays.map(day => dayMapping[day]);

    const filteredDates = interval.filter(date => selectedDayIndices.includes(getDay(date)));

    return filteredDates.length;
};

const OurChallenge: React.FC<OurChallengeProps> = ({ challenge, photoData }) => {
    const currentDate = new Date();

    const selectedDays = challenge.요일선택;
    const totalDaysUntilToday = getSelectedDaysCount(challenge.시작날짜, currentDate.toISOString(), selectedDays);
    const presentTotalUntilToday = totalDaysUntilToday * challenge.유저아이디.length;

    const totalDaysUntilEnd = getSelectedDaysCount(challenge.시작날짜, challenge.종료날짜, selectedDays);
    const totalUntilEnd = totalDaysUntilEnd * challenge.유저아이디.length;

    const calculatePercent = (completed: number, total: number) => {
        if (total === 0) {
            return "0.00";
        } else {
            return ((completed / total) * 100).toFixed(2);
        }
    };

    return (
        <Wrapper>
            <ChartWrapper>
                <PresentChartWrapper>
                    <DonutChart completed={photoData.length} total={presentTotalUntilToday} />
                    <PresentChartPercent>{calculatePercent(photoData.length, presentTotalUntilToday)}%</PresentChartPercent>
                    <div>현재까지의 달성률</div>
                </PresentChartWrapper>
                <TotalChartWrapper>
                    <DonutChart completed={photoData.length} total={totalUntilEnd} />
                    <PresentChartPercent>{calculatePercent(photoData.length, totalUntilEnd)}%</PresentChartPercent>
                    <div>전체 목표 달성률</div>
                </TotalChartWrapper>
            </ChartWrapper>
        </Wrapper>
    );
};

export default OurChallenge;
