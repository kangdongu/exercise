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
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FaUserAlt } from "react-icons/fa";
import AchievementModal from "../components/achievement-alert";
import BadgeModal from "../components/badge-modal";
import LoadingScreen from "../components/loading-screen";
import { format, isBefore, startOfToday } from "date-fns";
import { GoBell } from "react-icons/go";
import { IoIosMenu } from "react-icons/io";
import MenuModal from "../components/menu/menu";
import BellModal from "../components/bell";
import ThisWeekRecords from "../components/this-week-records";

const Wrapper = styled.div`
    width:100vw;
    margin: 0 auto;
    height:calc(100vh - 40px);
    padding: 40px 25px;
    overflow-y:scroll;
    background-color:#F0F0F0;
    position:relative;
`;
const GridWrapper = styled.div`
    width:100%;
    display: grid; 
    grid-template-columns:1fr 1fr;
    grid-template-rows: 180px 180px 180px;
    grid-column-gap: 25px;
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
    position:relative;
`;
const ProfileImgWrapper = styled.div`
   border-radius: 50%;
    overflow: hidden;
    background-color: #f3f1f1;
    width:70px;
    height:70px;
    border:0.1px solid #f3f1f1;
`;
const HeaderContentWrapper = styled.div`
    margin-left:auto;
    display:flex;
    gap:10px;
    position:relative;
    svg{
        width:25px;
        height:25px;
    }
`;

