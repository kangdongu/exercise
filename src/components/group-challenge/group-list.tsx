import { useEffect, useState } from "react";
import styled from "styled-components"
import GroupCreate from "./group-create";
import GroupGlasses from "./group-glasses";
import { IoSearch } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { auth, db } from "../../firebase";
import { arrayUnion, collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";
import JoinedRoom from "./joined-room";
import { useChallenges } from "./group-context";

const Wrapper = styled.div`
    width:100%;
    height:97vh;
    padding:15px;
    box-sizing:border-box;
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
    margin-top:10px;
    border-radius:5px;
`;
const RenderOption = styled.option`

`;
const ListWrapper = styled.div`
    width:100%;
    margin-top:20px;
`;
const List = styled.div`
    width:100%;
    height:65px;
    border:1px solid black;
    border-radius:5px;
    display:flex;
    margin-top:10px;
    padding: 0px 5px;
    box-sizing: border-box;
`;
const ListTitle = styled.span`
    font-size:16px;
    font-weight:600;
    line-height:65px;
`;
const Secret = styled.div`
    line-height:70px;
`;
const PeopleJoinWrapper = styled.div`
    margin-left:auto;
    display: flex;
    flex-direction: column;
    padding-top:3px;
`;
const PeopleWrapper = styled.div`
    widht:50px;
    height:15px;
    margin-bottom:5px;
    text-align:center;
`;
const JoinButton = styled.div`
background-color:#003187;
    width:70px;
    height:30px;
    border:1px solid black;
    box-sizing:border-box;
    text-align:center;
    line-height:30px;
    margin-top:auto;
    color:white;
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
    비밀번호: any;
    방장프로필: string;
    방장닉네임: string;
}

const GroupList = () => {
    const { challenges, setChallenges } = useChallenges();
    const [create, setCreate] = useState(false)
    const [glasses, setGlasses] = useState(false)
    const [selectedRender, setSelectedRender] = useState("total")
    const [user, setUser] = useState<User | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [join, setJoin] = useState(false)
    const [joinPasswordModal, setJoinPasswordModal] = useState(false)
    const [passwordCheck, setPasswordCheck] = useState("")




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
                    } catch (error) {
                        console.error("챌린지 가입 중 오류 발생:", error);
                    }
                    setSelectedChallenge(challenge);
                    setJoin(true);
                } else {
                    setJoinPasswordModal(true);
                }
            } else {
                setSelectedChallenge(challenge);
                setJoin(true);
            }
        }
    };

    const passwordButton = async () => {
        if (passwordCheck === selectedChallenge?.비밀번호) {
            try {
                if (user && user.uid) {
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
            } catch (error) {
                console.error("챌린지 가입 중 오류 발생:", error);
            }
            setSelectedChallenge(selectedChallenge);
            setJoin(true);
            setJoinPasswordModal(false);
            setPasswordCheck("");
        } else {
            alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
            setPasswordCheck("");
        }
    };

    const renderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRender(e.target.value)
    }

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const q = query(collection(db, "groupchallengeroom"))
                const querySnapshot = await getDocs(q);

                const challengesArray: Challenge[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    방장아이디: doc.data().방장아이디,
                    비밀방여부: doc.data().비밀방여부,
                    그룹챌린지제목: doc.data().그룹챌린지제목,
                    그룹챌린지내용: doc.data().그룹챌린지내용,
                    유저아이디: doc.data().유저아이디,
                    요일선택: doc.data().요일선택,
                    주에몇일: doc.data().주에몇일,
                    시작날짜: doc.data().시작날짜,
                    종료날짜: doc.data().종료날짜,
                    비밀번호: doc.data().비밀번호,
                    방장프로필: doc.data().방장프로필,
                    방장닉네임: doc.data().방장닉네임
                }));
                setChallenges(challengesArray)
            } catch (error) {
                console.log(error)
            }
        }
        fetchChallenges()
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const filteredChallenges = selectedRender === "join" && user
        ? challenges.filter(challenge => challenge.유저아이디.includes(user.uid))
        : challenges;

    const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "password-check") {
            setPasswordCheck(value)
        }
    }


    return (
        <Wrapper>
            <h4>챌린지를 통해 사람들과 목표를 달성해보세요</h4>
            <CreateButtonWrapper>
                <CreateChallengeButton onClick={createClick}>
                    챌린지 생성 <span>+</span>
                </CreateChallengeButton>
            </CreateButtonWrapper>
            {create && <GroupCreate onBack={() => setCreate(false)} />}
            <SelectRender value={selectedRender} onChange={renderChange}>
                <RenderOption value="total">전체</RenderOption>
                <RenderOption value="join">가입된 그룹방</RenderOption>
            </SelectRender>
            <ListWrapper>
                {filteredChallenges.map((challenge) => (
                    <List key={challenge.id}>
                        {challenge.비밀방여부 && (
                            <Secret>
                                <CiLock style={{ width: "20px", height: "20px" }} />
                            </Secret>
                        )}
                        <ListTitle>{challenge.그룹챌린지제목}</ListTitle>
                        <span style={{ marginLeft: "5px" }} onClick={() => glassesClick(challenge)}>
                            <IoSearch style={{ width: "25px", height: "25px", marginTop: "17px" }} />
                        </span>
                        <PeopleJoinWrapper>
                            <PeopleWrapper>{challenge.유저아이디.length}/10</PeopleWrapper>
                            <JoinButton onClick={() => joinClick(challenge)}>
                                {challenge.유저아이디.includes(user?.uid ?? '') ? "인증" : "가입"}
                            </JoinButton>
                        </PeopleJoinWrapper>
                    </List>
                ))}
            </ListWrapper>
            {join && selectedChallenge && <JoinedRoom onBack={() => setJoin(false)} challenge={selectedChallenge} />}
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
        </Wrapper>
    );
};
export default GroupList