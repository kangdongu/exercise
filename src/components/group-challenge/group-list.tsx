import { useEffect, useState } from "react";
import styled from "styled-components"
import GroupCreate from "./group-create";
import GroupGlasses from "./group-glasses";
import { IoSearch } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { auth, db } from "../../firebase";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";
import JoinedRoom from "./joined-room";
import { useChallenges } from "./group-context";
import { FaArrowUp } from "react-icons/fa";
import MoSlideModal from "../slideModal/mo-slide-modal";
import { useNavigate } from "react-router-dom";
import AchievementModal from "../achievement-alert";
import { CiFilter } from "react-icons/ci";
import FilterComponent from "./filter";

const Wrapper = styled.div`
    width:100%;
    height:calc(100vh - 80px);
    padding:15px;
    box-sizing:border-box;
    overflow-y:scroll;
`;
const CreateButtonWrapper = styled.div`
    width:100%;
    display: flex;
    justify-content: flex-end;
`;
const CreateChallengeButton = styled.div`
    font-size:16px;
    align-items: center;
    span{
        color:#ff0000;
        font-size:25px;
        font-weight:700;
    }
`;
const SelectRender = styled.select`
    border-radius:5px;
    height:25px;
    font-size:16px;
    border:1px solid black;
`;
const RenderOption = styled.option`

`;
const ListWrapper = styled.div`
    width:100%;
    margin-top:20px;
`;
const List = styled.div`
    width: 100%;
    height: 60px;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;
    position:relative;
    margin-top: 5px;
    padding: 0 10px;
    box-sizing: border-box;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;
const ExpiredList = styled(List)`
    background-color: #e0e0e0;
`;
const ListTitle = styled.span`
   font-size: 16px;
    font-weight: 600;
    flex-grow: 1;
    display: flex;
    align-items: center;
`;
const ListTitleGuide = styled.span`
   font-size: 16px;
    font-weight: 600;
    flex-grow: 1;
    display: flex;
    align-items: center;
`;
const Secret = styled.div`
    margin-right: 10px;
`;
const PeopleJoinWrapper = styled.div`
   display: flex;
    flex-direction: column;
    align-items: flex-end;
`;
const PeopleWrapper = styled.div`
    width: 50px;
    height: 15px;
    margin-bottom: 5px;
    text-align: center;
    font-size: 12px;
    color: #666;
`;
const JoinButton = styled.div<{ disabled: boolean }>`
    background-color: #003187;
    width: 70px;
    height: 30px;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #002766;
    }
    &:disabled {
    background-color: #888;
    cursor: not-allowed;
    }
`;
const JoinButtonGuide = styled.div`
    background-color: #003187;
    width: 70px;
    height: 30px;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background-color: #002766;
    }
`;
const PasswordBack = styled.div`
   width:100vw;
   height:100vh;
    background-color:rgba(0,0,0,0.5);
    position:fixed;
    top:0;
    left:0;
`;
const PasswordWrapper = styled.div`
    width:90vw;
    height:200px;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-90%);
    background-color:white;
    border: 1px solid gray;
`;
const BackWrapper = styled.div`
    width:100vw;
    height:100vh;

`;

const PasswordInput = styled.input`
    width:90%;
    height:30px;
    margin-left:4%;
    margin-top:10px;
    border-radius:5px;
`;
const PasswordButton = styled.div`
    width:100px;
    height:30px;
    margin: 0 auto;
    text-align:center;
    line-height:30px;
    background-color:lightblue;
    margin-top:10px;
`;
const GuideBackground = styled.div`
    width:100vw;
    height:100vh;
    position:fixed;
    top:0px;
    left:0px;
    background-color:rgba(0,0,0,0.5);
`;
const SelectBox = styled.div`
    margin-left: 5px;
    border: 5px solid red;
    width: 130px;
    height: 40px;
`;
const SelectText = styled.div`
    background-color:white;
    width:50vw;
    margin-left:10px;
    border-radius:10px;
    padding: 10px 10px;
    font-size:18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;