export default function Home() {
    const navigate = useNavigate();
    const [userProfilePicUrl, setUserProfileUrl] = useState("");
    const [nickname, setNickname] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [showAchievements, setShowAchievements] = useState(false);
    const [achievementName, setAchievementName] = useState("");
    const [badgeImg, setBadgeImg] = useState("");
    const [badgeName, setBadgeName] = useState("");
    const [showBadge, setShowBadge] = useState(false);
    const [menuOn, setMenuOn] = useState(false);
    const [bellOn, setBellOn] = useState(false);
    const [bellAlerm, setBellAlerm] = useState(false);
    const currentUser = auth.currentUser;

    const handleNavigation = (path: string) => {
        navigate(path);
    };
    useEffect(() => {
        setBellAlerm(true)
    }, [])

    useEffect(() => {
        const todayExerciseReset = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const currentUserUID = currentUser.uid;
                    const today = new Date();
                    const formattedDate = format(today, 'yyyy-MM-dd');

                    const usersRef = collection(db, "user");
                    const userQuerySnapshot = await getDocs(query(usersRef, where("유저아이디", "==", currentUserUID)));

                    if (!userQuerySnapshot.empty) {
                        const userDoc = userQuerySnapshot.docs[0];
                        const lastExerciseDate = userDoc.data().마지막운동 || '';
                        const isExerciseDoneToday = format(new Date(), 'yyyy-MM-dd') === lastExerciseDate;

                        if (!isExerciseDoneToday) {
                            await updateDoc(userDoc.ref, { 오늘운동: false });

                            const gender = userDoc.data().성별;
                            const charactersRef = collection(db, "characters");
                            const characterSnapshot = await getDocs(query(charactersRef, where("성별", "==", gender === "남자" ? "남성" : "여성")));

                            if (!characterSnapshot.empty) {
                                const characterDoc = characterSnapshot.docs[0];
                                const stepsRef = collection(characterDoc.ref, "steps");

                                const stepSnapshot = await getDocs(query(stepsRef, where("단계", "==", userDoc.data().단계)));

                                if (stepSnapshot && !stepSnapshot.empty) {
                                    const stepDoc = stepSnapshot.docs[0];
                                    const exerciseBeforeImage = stepDoc.data().운동전;

                                    await updateDoc(userDoc.ref, {
                                        캐릭터이미지: exerciseBeforeImage,
                                        마지막운동: formattedDate,
                                    });
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error updating user data:", error);
            }
        };

        const now = new Date();
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0);

        if (isBefore(now, startOfToday())) {
            todayExerciseReset();
        }

        const timer = setTimeout(() => {
            todayExerciseReset();
        }, midnight.getTime() - now.getTime());

        return () => clearTimeout(timer);
    }, [currentUser]);



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
                setLoading(false);
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

                const longGoalsLength = [...new Set(querySnapshot.docs.map(doc => doc.data().종료날짜))]

                if (!querySnapshot.empty) {
                    const achievementsRef = collection(db, 'achievements');
                    const q = query(achievementsRef);
                    const querySnapshotAchievement = await getDocs(q);

                    const mainAchievementDoc = querySnapshotAchievement.docs.find(doc => doc.data().도전과제이름 === "장기챌린지 완료");

                    if (mainAchievementDoc) {
                        const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                        const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                        let subAchievementDoc;
                        if (longGoalsLength.length >= 10) {
                            subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "10번째 장기챌린지 완료");
                        } else if (longGoalsLength.length >= 8) {
                            subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "8번째 장기챌린지 완료");
                        } else if (longGoalsLength.length >= 5) {
                            subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "5번째 장기챌린지 완료");
                        } else if (longGoalsLength.length >= 3) {
                            subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "3번째 장기챌린지 완료");
                        } else if (longGoalsLength.length >= 1) {
                            subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 장기챌린지 완료");
                        }

                        if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(currentUser?.uid)) {
                            const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                            await updateDoc(subAchievementRef, {
                                유저아이디: arrayUnion(currentUser?.uid),
                            });
                            setAchievementName(subAchievementDoc.data().도전과제이름);
                            setShowAchievements(true);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        const countAchievementsAndAddBadges = async () => {
            try {
                if (currentUser) {
                    const achievementsRef = collection(db, 'achievements');
                    const achievementSnapshot = await getDocs(achievementsRef);
                    let achievementCount = 0;

                    for (const doc of achievementSnapshot.docs) {
                        const subAchievementsRef = collection(db, `achievements/${doc.id}/${doc.id}`);
                        const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                        subAchievementsSnapshot.docs.forEach(subDoc => {
                            if (subDoc.data().유저아이디.includes(currentUser.uid)) {
                                achievementCount += 1;
                            }
                        });
                    }

                    let badgeName;

                    if (achievementCount >= 25) {
                        badgeName = "도전과제 25개 달성"
                    } else if (achievementCount >= 20) {
                        badgeName = "도전과제 20개 달성";
                    } else if (achievementCount >= 15) {
                        badgeName = "도전과제 15개 달성";
                    } else if (achievementCount >= 10) {
                        badgeName = "도전과제 10개 달성";
                    } else if (achievementCount >= 5) {
                        badgeName = "도전과제 5개 달성";
                    } else if (achievementCount >= 1) {
                        badgeName = "도전과제 1개 달성";
                    }

                    if (badgeName) {
                        const badgesRef = collection(db, 'badges');
                        const badgeDoc = await getDocs(query(badgesRef, where("뱃지이름", "==", badgeName)));
                        if (!badgeDoc.empty && !badgeDoc.docs[0].data().유저아이디.includes(currentUser.uid)) {
                            const badgeRef = doc(db, 'badges', badgeDoc.docs[0].id);
                            await updateDoc(badgeRef, {
                                유저아이디: arrayUnion(currentUser.uid),
                            });
                            setBadgeImg(badgeDoc.docs[0].data().뱃지이미지);
                            setBadgeName(badgeDoc.docs[0].data().뱃지이름);
                            setShowBadge(true);
                        }
                    }
                }

            } catch (error) {
                console.log(error);
            }
        };
        fetchPersonalLongGoals();
        countAchievementsAndAddBadges();
    }, []);

    const handleModalConfirm = () => {
        setShowAchievements(false)
    }
    const badgeModalConfirm = () => {
        setShowBadge(false)
    }

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    const menuClick = () => {
        if (menuOn) {
            setMenuOn(false)
        } else {
            setMenuOn(true)
        }
    }
    const bellClick = () => {
        if (bellOn) {
            setBellOn(false)
        } else {
            setBellOn(true)
        }
    }

    return (
        <Wrapper>
            <ProfileWrapper>
                {!isLoading && userProfilePicUrl === "" ? (
                    <ProfileImgWrapper>
                        <FaUserAlt style={{ width: '45px', height: '45px', marginLeft: '17.5px', marginTop: '17.5px', color: 'gray' }} />
                    </ProfileImgWrapper>
                ) : (
                    <ProfileImgWrapper>
                        <img style={{ width: '70px', height: '70px', borderRadius: '50%' }} src={userProfilePicUrl} />
                    </ProfileImgWrapper>
                )}
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{nickname}</span>
                <HeaderContentWrapper>
                    {bellAlerm && (
                        <div style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'red', left: '20px' }} />
                    )}
                    <GoBell onClick={() => { bellClick; alert("업데이트 예정입니다") }} />
                    <IoIosMenu onClick={menuClick} style={{ width: '32px', height: '32px', marginTop: '-5px' }} />
                </HeaderContentWrapper>
            </ProfileWrapper>
            <ThisWeekRecords />
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
            {showBadge && (
                <BadgeModal badgeImg={badgeImg} badgeName={badgeName} badgeModalConfirm={badgeModalConfirm} />
            )}
            {menuOn && (
                <MenuModal onClose={menuClick} />
            )}
            {bellOn && (
                <BellModal onClose={bellClick} />
            )}
        </Wrapper>
    )
}