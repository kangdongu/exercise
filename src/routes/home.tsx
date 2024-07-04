import styled from "styled-components";
import TimerWrapper from "../components/timer/timer";
import { useState } from "react";
import MoSlideModal from "../components/slideModal/mo-slide-modal";
import TimerContent from "../components/timer/timer-content";
import PersonalChallenge from "../components/personal-challenge/personal-challenge";
import PersonalContent from "../components/personal-challenge/personal-modal";
import GroupList from "../components/group-challenge/group-list";
import GroupChallenge from "../components/group-challenge/group-challenge";
import Badge from "../components/badge/badge";
import BadgeContent from "../components/badge/badgeContent";
import Achievements from "../components/achievements/achievements";
import AchievementsContent from "../components/achievements/achievements-content";
import { ChallengeProvider } from "../components/group-challenge/group-context";
import Efficacy from "../components/efficacy/efficacy";
import EfficacyContent from "../components/efficacy/efficacy-content";

const Wrapper = styled.div`
    width:100vw;
    margin: 0 auto;
    display: grid; 
    grid-template-columns:1fr 1fr;
    grid-template-rows: 150px 150px 150px 150px;
    grid-column-gap: 20px;
    grid-row-gap: 30px;
    height:97vh;
    padding: 40px 3.5vw;
    overflow-y:scroll;
     background-color:#f3f1f1;
    padding-bottom:0px;
`;

export default function Home() {
    const [timerModalOpen, setTimerModalOpen] = useState(false);
    const [personalModal, setPersonalModal] = useState(false);
    const [groupModal, setGroupModal] = useState(false);
    const [badgeModal, setBadgeModal] = useState(false)
    const [achievements, setAchievements] = useState(false)
    const [efficacy, setEfficacy] = useState(false)

    const TimerModal = () => {
        setTimerModalOpen(true)
    }
    const PersonalModal = () => {
        setPersonalModal(true)
    }
    const GroupModal = () => {
        setGroupModal(true)
    }
    const BadgeModal = () => {
        setBadgeModal(true)
    }
    const AchievementsModal = () => {
        setAchievements(true)
    }
    const EfficacyModal = () => {
        setEfficacy(true)
    }

    return (
        <Wrapper>
            {timerModalOpen ? (
                <MoSlideModal onClose={() => { setTimerModalOpen(false) }}>
                    <TimerContent></TimerContent>
                </MoSlideModal>) : null}
            <TimerWrapper timerClick={TimerModal}>

            </TimerWrapper>
            {badgeModal ? (
                <MoSlideModal onClose={() => { setBadgeModal(false) }}>
                    <BadgeContent></BadgeContent>
                </MoSlideModal>
            ) : null}
            <Badge badgeClick={BadgeModal} />
            {personalModal ? (
                <MoSlideModal onClose={() => { setPersonalModal(false) }}>
                    <PersonalContent></PersonalContent>
                </MoSlideModal>
            ) : null}
            <PersonalChallenge personalClick={PersonalModal} />
            {groupModal ? (
                <ChallengeProvider>
                    <MoSlideModal onClose={() => { setGroupModal(false) }}>
                        <GroupList></GroupList>
                    </MoSlideModal>
                </ChallengeProvider>
            ) : null}
            <GroupChallenge GroupModal={GroupModal} />
            {achievements ? (
                <MoSlideModal onClose={() => { setAchievements(false) }}>
                    <AchievementsContent />
                </MoSlideModal>
            ) : null}
            <Achievements achievmeentsClick={AchievementsModal} />
            {efficacy ? (
                <MoSlideModal onClose={() => setEfficacy(false)}>
                    <EfficacyContent />
                </MoSlideModal>
            ) : null}
            <Efficacy efficacyClick={EfficacyModal} />
        </Wrapper>
    )
}