const GuideButton = styled.div`
    width: 100px;
    height: 40px;
    background-color: #990033;
    text-align:center;
    line-height:40px;
    color:white;
`;
const SelectGuide = styled.div`
    margin-top:146px;
`;
const CreateGuide = styled.div`
    margin-top:115px;
`;
const CreateBox = styled.div`
    width:130px;
    height:40px;
    border:5px solid red;
    margin-left:calc(100vw - 135px);
`;
const CreateText = styled.div`
    background-color:white;
    width:50vw;
    margin-left:calc(100vw - 53vw);
    border-radius:10px;
    padding: 10px 10px;
    font-size:18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;
const GuideRoom = styled.div`
    width:95vw;
    height:80px;
    margin: 0 auto;
    background-color:white;
    border-radius:10px;
    padding:10px 5px;
`;
const GuideList = styled.div`
     width:100%;
    height:60px;
    border:1px solid black;
    border-radius:5px;
    display:flex;
    margin-top:5px;
    padding:0px 5px;
    box-sizing: border-box;
    align-items: center;
`;
const GlassGuide = styled.div`
    transform: translateY(180px);
`;
const GlassBox = styled.div`
    width:50px;
    height:50px;
    border-radius:50%;
    border: 5px solid red;
    position: absolute;
    top: -5px;
    left: -10px;
`;
const GlassText = styled.div`
     background-color:white;
    width:50vw;
    margin-left:50px;
    margin-top:0px;
    border-radius:10px;
    padding: 10px 10px;
    font-size:18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;
const JoinGuide = styled.div`
    transform: translateY(180px);
`;
const JoinBox = styled.div`
    width:100px;
    height:50px;
    border:5px solid red;
    position: absolute;
    left: -20px;
    top: -10px;
`;
const JoinText = styled.div`
    background-color: white;
    width: 50vw;
    margin-left: 187px;
    margin-top: 0px;
    border-radius: 10px;
    padding: 10px 10px;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;
const ExpiredLabel = styled.span`
    background-color: red;
    color: white;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    margin-left: 10px;
    position:absolute;
    left:55%;
`;
const RoomFilterWrapper = styled.div`
    margin-left:auto;
    height:25px;
    border:1px solid black;
    padding:0px 5px;
    display:flex;
