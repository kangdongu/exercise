import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../../../firebase";
import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { format } from "date-fns";
import { Challenge, useChallenges } from "../group-context";
import PeopleModal from "../people-modal";
import AchievementModal from "../../achievement-alert";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import GroupCreateStepOne from "./group-step-one";
import GroupCreateStepTwo from "./group-step-two";
import GroupCreateStepFour from "./group-step-four";
import GroupCreateStepThree from "./group-step-three";

const Wrapper = styled.div`
    width:100vw;
    height:97vh;
    position:fixed;
    background-color:white;
    left:0;
    top:0;
    padding-left:10px;
    box-sizing:border-box;
    overflow:hidden;
    overflow-y:scroll;
    z-index:999;
`;

const Back = styled.div`
    width: 20px;
    height: 20px;
    margin:10px;
    margin-left:0px;
`;
const StepWrapper = styled.div`
    display:flex;
    position:relative;
    gap:15px;
    span{
        background-color:#f1f1f1;
        width:25px;
        height:25px;
        border-radius:50%;
    }
`;

interface CreateProps {
    onBack: () => void
}

const GroupCreate: React.FC<CreateProps> = ({ onBack }) => {
    const { setChallenges } = useChallenges();
    const week1 = new Date();
    week1.setDate(week1.getDate() + 7);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(week1);
    const [secretCheckToggle, setSecretCheckToggle] = useState(false)
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [title, setTitle] = useState("")
    const [contentText, setContentText] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [nickname, setNickname] = useState("")
    const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
    const [peopleCount, setPeopleCount] = useState(0);
    const [isCreating, setIsCreating] = useState(false)
    const [achievementName, setAchievementName] = useState("")
    const [showAchievements, setShowAchievements] = useState(false)
    const [docId, setDocId] = useState<string>("");
    const navigate = useNavigate()
    const currentUser = auth.currentUser
    const [move, setMove] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("해당없음");
    const [currentStep, setCurrentStep] = useState(1);


    useEffect(() => {
        const daysOrder = ["월", "화", "수", "목", "금", "토", "일"];
        setSelectedDays((prevSelectedDays) =>
            [...prevSelectedDays].sort(
                (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
            )
        );
    }, []);

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

    const createRoom = async () => {
        if (isCreating) return;

        setIsCreating(true);
        if (password === rePassword && title !== "" && contentText !== "" && selectedDays.length !== 0 && peopleCount !== 0) {
            const user = auth.currentUser;
            const recordsRef = collection(db, "groupchallengeroom");
            const startDate = new Date();
            const endDateFormat = selectedEndDate ? format(selectedEndDate, "yyyy-MM-dd") : "";

            const newChallenge = {
                유저아이디: [user?.uid],
                그룹챌린지제목: title,
                그룹챌린지내용: contentText,
                주에몇일: String(selectedDays.length),
                요일선택: selectedDays,
                비밀방여부: secretCheckToggle,
                시작날짜: format(startDate, "yyyy-MM-dd"),
                종료날짜: endDateFormat,
                방장아이디: user?.uid,
                비밀번호: rePassword,
                방장닉네임: nickname,
                인원수: peopleCount,
                기간종료: false,
                카테고리: selectedCategory,
            };

            try {
                const docRef = await addDoc(recordsRef, newChallenge);
                setChallenges((prevChallenges: Challenge[]) => [
                    ...prevChallenges,
                    { id: docRef.id, ...newChallenge } as Challenge,
                ]);
                setDocId(docRef.id);

                const achievementsRef = collection(db, 'achievements');
                const q = query(achievementsRef);
                const querySnapshot = await getDocs(q)

                const mainAchievementDoc = querySnapshot.docs.find(doc => doc.data().도전과제이름 === "그룹챌린지 주최");

                if (mainAchievementDoc) {
                    const subAchievementsRef = collection(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`);
                    const subAchievementsSnapshot = await getDocs(subAchievementsRef);

                    const subAchievementDoc = subAchievementsSnapshot.docs.find(doc => doc.data().도전과제이름 === "그룹챌린지 주최");

                    if (subAchievementDoc && !subAchievementDoc.data().유저아이디.includes(user?.uid)) {
                        const subAchievementRef = doc(db, `achievements/${mainAchievementDoc.id}/${mainAchievementDoc.id}`, subAchievementDoc.id);
                        await updateDoc(subAchievementRef, {
                            유저아이디: arrayUnion(user?.uid),
                        });
                        setAchievementName(subAchievementDoc.data().도전과제이름);
                        setShowAchievements(true);
                        return;
                    }
                }

                alert("방이 생성되었습니다!");
                navigate(`/group-challenge/${docRef.id}`);
            } catch (error) {
                console.error("방 생성 중 오류가 발생했습니다: ", error);
            } finally {
                setIsCreating(false);
            }
        } else if (password !== rePassword) {
            alert("비밀번호가 다릅니다");
        } else if (title === "" && contentText === "" && selectedDays.length == 0) {
            alert("챌린지 제목과 내용을 작성해주시고 요일을 선택해주세요")
        } else if (title === "" && contentText == "") {
            alert("챌린지 제목과 내용을 작성해주세요")
        } else if (title === "" && selectedDays.length == 0) {
            alert("챌린지 제목을 작성해주시고 요일을 선택해주세요")
        } else if (contentText === "" && selectedDays.length == 0) {
            alert("챌린지 내용을 작성해주시고 요일을 선택해주세요")
        } else if (selectedDays.length == 0) {
            alert("요일을 선택해주세요")
        } else if (peopleCount == 0) {
            alert("인원수를 선택해주세요")
        }
    };

    const handleModalConfirm = () => {
        alert("방이 생성되었습니다!");
        setShowAchievements(false);
        navigate(`/group-challenge/${docId}`);
    };

    const TitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "title") {
            setTitle(value)
        }
    }

    const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "content_text") {
            setContentText(value)
        }
    }

    const EndDateChange = (date: Date | null) => {
        setSelectedEndDate(date);
    };

    const SecretCheckClick = () => {
        setSecretCheckToggle((prev) => !prev)
    }

    const moveRight = () => {
        setMove((prevMove) => prevMove + 1);
    };
    const moveLeft = () => {
        setMove((prevMove) => prevMove - 1);
    }
    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
        moveRight()
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
        moveLeft()
    };
    const updateDays = (updateDays: string[]) => {
        setSelectedDays(updateDays)
    }

    const downButton = () => {
        if (peopleCount > 1) {
            setPeopleCount((prev) => prev - 1)
        } else {
            setPeopleCount(1);
        }
    }
    const upButton = () => {
        if (peopleCount >= 30) {
            alert("인원수는 30명까지 가능합니다.")
        } else {
            setPeopleCount((prev) => prev + 1)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = parseInt(value);

        if (value === '' || !isNaN(numericValue) && numericValue >= 1 && numericValue <= 30) {
            setPeopleCount(value === '' ? 0 : numericValue);
        }
    };
    const onPassword = (passwordProps: string) => {
        setPassword(passwordProps)
    }
    const onRePassword = (rePasswordProps: string) => {
        setRePassword(rePasswordProps)
    }
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <Wrapper>
            <Back onClick={onBack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </Back>
            <h3>챌린지 그룹방을 생성해주세요</h3>
            <StepWrapper>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <motion.div
                    animate={{ x: move * 40 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: "25px",
                        height: "25px",
                        backgroundColor: "red",
                        borderRadius: "50%",
                        position: "absolute",
                    }}
                />
            </StepWrapper>

            {currentStep === 1 && <GroupCreateStepOne
                nextStep={nextStep}
                title={title}
                contentText={contentText}
                onContentChange={contentChange}
                onTitleChange={TitleChange}
            />}

            {currentStep === 2 && <GroupCreateStepTwo
                nextStep={nextStep}
                prevStep={prevStep}
                selectedDays={selectedDays}
                updateDays={updateDays}
            />}

            {currentStep === 3 && <GroupCreateStepThree
                prevStep={prevStep}
                nextStep={nextStep}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />}

            {currentStep === 4 && <GroupCreateStepFour
                prevStep={prevStep}
                createRoom={createRoom}
                secret={secretCheckToggle}
                SecretCheckClick={SecretCheckClick}
                selectedEndDate={selectedEndDate}
                EndDateChange={EndDateChange}
                peopleCount={peopleCount}
                handleChange={handleChange}
                upButton={upButton}
                downButton={downButton}
                passwordProps={onPassword}
                rePasswordProps={onRePassword}
            />}

            {isPeopleModalOpen && (
                <PeopleModal
                    onClose={() => setIsPeopleModalOpen(false)}
                    peopleCount={peopleCount}
                    setPeopleCount={setPeopleCount}
                />
            )}
            {showAchievements && (
                <AchievementModal achievementName={achievementName} handleModalConfirm={handleModalConfirm} />
            )}
        </Wrapper>
    )
}
export default GroupCreate