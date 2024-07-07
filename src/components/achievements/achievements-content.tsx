import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled  from "styled-components";
import { auth, db } from "../../firebase";
import { GiAchievement } from "react-icons/gi";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MoSlideModal from "../slideModal/mo-slide-modal";


const Wrapper = styled.div`
    background-color:#f3f1f1;
    width:100vw;
    height:100vh;
`;
const AchievementsWrapper = styled.div`
    width:90vw;
    margin: 0 auto;
    margin-bottom:20px;
`;
const AchievementsList = styled.div`
    width:100%;
    height:50px;
    border-radius: 10px;
    font-size:18px;
    display:flex;
    background-color:white;
    gap:20px;
     z-index:10;
`;
const AchievementsIcon = styled.div`

`;
const AchievementsTitle = styled.div<{ completed: boolean }>`
    line-height: 50px;
    font-weight: 600;
    text-stroke: 1px lightgray;
    color: ${props => props.completed ? 'black' : 'gray'};
`;
const MenuWrapper = styled.div`
margin: 25px 0px;
`;
const Menu = styled.span<{ selected: boolean }>`
    color: ${props => props.selected ? '#cc0033' : '#939393'};
    font-weight:${props => props.selected ? '600' : '500'};
    margin-left:15px;
`;
const NoAchievements = styled.div`
    text-align: center;
    margin-top: 150px;
    font-size: 20px;
    color: gray;
`;
const DetailWrapper = styled.div`
    width:100%;
    height:70px;
    background-color:#efebeb;
    padding:10px;
    display: flex;
    align-items: center;
`;


interface Achievements {
    유저아이디: string[];
    도전과제이름: string;
    도전과제설명: string;
}

const AchievementsContent = () => {
    const navigate = useNavigate()
    const [achievements, setAchievements] = useState<Achievements[]>([])
    const [selectedMenu, setSelectedMenu] = useState("total")
    const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null)
    const currentUser = auth.currentUser

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const q = query(collection(db, "achievements"))
                const querySnapshot = await getDocs(q);

                const achievementsArray: Achievements[] = querySnapshot.docs.map((doc) => ({
                    도전과제이름: doc.data().도전과제이름,
                    도전과제설명: doc.data().도전과제설명,
                    유저아이디: doc.data().유저아이디
                }))
                setAchievements(achievementsArray)
            } catch {

            }
        }
        fetchAchievements()
    }, [])

    const filteredAchievements = selectedMenu === 'attainment'
        ? achievements.filter(achievement => achievement.유저아이디.includes(currentUser?.uid || ''))
        : achievements;

    const toggleAchievement = (도전과제이름: string) => {
        setSelectedAchievement(selectedAchievement === 도전과제이름 ? null : 도전과제이름);
    };

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
                    <AchievementsWrapper key={achievement.도전과제이름}>
                        <AchievementsList onClick={() => toggleAchievement(achievement.도전과제이름)}>
                            <AchievementsIcon>
                                <GiAchievement style={{ width: "30px", height: "30px", marginTop: "10px", color: "#e8d058" }} />
                            </AchievementsIcon>
                            <AchievementsTitle completed={achievement.유저아이디.includes(currentUser?.uid || '')}>
                                {achievement.도전과제이름}
                            </AchievementsTitle>
                            {selectedMenu === "total" ? (
                                <FaAngleDown style={{ width: "20px", height: "20px", marginTop: "15px" }} />
                            ):null}
                        </AchievementsList>
                        {selectedAchievement === achievement.도전과제이름 && selectedMenu === "total" && (
                            <DetailWrapper>
                                {achievement.도전과제설명}
                            </DetailWrapper>
                        )}
                    </AchievementsWrapper>
                ))
            )}

        </Wrapper>
        </MoSlideModal>
    )
}
export default AchievementsContent