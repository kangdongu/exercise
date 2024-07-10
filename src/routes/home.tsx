import styled from "styled-components";
import TimerWrapper from "../components/timer/timer";
import PersonalChallenge from "../components/personal-challenge/personal-challenge";
import GroupChallenge from "../components/group-challenge/group-challenge";
import Badge from "../components/badge/badge";
import Achievements from "../components/achievements/achievements";
import Efficacy from "../components/efficacy/efficacy";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FaUserAlt } from "react-icons/fa";
import AchievementModal from "../components/achievement-alert";

const Wrapper = styled.div`
    width:100vw;
    margin: 0 auto;
    height:calc(100vh - 40px);
    padding: 40px 3.5vw;
    overflow-y:scroll;
     background-color:#f3f1f1;
    padding-bottom:0px;
`;
const GridWrapper = styled.div`
    width:100%;
    display: grid; 
    grid-template-columns:1fr 1fr;
    grid-template-rows: 140px 140px 140px 140px;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
`;
const ProfileWrapper = styled.div`
   display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const ProfileImgWrapper = styled.div`
   border-radius: 50%;
    overflow: hidden;
    background-color: #f3f1f1;
    width:80px;
    height:80px;
    border:0.1px solid #f3f1f1;
`;

export default function Home() {
    const navigate = useNavigate();
    const [userProfilePicUrl, setUserProfileUrl] = useState("");
    const [nickname, setNickname] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [showAchievements ,setShowAchievements] = useState(false);
    const [achievementName, setAchievementName] = useState("")
    const currentUser = auth.currentUser;

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            const currentUser = auth.currentUser
            try {
                if (currentUser) {
                    const storageRef = ref(storage, `avatars/${currentUser.uid}`);

                    const userProfileUrl = await getDownloadURL(storageRef);
                    setUserProfileUrl(userProfileUrl);
                }
            } catch (error) {
                console.error("유저 프로필을 찾지 못했습니다:", error);
            } finally {
                setLoading(true)
            }
        };
        fetchUserProfilePic();
    }, [currentUser]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (currentUser) {
                    const currentUserUID = currentUser.uid;
                    const usersCollectionRef = collection(db, "user");
                    const querySnapshot = await getDocs(
                        query(usersCollectionRef, where("유저아이디", "==", currentUserUID))
                    );
                    if (!querySnapshot.empty) {
                        const userNickname = querySnapshot.docs[0].data().닉네임;
                        setNickname(userNickname);
                    } else {
                        console.error("사용자 문서가 존재하지 않습니다.");
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [currentUser]);

    useEffect(() => {
        const fetchPersonalLongGoals = async () => {
            try {
                const longGoalRef = collection(db, 'personallonggoals');
                const querySnapshot = await getDocs(
                    query(longGoalRef, where("유저아이디", "==", currentUser?.uid), where("기간종료", "==", true))
                );

                if (!querySnapshot.empty) {
                    const achievementsRef = collection(db, 'achievements');
                    const q = query(achievementsRef);
                    const querySnapshotAchievement = await getDocs(q);

                    const achievementDoc = querySnapshotAchievement.docs.find(doc => doc.data().도전과제이름 === "장기챌린지 완료");

                    if (achievementDoc && !achievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                        const achievementRef = doc(db, 'achievements', achievementDoc.id);
                        await updateDoc(achievementRef, {
                            유저아이디: [...achievementDoc.data().유저아이디, currentUser?.uid]
                        });
                        setShowAchievements(true);
                        setAchievementName(achievementDoc.data().도전과제이름)
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPersonalLongGoals();
    }, []);

    const handleModalConfirm = () => {
        setShowAchievements(false)
    }

    return (
        <Wrapper>
            <ProfileWrapper>
                {isLoading && userProfilePicUrl === "" ? (
                    <ProfileImgWrapper>
                        <FaUserAlt style={{ width: '60px', height: '60px', marginLeft: '10px', marginTop: '20px', color: 'gray' }} />
                    </ProfileImgWrapper>
                ) : (
                    <ProfileImgWrapper>
                        <img style={{ width: '80px', height: '80px', borderRadius: '50%' }} src={userProfilePicUrl} />
                    </ProfileImgWrapper>
                )}
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{nickname}</span>
            </ProfileWrapper>
            <GridWrapper>
                <TimerWrapper timerClick={() => handleNavigation('/timer')} />
                <Badge badgeClick={() => handleNavigation('/badge')} />
                <PersonalChallenge personalClick={() => handleNavigation('/personal-challenge')} />
                <GroupChallenge GroupModal={() => handleNavigation('/group-challenge')} />
                <Achievements achievmeentsClick={() => handleNavigation('/achievements')} />
                <Efficacy efficacyClick={() => handleNavigation('/efficacy')} />
            </GridWrapper>
            {showAchievements && (
                <AchievementModal handleModalConfirm={handleModalConfirm} achievementName={achievementName} />
            )}
        </Wrapper>
    )
}