`;

interface Challenge {
    id: string;
    방장아이디: string;
    비밀방여부: boolean;
    그룹챌린지제목: string;
    그룹챌린지내용: string;
    주에몇일: string;
    시작날짜: string;
    종료날짜: string;
    요일선택: string[];
    유저아이디: string[];
    비밀번호: string;
    방장프로필: string;
    방장닉네임: string;
    인원수: number;
    기간종료: boolean;
}

const GroupList = () => {
    const navigate = useNavigate();
    const { challenges, setChallenges } = useChallenges();
    const [create, setCreate] = useState(false)
    const [glasses, setGlasses] = useState(false)
    const [selectedRender, setSelectedRender] = useState("total")
    const [user, setUser] = useState<User | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [join, setJoin] = useState(false)
    const [joinPasswordModal, setJoinPasswordModal] = useState(false)
    const [passwordCheck, setPasswordCheck] = useState("")
    const [guideStart, setGuideStart] = useState(false);
    const [achievementName, setAchievementName] = useState("")
    const [showAchievements, setShowAchievements] = useState(false)
    const [filter, setFilter] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string | null>("");
    const [selectedSecret, setSelectedSecret] = useState<string | null>("");
    const [selectedFull, setSelectedFull] = useState<string | null>("")
    // const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([""]);
    const [guide1, setGuide1] = useState(false)
    const [guide2, setGuide2] = useState(false)
    const [guide3, setGuide3] = useState(false)
    const [guide4, setGuide4] = useState(false)


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const createClick = () => {
        setCreate(true)
    }
    const glassesClick = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setGlasses(true);
    };

    const joinClick = async (challenge: Challenge) => {
        if (user && user.uid) {
            if (!challenge.유저아이디.includes(user.uid)) {
                if (challenge.인원수 > challenge.유저아이디.length) {
                    if (!challenge.비밀방여부) {
                        try {
                            const challengeRef = doc(db, "groupchallengeroom", challenge.id);

                            await updateDoc(challengeRef, {
                                유저아이디: arrayUnion(user.uid),
                            });

                            const updatedChallenges = challenges.map((ch) => {
                                if (ch.id === challenge.id) {
                                    return {
                                        ...ch,
                                        유저아이디: [...ch.유저아이디, user.uid],
                                    };
                                }
                                return ch;
                            });

                            setChallenges(updatedChallenges);

                            const achievementsRef = collection(db, 'achievements');
                            const q = query(achievementsRef);
                            const querySnapshot = await getDocs(q)

                            const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "그룹챌린지 참여");

                            if (mainAchievementDoc) {
                                const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                                const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                                const subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 그룹챌린지 참여");

                                if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(user.uid)) {
                                    const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                                    await updateDoc(subAchievementRef, {
                                        유저아이디: arrayUnion(user.uid),
                                    });
                                    setAchievementName(subAchievementDoc.data().도전과제이름);
                                    setSelectedChallenge(challenge);
                                    setShowAchievements(true);
                                    return;
                                }
                            }
                        } catch (error) {
                            console.error("챌린지 가입 중 오류 발생:", error);
                        }

                        setSelectedChallenge(challenge);
                        setJoin(true);
                        navigate(`/group-challenge/${challenge.id}`);

                    } else {
                        setJoinPasswordModal(true);
                        setSelectedChallenge(challenge);
                    }
                } else {
                    alert("현재 그룹방은 인원수가 가득 찼습니다.")
                }
            } else {
                setSelectedChallenge(challenge);
                setJoin(true);
                navigate(`/group-challenge/${challenge.id}`);
            }
        }
    };

    const passwordButton = async () => {
        if (passwordCheck.trim() === selectedChallenge?.비밀번호.trim()) {
            try {
                if (user && user.uid && selectedChallenge) {
                    const challengeRef = doc(db, "groupchallengeroom", selectedChallenge.id);
                    await updateDoc(challengeRef, {
                        유저아이디: arrayUnion(user.uid),
                    });

                    const updatedChallenges = challenges.map((ch) => {
                        if (ch.id === selectedChallenge.id) {
                            return {
                                ...ch,
                                유저아이디: [...ch.유저아이디, user.uid],
                            };
                        }
                        return ch;
                    });
                    setChallenges(updatedChallenges);
                }

                const achievementsRef = collection(db, 'achievements');
                const q = query(achievementsRef);
                const querySnapshot = await getDocs(q)

                const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "그룹챌린지 참여");

                if (mainAchievementDoc) {
                    const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                    const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                    const subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "첫 그룹챌린지 참여");

                    if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(user?.uid)) {
                        const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                        await updateDoc(subAchievementRef, {
                            유저아이디: arrayUnion(user?.uid),
                        });
                        setAchievementName(subAchievementDoc.data().도전과제이름);
                        setJoinPasswordModal(false);
                        setPasswordCheck("");
                        setShowAchievements(true);
                        return;
                    }
                }

            } catch (error) {
                console.error("챌린지 가입 중 오류 발생:", error);
            }
            setJoin(true);
            setJoinPasswordModal(false);
            setPasswordCheck("");
            navigate(`/group-challenge/${selectedChallenge?.id}`);
        } else {
            alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
            console.log("Password Check Failed");
            setPasswordCheck("");
        }
    };

    const renderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRender(e.target.value)
    }


    const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "password-check") {
            setPasswordCheck(value)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const usersCollectionRef = collection(db, "user");
                const querySnapshot = await getDocs(
                    query(usersCollectionRef, where("유저아이디", "==", currentUser.uid))
                );

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const guide = userDoc.data().그룹챌린지가이드;

                    if (guide === false) {
                        setGuideStart(true);
                        setGuide1(true)
                        await updateDoc(userDoc.ref, { 그룹챌린지가이드: true });
                    }
                } else {
                    console.error("유저 데이터를 찾지 못했습니다.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    const guide1Clcik = () => {
        setGuide1(false)
        setGuide2(true)
    }
    const guide2Clcik = () => {
        setGuide2(false)
        setGuide3(true)
    }
    const guide3Clcik = () => {
        setGuide3(false)
        setGuide4(true)
    }
    const guide4Clcik = () => {
        setGuide4(false)
        setGuideStart(false)
    }
    const handleModalConfirm = () => {
        setShowAchievements(false);
        if (selectedChallenge) {
            navigate(`/group-challenge/${selectedChallenge.id}`);
        }
    };
    const handleFilterApply = (filter: string | null, secret: string | null, full: string | null, {/*weekdays: string[]*/}) => {
        setSelectedFilter(filter);
        setSelectedSecret(secret);
        setSelectedFull(full)
        // setSelectedWeekdays(weekdays);
    };

    // const filteredChallenges = selectedRender === "join" && user
    //     ? challenges.filter(challenge => challenge.유저아이디.includes(user.uid))
    //     : challenges;

    const filteredChallenges = () => {
        let filtered = challenges;
        if (selectedRender === "join" && user) {
            filtered = filtered.filter(challenge => challenge.유저아이디.includes(user.uid));
            if (selectedFilter === "ongoing") {
                filtered = filtered.filter(challenge => !challenge.기간종료);
            } else if (selectedFilter === "ended") {
                filtered = filtered.filter(challenge => challenge.기간종료);
            }
            if (selectedSecret === "public") {
                filtered = filtered.filter(challenge => !challenge.비밀방여부)
            } else if (selectedSecret === "secret") {
                filtered = filtered.filter(challenge => challenge.비밀방여부)
            }
            if(selectedFull === "empty"){
                filtered = filtered.filter(challenge => Number(challenge.인원수) !== challenge.유저아이디.length)
            }else if(selectedFull === "full"){
                filtered = filtered.filter(challenge => Number(challenge.인원수) === challenge.유저아이디.length)
            }
        } else {
            if (selectedFilter === "ongoing") {
                filtered = filtered.filter(challenge => !challenge.기간종료);
            } else if (selectedFilter === "ended") {
                filtered = filtered.filter(challenge => challenge.기간종료);
            }
            if (selectedSecret === "public") {
                filtered = filtered.filter(challenge => !challenge.비밀방여부)
            } else if (selectedSecret === "secret") {
                filtered = filtered.filter(challenge => challenge.비밀방여부)
            }
            if(selectedFull === "empty"){
                filtered = filtered.filter(challenge => Number(challenge.인원수) !== challenge.유저아이디.length)
            }else if(selectedFull === "full"){
                filtered = filtered.filter(challenge => Number(challenge.인원수) === challenge.유저아이디.length)
            }
        }
        return filtered;
    }

    const filteredChallengesList = filteredChallenges();

    return (
        <MoSlideModal onClose={() => navigate("/")}>
            <Wrapper>
                <h4>챌린지를 통해 사람들과 목표를 달성해보세요</h4>
                <CreateButtonWrapper>
                    <CreateChallengeButton onClick={createClick}>
                        챌린지 생성 <span>+</span>
                    </CreateChallengeButton>
                </CreateButtonWrapper>
                {create && <GroupCreate onBack={() => setCreate(false)} />}
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid gray', padding: '7px 0', marginTop: '10px' }}>
                    <SelectRender value={selectedRender} onChange={renderChange}>
                        <RenderOption value="total">전체</RenderOption>
                        <RenderOption value="join">가입된 그룹방</RenderOption>
                    </SelectRender>
                    <RoomFilterWrapper onClick={() => setFilter(true)}>
                        <span>필터</span>
                        <CiFilter style={{ width: '18px', height: '18px', marginTop: '2px' }} />
                    </RoomFilterWrapper>
                </div>
                <ListWrapper>
                    {filteredChallengesList.map((challenge) => {
                        const isExpired = challenge.기간종료;
                        return (
                            <List key={challenge.id} as={isExpired ? ExpiredList : List}>
                                {challenge.비밀방여부 && (
                                    <Secret>
                                        <CiLock style={{ width: "20px", height: "20px" }} />
                                    </Secret>
                                )}
                                <ListTitle>{challenge.그룹챌린지제목}</ListTitle>
                                {isExpired && <ExpiredLabel>종료됨</ExpiredLabel>}
                                <span style={{ marginLeft: "5px" }} onClick={() => glassesClick(challenge)}>
                                    <IoSearch style={{ width: "25px", height: "25px", marginTop: "5px" }} />
                                </span>
                                <PeopleJoinWrapper>
                                    <PeopleWrapper>{challenge.유저아이디.length}/{challenge.인원수}</PeopleWrapper>
                                    <JoinButton onClick={() => joinClick(challenge)} disabled={isExpired}>
                                        {challenge.유저아이디.includes(user?.uid ?? '') ? "인증" : "가입"}
                                    </JoinButton>
                                </PeopleJoinWrapper>
                            </List>
                        )
                    })}
                </ListWrapper>
                {join && selectedChallenge && <JoinedRoom />}
                {glasses && selectedChallenge && <GroupGlasses onBack={() => setGlasses(false)} challenge={selectedChallenge} />}
                {joinPasswordModal && (
                    <PasswordBack>
                        <BackWrapper onClick={() => setJoinPasswordModal(false)}></BackWrapper>
                        <PasswordWrapper>
                            <h4 style={{ textAlign: "center" }}>비번방입니다. 비밀번호를 입력해주세요</h4>
                            <PasswordInput onChange={passwordChange} type="password" name="password-check" value={passwordCheck} />
                            <PasswordButton onClick={passwordButton}>확인</PasswordButton>
                        </PasswordWrapper>
                    </PasswordBack>
                )}
                {showAchievements && (
                    <AchievementModal achievementName={achievementName} handleModalConfirm={handleModalConfirm} />
                )}

                {guideStart ? (
                    <GuideBackground>
                        {guide1 ? (
                            <SelectGuide>
                                <SelectBox />
                                <FaArrowUp style={{ width: "35px", height: "35px", color: "white", marginLeft: "20px", marginTop: "5px" }} />
                                <SelectText>
                                    <div>이 부분을 클릭하면 전체그룹방리스트와 가입되어있는 그룹방 리스트를 선택하여 볼 수 있습니다.</div>
                                    <GuideButton onClick={guide1Clcik}>다음</GuideButton>
                                </SelectText>
                            </SelectGuide>
                        ) : null}
                        {guide2 ? (
                            <CreateGuide>
                                <CreateBox />
                                <FaArrowUp style={{ width: "35px", height: "35px", color: "white", marginLeft: "calc(100vw - 100px)", marginTop: "5px" }} />
                                <CreateText>
                                    <div>챌린지 생성을 클릭하면 새로운 그룹챌린지방을 만들 수 있습니다.</div>
                                    <GuideButton onClick={guide2Clcik}>다음</GuideButton>
                                </CreateText>
                            </CreateGuide>
                        ) : null}
                        {guide3 ? (
                            <GlassGuide>
                                <GuideRoom>
                                    <GuideList>
                                        <ListTitleGuide>주4일 운동하기</ListTitleGuide>
                                        <span style={{ position: "relative", marginLeft: "5px" }}>
                                            <GlassBox />
                                            <IoSearch style={{ width: "25px", height: "25px", marginTop: "5px", color: "black" }} />
                                        </span>
                                        <PeopleJoinWrapper>
                                            <PeopleWrapper>5/10</PeopleWrapper>
                                            <JoinButtonGuide>
                                                인증
                                            </JoinButtonGuide>
                                        </PeopleJoinWrapper>
                                    </GuideList>
                                </GuideRoom>
                                <FaArrowUp style={{ width: "35px", height: "35px", color: "white", marginLeft: "20px", marginTop: "5px", transform: "translate(110px, 0px)" }} />
                                <GlassText>
                                    <div>돋보기를 눌러 그룹방의 상세정보를 확인해보세요</div>
                                    <GuideButton onClick={guide3Clcik}>다음</GuideButton>
                                </GlassText>
                            </GlassGuide>
                        ) : null}
                        {guide4 ? (
                            <JoinGuide>
                                <GuideRoom>
                                    <GuideList>
                                        <ListTitleGuide>주4일 운동하기</ListTitleGuide>
                                        <span style={{ marginLeft: "5px" }}>
                                            <IoSearch style={{ width: "25px", height: "25px", marginTop: "5px" }} />
                                        </span>
                                        <PeopleJoinWrapper>
                                            <PeopleWrapper>5/10</PeopleWrapper>
                                            <JoinButtonGuide style={{ position: "relative" }}>
                                                인증
                                                <JoinBox />
                                            </JoinButtonGuide>

                                        </PeopleJoinWrapper>
                                    </GuideList>
                                </GuideRoom>
                                <FaArrowUp style={{ width: "35px", height: "35px", color: "white", marginTop: "5px", marginLeft: "calc(100vw - 84px)" }} />

                                <JoinText>
                                    <div>가입버튼을 눌러 가입하고 인증버튼을 눌러 인증해보세요</div>
                                    <GuideButton onClick={guide4Clcik}>완료</GuideButton>
                                </JoinText>
                            </JoinGuide>
                        ) : null}
                    </GuideBackground>
                ) : null}
                {filter && (
                    <FilterComponent onClose={() => setFilter(false)} onFilterApply={handleFilterApply} />
                )}
            </Wrapper>
        </MoSlideModal>
    );
};
export default GroupList