import styled from "styled-components"
import { Badges } from "../../routes/profile";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useBadgesContext } from "./badges-context";


const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;
const Close = styled.div`
  width: 100%;
  height: 100vh;
`;
const ContentWrapper = styled.div`
  width: 95%;
  height: 55vh;
  position: fixed;
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
`;
const ChoiceBadges = styled.div`
  width: 129px;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;
const BadgesList = styled.div`
  overflow-y:scroll;
  background-color:#f0f0f0;
  height:calc(50% - 70px);
  padding-top:10px;
`;
const BadgeCard = styled.div<{ selected: boolean }>`
    width: 22%;
    height:70px;
    background-color: white;
    opacity:${(props) => props.selected ? "0.5" : '1'};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-left:2.4%;
    margin-bottom:10px;
    transition: opacity 0.3s;
  img {
    width: 70%;
    object-fit: cover;
    border-radius: 4px;
  }
`;
const CompleteButton = styled.button`
    width: 100px;
padding: 10px;
margin: 20px auto 0;
background-color: #ff286f;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
display: block;
`;

const BadgeImg = styled.img`

`;

interface BadgeChoice {
    onClose: () => void;
    badgesList: Badges[]
}

const BadgesChoiceModal: React.FC<BadgeChoice> = ({ onClose, badgesList }) => {
    const { selectedBadges, setSelectedBadges } = useBadgesContext();
    const currentUser = auth.currentUser;

    const badgeClick = (badgeImg: string) => {
        let updateBadges = selectedBadges

        if (updateBadges.includes(badgeImg)) {
            setSelectedBadges((prev) => prev.filter((d) => d !== badgeImg));
        } else {
            if (selectedBadges.length < 8) {
                setSelectedBadges((prev) => [...prev, badgeImg])
            } else {
                alert("8개 까지 선택 가능합니다.")
            }
        }
    }

    const badgesChange = async() => {
        if(!currentUser?.uid){
            return;
        }
        const userQuery = query(collection(db, "user"), where("유저아이디", "==", currentUser?.uid));
        const userQuerySnapshot = await getDocs(userQuery);
        if(!userQuerySnapshot.empty){
            const userRef = userQuerySnapshot.docs[0]
            await updateDoc(userRef.ref,{
                선택뱃지:selectedBadges
            })
        }
        onClose()
    }

    return (
        <Wrapper>
            <Close onClick={onClose} />
            <ContentWrapper>
                <ChoiceBadges>
                    <div style={{ width: "100%", display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {selectedBadges.map((badge, index) => (
                            <div key={index}>
                                <img style={{ width: '30px' }} src={badge}></img>
                            </div>
                        ))}
                    </div>
                </ChoiceBadges>
                <BadgesList>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', paddingLeft: '2.4%' }}>
                        {badgesList.map((badge) => (
                            <BadgeCard selected={selectedBadges.includes(badge.뱃지이미지)} key={badge.뱃지이름} onClick={() => badgeClick(badge.뱃지이미지)}>
                                <BadgeImg src={badge.뱃지이미지}></BadgeImg>
                            </BadgeCard>
                        ))}
                    </div>
                </BadgesList>
                <CompleteButton onClick={badgesChange}>
                    변경
                </CompleteButton>
            </ContentWrapper>
        </Wrapper>
    )
}
export default BadgesChoiceModal