import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import MoSlideModal from "../slideModal/mo-slide-modal";

const Wrapper = styled.div`
    background-color:#f3f1f1;
    width:100vw;
    height:100vh;
`;
const ContentWrapper = styled.div`
    width:90vw;
    margin:0 auto;
`;
const MenuWrapper = styled.div`
    margin: 25px 0px;
`;
const Menu = styled.span<{ selected: boolean }>`
    color: ${props => props.selected ? '#cc0033' : '#939393'};
    font-weight:${props => props.selected ? '600' : '500'};
    margin-left:15px;
     &:first-child {
        margin-left:0px;
    }
`;
const NoBadges = styled.div`
    text-align: center;
    margin-top: 150px;
    font-size: 20px;
    color: gray;
`;
const BadgesWrapper = styled.div`

`;
const BadgesList = styled.div`
    width:100%;
    height:70px;
    border-radius: 10px;
    font-size:18px;
    display:flex;
    background-color:white;
    gap:15px;
    z-index:10;
    margin-bottom:10px;
    padding-left:5px;
`;
const BadgeHeader = styled.div`
    width:60px;
    height:60px;
    margin-top:5px;
`;
const BadgeText = styled.div`
    font-size:16px;
    padding:6px 3px;
    display: flex;
    align-items: center;
`;
const BadgeImgWrapper = styled.div`
    width:60px;
    height:60px;
`;
const Img = styled.img`
    width:100%;
    height:60px;
`;

interface Badges {
    유저아이디: string[];
    뱃지이름: string;
    뱃지설명: string;
    뱃지이미지: string;
}

const BadgeContent = () => {
    const navigate = useNavigate()
    const [selectedMenu, setSelectedMenu] = useState("total")
    const [badges, setBadge] = useState<Badges[]>([])
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const q = query(collection(db, "badges"), orderBy("순서","asc"))
                const querySnapshot = await getDocs(q);

                const badgesArray: Badges[] = querySnapshot.docs.map((doc) => ({
                    뱃지이름: doc.data().뱃지이름,
                    뱃지설명: doc.data().뱃지설명,
                    유저아이디: doc.data().유저아이디,
                    뱃지이미지: doc.data().뱃지이미지
                }))
                setBadge(badgesArray)
            } catch {

            }
        }
        fetchBadges()
    }, [])

    const filteredBadges = selectedMenu === 'attainment'
        ? badges.filter(badge => badge.유저아이디.includes(currentUser?.uid || ''))
        : badges;

    return (
        <MoSlideModal onClose={() => navigate("/")}>
        <Wrapper>
            <ContentWrapper>
                <MenuWrapper>
                    <Menu selected={selectedMenu === 'total'} onClick={() => setSelectedMenu('total')}>전체 뱃지</Menu>
                    <Menu selected={selectedMenu === 'attainment'} onClick={() => setSelectedMenu('attainment')}>획득한 뱃지</Menu>
                </MenuWrapper>
                <BadgesWrapper>
                    {filteredBadges.length === 0 && selectedMenu === "attainment" ? (
                        <NoBadges>현재까지 획득한 뱃지가 없습니다</NoBadges>
                    ) : (
                        filteredBadges.map((badge) => (
                            <BadgesList key={badge.뱃지이름}>
                                <BadgeHeader>
                                    <BadgeImgWrapper>
                                        <Img src={badge.뱃지이미지} />
                                    </BadgeImgWrapper>
                                </BadgeHeader>
                                <BadgeText>
                                    {badge.뱃지설명}
                                </BadgeText>
                            </BadgesList>
                        ))
                    )}
                </BadgesWrapper>
            </ContentWrapper>
        </Wrapper>
        </MoSlideModal>
    )
}
export default BadgeContent