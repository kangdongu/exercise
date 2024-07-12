import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import { GiAchievement } from "react-icons/gi";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MoSlideModal from "../slideModal/mo-slide-modal";

const Wrapper = styled.div`
  background-color: #f3f1f1;
  width: 100vw;
  height: calc(100vh - 80px);
  overflow-y: scroll;
`;
const AchievementsWrapper = styled.div`
  width: 90vw;
  margin: 0 auto;
  margin-bottom: 20px;
`;
const AchievementsList = styled.div`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  font-size: 18px;
  display: flex;
  background-color: white;
  padding-right: 30px;
  z-index: 10;
`;
const AchievementsIcon = styled.div`

`;
const AchievementsTitle = styled.div`
  line-height: 50px;
  font-weight: 600;
  text-stroke: 1px lightgray;
  color: black;
`;
const MenuWrapper = styled.div`
  margin: 25px 0px;
`;
const Menu = styled.span<{ selected: boolean }>`
  color: ${(props) => (props.selected ? '#cc0033' : '#939393')};
  font-weight: ${(props) => (props.selected ? '600' : '500')};
  margin-left: 15px;
`;
const NoAchievements = styled.div`
  text-align: center;
  margin-top: 150px;
  font-size: 20px;
  color: gray;
`;
const DetailWrapper = styled.div`
  width: 100%;
  background-color: #efebeb;
  padding: 10px;
`;
const SubAchievement = styled.div<{ completed: boolean }>`
    font-size: 16px;
    color: ${(props) => (props.completed ? 'black' : 'gray')};
    cursor: pointer;
    height:50px;
    background-color:white;
    line-height:50px;
    width:100%;
    display:flex;
    gap:20px;
`;

const SubAchievementDescription = styled.div`
  font-size: 14px;
  color: #666;
  width:100%;
  padding:10px;
  background-color:#f1f3f3;
`;
const SubAchievementList = styled.div`
    width:100%;
    margin-bottom:5px;
    border-radius:5px;
`;

interface Achievements {
    도전과제이름: string;
    achievementId: string;
}
interface SubAchievements {
    유저아이디: string[];
    도전과제이름: string;
    도전과제설명: string;
    순서: number;
}

