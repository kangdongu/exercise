import styled from "styled-components";
import { Challenge, Photo } from "../joined-room";
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { CgCloseO } from "react-icons/cg";
import { IoCheckmarkCircleOutline } from "react-icons/io5";


const MyChallengeWrapper = styled.div`
    width:100%;
    margin-top:20px;
`;
const WeekWrapper = styled.div`
   
`;
const WeekDataWrapper = styled.div`
    display:flex;
    gap:10px;
`;
const Week = styled.div`
    font-size:20px;
    span{
        margin-left:5px;
    }
`;

interface MyChallengeProps {
    challenge: Challenge;
    photoMyData: Photo[];
}

const MyChallenge: React.FC<MyChallengeProps> = ({ challenge, photoMyData }) => {


    const getWeekDates = (): string[] => {
        const today = new Date();
        const monday = startOfWeek(today, { weekStartsOn: 1 });
        const sunday = endOfWeek(today, { weekStartsOn: 1 });
        const dates = eachDayOfInterval({ start: monday, end: sunday });
        return dates.map(date => format(date, 'yyyy-MM-dd'));
    };

    const completedForDate = (date: string, 그룹챌린지제목: string): boolean => {
        return photoMyData.some(photo => photo.그룹챌린지제목 === 그룹챌린지제목 && photo.날짜 === date);
    };

    return (
        <MyChallengeWrapper>
            <WeekWrapper>
                <h4 style={{marginBottom:"10px"}}>주간 챌린지 근황</h4>
                <WeekDataWrapper>
                    {getWeekDates().map(date => (
                        <Week key={date}>
                            {format(new Date(date), 'EEE', { locale: ko })}
                            <span>{completedForDate(date, challenge.그룹챌린지제목) ? <IoCheckmarkCircleOutline style={{ color: "green" }} /> : <CgCloseO style={{ color: "red" }} />}</span>
                        </Week>
                    ))}
                </WeekDataWrapper>
            </WeekWrapper>
        </MyChallengeWrapper>
    )
}
export default MyChallenge;