const AchievementsContent = () => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState<Achievements[]>([]);
    const [subAchievements, setSubAchievements] = useState<{ [key: string]: SubAchievements[] }>({});
    const [selectedMenu, setSelectedMenu] = useState("total");
    const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
    const [selectedSubAchievement, setSelectedSubAchievement] = useState<string | null>(null);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const q = query(collection(db, "achievements"), orderBy("도전과제이름", "asc"));
                const querySnapshot = await getDocs(q);

                const achievementsArray: Achievements[] = querySnapshot.docs.map((doc) => ({
                    도전과제이름: doc.data().도전과제이름,
                    achievementId: doc.id,
                }));
                setAchievements(achievementsArray);
            } catch (error) {
                console.error("Error fetching achievements: ", error);
            }
        };

        fetchAchievements();
    }, []);

    const fetchSubAchievements = async (achievementId: string) => {
        try {
            const subAchievementsCollection = query(collection(db, `achievements/${achievementId}/${achievementId}`), orderBy("순서", "asc"));
            const subAchievementsSnapshot = await getDocs(subAchievementsCollection);

            const subAchievementsArray: SubAchievements[] = subAchievementsSnapshot.docs.map((doc) => ({
                도전과제이름: doc.data().도전과제이름,
                도전과제설명: doc.data().도전과제설명,
                유저아이디: doc.data().유저아이디,
                순서: doc.data().순서
            }));

            setSubAchievements((prev) => ({ ...prev, [achievementId]: subAchievementsArray }));
        } catch (error) {
            console.error("Error fetching sub-achievements: ", error);
        }
    };

    const toggleAchievement = (achievementId: string) => {
        if (selectedAchievement === achievementId) {
            setSelectedAchievement(null);
            setSelectedSubAchievement(null);
        } else {
            setSelectedAchievement(achievementId);
            setSelectedSubAchievement(null);
            fetchSubAchievements(achievementId);
        }
    };

    const toggleSubAchievement = (subAchievementName: string) => {
        setSelectedSubAchievement(selectedSubAchievement === subAchievementName ? null : subAchievementName);
    };

    const filteredAchievements = selectedMenu === 'attainment'
        ? achievements.filter((achievement) => subAchievements[achievement.achievementId]?.some(sub => sub.유저아이디.includes(currentUser?.uid || '')))
        : achievements;

    return (
        <MoSlideModal onClose={() => navigate("/")}>
            <Wrapper>
                <MenuWrapper>
                    <Menu selected={selectedMenu === 'total'} onClick={() => setSelectedMenu('total')}>전체 도전과제</Menu>
                    <Menu selected={selectedMenu === 'attainment'} onClick={() => setSelectedMenu('attainment')}>달성한 도전과제</Menu>
                </MenuWrapper>

                {filteredAchievements.length === 0 && selectedMenu === 'attainment' ? (
                    <NoAchievements>현재까지 달성한 도전과제가 없습니다</NoAchievements>
                ) : (
                    filteredAchievements.map((achievement) => (
                        <AchievementsWrapper key={achievement.achievementId}>
                            <AchievementsList onClick={() => toggleAchievement(achievement.achievementId)}>
                                <AchievementsIcon>
                                    <GiAchievement style={{ width: "30px", height: "30px", marginTop: "10px", color: "#e8d058" }} />
                                </AchievementsIcon>
                                <AchievementsTitle>
                                    {achievement.도전과제이름}
                                </AchievementsTitle>
                                {selectedMenu === "total" ? (
                                    selectedAchievement === achievement.achievementId ? (
                                        <FaAngleUp style={{ width: "20px", height: "20px", marginTop: "15px", marginLeft: 'auto' }} />
                                    ) : (
                                        <FaAngleDown style={{ width: "20px", height: "20px", marginTop: "15px", marginLeft: 'auto' }} />
                                    )
                                ) : null}
                            </AchievementsList>
                            {selectedAchievement === achievement.achievementId && selectedMenu === "total" && (
                                <DetailWrapper>
                                    {subAchievements[achievement.achievementId] &&
                                        subAchievements[achievement.achievementId].map((subAchievement) => (
                                            <SubAchievementList key={subAchievement.도전과제이름}>
                                                <SubAchievement
                                                    completed={subAchievement.유저아이디.includes(currentUser?.uid || '')}
                                                    onClick={() => toggleSubAchievement(subAchievement.도전과제이름)}
                                                >
                                                    <AchievementsIcon>
                                                        <GiAchievement style={{ width: "30px", height: "30px", marginTop: "10px", color:subAchievement.유저아이디.includes(currentUser?.uid || '') ? "#e8d058":'#939393'}  } />
                                                    </AchievementsIcon>
                                                    {subAchievement.도전과제이름}
                                                    {selectedMenu === "total" ? (
                                                        selectedSubAchievement === subAchievement.도전과제이름 ? (
                                                            <FaAngleUp style={{ width: "20px", height: "20px", marginTop: "15px", marginLeft: 'auto' }} />
                                                        ) : (
                                                            <FaAngleDown style={{ width: "20px", height: "20px", marginTop: "15px", marginLeft: 'auto' }} />
                                                        )
                                                    ) : null}
                                                </SubAchievement>
                                                {selectedSubAchievement === subAchievement.도전과제이름 && (
                                                    <SubAchievementDescription>
                                                        {subAchievement.도전과제설명}
                                                    </SubAchievementDescription>
                                                )}
                                            </SubAchievementList>
                                        ))}
                                </DetailWrapper>
                            )}
                        </AchievementsWrapper>
                    ))
                )}
            </Wrapper>
        </MoSlideModal>
    );
};
export default AchievementsContent;
